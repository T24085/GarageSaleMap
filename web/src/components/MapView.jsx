import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || ''

export default function MapView ({ socket }) {
  const mapContainer = useRef(null)
  const mapRef = useRef(null)
  const [players, setPlayers] = useState({})

  useEffect(() => {
    if (mapRef.current) return
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [-95.3698, 29.7604],
      zoom: 10
    })
    return () => {
      mapRef.current?.remove()
    }
  }, [])

  useEffect(() => {
    if (!socket) return

    const handleLocation = (payload) => {
      setPlayers((prev) => ({ ...prev, [payload.userId]: payload }))
    }

    socket.on('player_location', handleLocation)

    return () => {
      socket.off('player_location', handleLocation)
    }
  }, [socket])

  useEffect(() => {
    if (!mapRef.current) return

    Object.values(players).forEach(({ userId, lat, lng }) => {
      const existing = mapRef.current._markers?.find((marker) => marker.userId === userId)
      if (existing) {
        existing.setLngLat([lng, lat])
        return
      }
      const marker = new mapboxgl.Marker({ color: '#FF5722' })
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>${userId}</strong>`))
        .addTo(mapRef.current)
      marker.userId = userId
      mapRef.current._markers = [...(mapRef.current._markers || []), marker]
    })
  }, [players])

  return <div ref={mapContainer} className="map" />
}
