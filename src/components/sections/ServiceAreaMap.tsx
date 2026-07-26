import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  serviceAreaLocations,
  serviceAreaPolygon,
} from '../../data/serviceAreaMap'

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

export function ServiceAreaMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || mapInstanceRef.current) return

    L.Marker.prototype.options.icon = DefaultIcon

    const map = L.map(container, {
      scrollWheelZoom: false,
      attributionControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map)

    const polygon = L.polygon(
      serviceAreaPolygon.map((p) => [p.lat, p.lng] as [number, number]),
      {
        color: '#d35400',
        weight: 2,
        opacity: 0.95,
        fillColor: '#d35400',
        fillOpacity: 0.22,
      },
    ).addTo(map)

    serviceAreaLocations.forEach((location) => {
      L.marker([location.lat, location.lng]).addTo(map).bindPopup(location.name)
    })

    map.fitBounds(polygon.getBounds(), { padding: [28, 28] })
    mapInstanceRef.current = map

    requestAnimationFrame(() => map.invalidateSize())

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  return (
    <div className="service-area-map">
      <div
        ref={containerRef}
        className="service-area-map__canvas"
        role="img"
        aria-label="Karte des Servicegebiets im Münchner Großraum mit markiertem Einsatzgebiet"
      />
    </div>
  )
}
