import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const INITIAL_VIEW = {
  center: [-98.5795, 39.8283],
  zoom: 3.5,
};

const STATUS_COLORS = {
  upcoming: '#f59e0b',
  live: '#ef4444',
  ended: '#94a3b8',
};

function resolveStyleUrl() {
  const key = import.meta.env.VITE_MAPTILER_KEY;
  if (key) {
    return `https://api.maptiler.com/maps/streets-v2/style.json?key=${key}`;
  }
  return 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
}

function toDisplayLocation(sale) {
  if (!sale?.loc?.lng || !sale?.loc?.lat) {
    return null;
  }

  if (!sale.approxUntilLive || sale.status === 'live') {
    return sale.loc;
  }

  const seed = sale.id ?? sale.address ?? `${sale.loc.lat}${sale.loc.lng}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
  }

  const angle = ((hash >>> 3) % 360) * (Math.PI / 180);
  const distanceMeters = 50 + ((hash >>> 11) % 60); // 50m – 110m offset
  const earthRadius = 6378137;
  const deltaLat = (distanceMeters * Math.cos(angle)) / earthRadius;
  const deltaLng = (distanceMeters * Math.sin(angle)) / (earthRadius * Math.cos((sale.loc.lat * Math.PI) / 180));

  return {
    lat: sale.loc.lat + (deltaLat * 180) / Math.PI,
    lng: sale.loc.lng + (deltaLng * 180) / Math.PI,
  };
}

function popupHtml(sale) {
  const start = sale.startsAt instanceof Date ? sale.startsAt : null;
  const end = sale.endsAt instanceof Date ? sale.endsAt : null;
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const dates = start && end ? `${dateFormatter.format(start)} – ${dateFormatter.format(end)}` : '';
  const directionsUrl = sale.loc?.lat
    ? `https://www.google.com/maps/dir/?api=1&destination=${sale.loc.lat},${sale.loc.lng}`
    : sale.address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sale.address)}`
      : '';

  return `
    <div style="max-width: 220px;">
      <strong>${sale.title}</strong><br/>
      <span>${sale.address ?? 'Address coming soon'}</span><br/>
      ${dates ? `<small>${dates}</small><br/>` : ''}
      ${directionsUrl ? `<a href="${directionsUrl}" target="_blank" rel="noreferrer">Directions</a>` : ''}
    </div>
  `;
}

export default function MapView({ sales, selectedSale }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return undefined;
    }

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: resolveStyleUrl(),
      center: INITIAL_VIEW.center,
      zoom: INITIAL_VIEW.zoom,
    });

    map.addControl(new maplibregl.NavigationControl({ showZoom: true }));
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    markersRef.current.forEach(({ marker }) => marker.remove());
    markersRef.current = [];

    sales
      .map((sale) => ({ sale, position: toDisplayLocation(sale) }))
      .filter((entry) => entry.position)
      .forEach(({ sale, position }) => {
        const popup = new maplibregl.Popup({ closeButton: false }).setHTML(popupHtml(sale));
        const marker = new maplibregl.Marker({ color: STATUS_COLORS[sale.status] ?? '#ef4444' })
          .setLngLat([position.lng, position.lat])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.push({ id: sale.id, marker, popup });
      });
  }, [sales]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedSale) {
      return;
    }

    const entry = markersRef.current.find((item) => item.id === selectedSale.id);
    if (!entry) {
      return;
    }

    const position = toDisplayLocation(selectedSale);
    if (!position) {
      return;
    }

    map.flyTo({
      center: [position.lng, position.lat],
      zoom: Math.max(map.getZoom(), 14),
      essential: true,
    });

    entry.popup?.addTo(map);
  }, [selectedSale]);

  return <div ref={containerRef} style={styles.mapContainer} />;
}

const styles = {
  mapContainer: {
    position: 'absolute',
    inset: 0,
  },
};