"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { API_BASE_URL } from "@/lib/config"

export default function FoodPage() {
  const [talukaRestaurantMap, setTalukaRestaurantMap] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/places`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/restaurants`).then(res => res.json())
    ]).then(([places, restaurants]) => {
      const map = {}

      places.forEach(place => {
        if (!map[place.talukaName]) map[place.talukaName] = []
        
        place.nearbyRestaurants?.forEach(resId => {
          const restaurant = restaurants.find(r => r.id === resId)
          if (restaurant && !map[place.talukaName].some(r => r.id === restaurant.id)) {
            map[place.talukaName].push(restaurant)
          }
        })
      })

      // Unmatched restaurants
      const matchedResIds = new Set(Object.values(map).flat().map(r => r.id))
      const unmatched = restaurants.filter(r => !matchedResIds.has(r.id))
      if (unmatched.length > 0) {
        map["Other Restaurants"] = unmatched
      }

      setTalukaRestaurantMap(map)
      setLoading(false)
    }).catch(err => {
      console.error("Error fetching food data", err)
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="text-center p-10">Loading restaurants...</div>;

  // ---- UI START ----
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-orange-600 mb-10">Restaurants by Taluka</h1>

      {Object.keys(talukaRestaurantMap).map((talukaName) => {
        const restaurants = talukaRestaurantMap[talukaName]
        if (restaurants.length === 0) return null

        return (
          <div key={talukaName} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{talukaName}</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {restaurants.map((rest) => (
                <div
                  key={rest.id}
                  className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition border"
                >
                  {/* Restaurant Image */}
                  <div className="relative h-48 w-full">
                    <Image
                      src={rest.image || "/placeholder.jpg"}
                      alt={rest.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-800">{rest.name}</h3>
                    <p className="text-gray-600 text-sm">{rest.cuisine}</p>

                    <p className="mt-2 text-yellow-600 font-medium">⭐ {rest.rating}</p>
                    <p className="text-sm text-orange-600">Price: {rest.priceRange}</p>

                    <p className="text-sm text-gray-700 mt-2">
                      <strong>Specialties:</strong> {rest.specialties.join(", ")}
                    </p>

                    <p className="text-sm text-gray-500 mt-2">📍 {rest.address}</p>
                    <p className="text-sm text-gray-500">☎ {rest.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
