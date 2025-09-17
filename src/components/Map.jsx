import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const INITIAL_VIEW = {
  center: [-98.5795, 39.8283],
  zoom: 3.5,
};

function resolveStyleUrl() {
  const key = import.meta.env.VITE_MAPTILER_KEY;
  if (key) {
    return `https://api.maptiler.com/maps/streets-v2/style.json?key=${key}`;
  }
  return 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
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

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    sales
      .filter((sale) => sale?.loc?.lng != null && sale?.loc?.lat != null)
      .forEach((sale) => {
        const popup = new maplibregl.Popup({ closeButton: false }).setHTML(
          `<strong>${sale.title}</strong><br />${sale.address ?? 'Address coming soon'}`,
        );

        const marker = new maplibregl.Marker({ color: '#ef4444' })
          .setLngLat([sale.loc.lng, sale.loc.lat])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.push(marker);
      });
  }, [sales]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedSale?.loc) {
      return;
    }

    map.flyTo({
      center: [selectedSale.loc.lng, selectedSale.loc.lat],
      zoom: Math.max(map.getZoom(), 14),
      essential: true,
    });
  }, [selectedSale]);

  return <div ref={containerRef} style={styles.mapContainer} />;
}

const styles = {
  mapContainer: {
    position: 'absolute',
    inset: 0,
  },
};