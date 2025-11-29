"use client"

import { kolhapurTalukas, kolhapurRestaurants } from "@/data/tourism-data"
import Image from "next/image"

export default function FoodPage() {
  // ---- STEP 1: Build taluka → restaurants grouping ----
  const talukaRestaurantMap = {}

  // initialize each taluka
  kolhapurTalukas.forEach((taluka) => {
    talukaRestaurantMap[taluka.name] = []
  })

  // scan each place → assign nearby restaurants to correct taluka
  kolhapurTalukas.forEach((taluka) => {
    taluka.places.forEach((place) => {
      place.nearbyRestaurants?.forEach((resId) => {
        const restaurant = kolhapurRestaurants.find((r) => r.id === resId)
        if (restaurant && !talukaRestaurantMap[taluka.name].some((r) => r.id === restaurant.id)) {
          talukaRestaurantMap[taluka.name].push(restaurant)
        }
      })
    })
  })

  // restaurants not matched to any taluka
  const unmatchedRestaurants = kolhapurRestaurants.filter(
    (res) => !Object.values(talukaRestaurantMap).flat().some((r) => r.id === res.id)
  )

  if (unmatchedRestaurants.length > 0) {
    talukaRestaurantMap["Other Restaurants"] = unmatchedRestaurants
  }

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
                      src={rest.image || "/default-food.jpg"}
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
