"use client"

import type React from "react"

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import { useState, useEffect } from "react"
import L from "leaflet"

// Özel marker ikonu
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -40],
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
  shadowAnchor: [14, 41],
})

interface MapComponentProps {
  onLocationSelect: (lat: number, lng: number) => void
  initialLat?: number
  initialLng?: number
}

function LocationSelector({
  onLocationSelect,
  setPosition,
}: {
  onLocationSelect: (lat: number, lng: number) => void
  setPosition: React.Dispatch<React.SetStateAction<[number, number] | null>>
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      setPosition([lat, lng])
      onLocationSelect(lat, lng)
    },
  })
  return null
}

export default function MapComponent({ onLocationSelect, initialLat, initialLng }: MapComponentProps) {
  const [position, setPosition] = useState<[number, number] | null>(null)

  useEffect(() => {
    if (initialLat !== undefined && initialLng !== undefined) {
      setPosition([initialLat, initialLng])
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          const coords: [number, number] = [latitude, longitude]
          setPosition(coords)
          onLocationSelect(latitude, longitude)
        },
        (err) => {
          console.warn("Konum alınamadı:", err)
          const fallback: [number, number] = [41.015137, 28.97953]
          setPosition(fallback)
          onLocationSelect(fallback[0], fallback[1])
        },
      )
    }
  }, [initialLat, initialLng])

  return position ? (
    <MapContainer center={position} zoom={13} scrollWheelZoom={true} className="rounded-lg w-full h-[400px] z-0">
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
      />
      <LocationSelector onLocationSelect={onLocationSelect} setPosition={setPosition} />
      <Marker position={position} icon={customIcon} />
    </MapContainer>
  ) : null
}
