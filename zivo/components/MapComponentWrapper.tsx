"use client"

import dynamic from "next/dynamic"

// SSR devre dışı — leaflet sadece client tarafında çalışır
export const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
})
