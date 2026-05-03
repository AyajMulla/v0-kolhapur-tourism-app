"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

export default function Map({ position, name, zoom, showRoute, destinationCoords }) {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const routingControlRef = useRef(null)
  const [targetCoords, setTargetCoords] = useState(position || [16.705, 74.243])

  // 1. Geocode the name if showRoute is needed, to get accurate destination coordinates
  useEffect(() => {
    if (showRoute) {
      if (destinationCoords && Array.isArray(destinationCoords) && destinationCoords.length === 2) {
        setTargetCoords(destinationCoords)
      } else if (name) {
        // Small delay to prevent rate limiting
        const timer = setTimeout(() => {
          // Search just by the place name and state to improve OpenStreetMap Nominatim results
          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(name + ", Maharashtra, India")}`)
            .then(res => res.json())
            .then(data => {
              if (data && data.length > 0) {
                setTargetCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)])
              } else {
                // Fallback query if first one fails
                fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(name)}`)
                  .then(res => res.json())
                  .then(fallbackData => {
                    if (fallbackData && fallbackData.length > 0) {
                      setTargetCoords([parseFloat(fallbackData[0].lat), parseFloat(fallbackData[0].lon)])
                    }
                  })
              }
            })
            .catch(err => console.error("Geocoding failed:", err))
        }, 500)
        return () => clearTimeout(timer)
      }
    } else {
      setTargetCoords(position)
    }
  }, [name, position, showRoute, destinationCoords])

  // 2. Initialize map and draw routes or markers
  useEffect(() => {
    // Fix leaflet icon issue in Next.js
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    })

    if (!mapContainerRef.current) return

    // Ensure we don't initialize the map multiple times
    if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
    }

    // Load routing machine explicitly on client side
    require("leaflet-routing-machine")
    require("leaflet-routing-machine/dist/leaflet-routing-machine.css")

    if (!targetCoords || !Array.isArray(targetCoords) || targetCoords.length !== 2) return

    const map = L.map(mapContainerRef.current).setView(targetCoords, zoom)
    mapInstanceRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map)

    if (showRoute) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (mapInstanceRef.current !== map) return;
            const userLat = pos.coords.latitude
            const userLng = pos.coords.longitude
            
            const userLoc = L.latLng(userLat, userLng)
            const destLoc = L.latLng(targetCoords[0], targetCoords[1])
            
            routingControlRef.current = L.Routing.control({
              waypoints: [userLoc, destLoc],
              routeWhileDragging: false,
              showAlternatives: true,
              addWaypoints: false,
              fitSelectedRoutes: true,
              router: L.Routing.osrmv1({
                serviceUrl: 'https://router.project-osrm.org/route/v1',
                timeout: 30000 // Increase timeout to 30s
              }),
              lineOptions: {
                styles: [{ color: '#f97316', weight: 5, opacity: 0.9 }]
              },
              createMarker: function(i, wp, nWps) {
                if (i === 0) {
                  return L.marker(wp.latLng).bindPopup("Your Live Location")
                } else if (i === nWps - 1) {
                  return L.marker(wp.latLng).bindPopup(name || "Destination")
                }
                return null;
              }
            }).addTo(map)

            // Add error handling for routing
            routingControlRef.current.on('routingerror', (e) => {
              console.error("Routing error:", e.error);
              if (mapInstanceRef.current === map) {
                const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${targetCoords[0]},${targetCoords[1]}&travelmode=driving`;
                L.popup()
                  .setLatLng(targetCoords)
                  .setContent(`
                    <div class="p-2">
                      <p class="text-sm font-medium mb-2">Routing service is currently slow.</p>
                      <a href="${googleMapsUrl}" target="_blank" class="block text-center px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors">
                        Open in Google Maps
                      </a>
                    </div>
                  `)
                  .openOn(map);
              }
            });
          },
          (err) => {
            console.error("Geolocation error:", err)
            if (mapInstanceRef.current === map) {
              L.marker(targetCoords).addTo(map).bindPopup((name || "Destination") + " (Location Access Denied)").openPopup()
            }
          },
          { enableHighAccuracy: false, timeout: 30000, maximumAge: 0 }
        )
      } else {
        L.marker(targetCoords).addTo(map).bindPopup((name || "Destination") + " (Location Not Supported)").openPopup()
      }
    } else {
      const marker = L.marker(targetCoords).addTo(map)
      if (name) marker.bindPopup(name)
    }

    return () => {
      if (routingControlRef.current && mapInstanceRef.current) {
        try {
          mapInstanceRef.current.removeControl(routingControlRef.current)
        } catch(e) {}
        routingControlRef.current = null
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off()
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [targetCoords, name, zoom, showRoute])

  return (
    <div className={`w-full rounded-xl overflow-hidden relative z-0 border border-gray-200 shadow-sm ${showRoute ? 'h-[500px] md:h-[600px]' : 'h-64 md:h-80'}`}>
      <div ref={mapContainerRef} style={{ height: "100%", width: "100%", zIndex: 0 }} />
    </div>
  )
}
