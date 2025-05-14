import L from "leaflet"

export const pulseMarkerIcon = new L.DivIcon({
  className: "", // boş bırak
  html: `<div class="custom-pulse-marker"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})
