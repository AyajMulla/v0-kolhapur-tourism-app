"use client"

import dynamic from "next/dynamic"

const Map = dynamic(() => import("./map"), { 
  ssr: false,
  loading: () => <div className="h-64 md:h-80 w-full bg-gray-100/50 rounded-xl animate-pulse" />
})

export default function MapView({ lat, lng, coordinates, name, zoom = 12, showRoute = false }) {
  const position = coordinates || [lat || 16.7050, lng || 74.2433]
  return <Map position={position} name={name} zoom={zoom} showRoute={showRoute} destinationCoords={coordinates} />
}
