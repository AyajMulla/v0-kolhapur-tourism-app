"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export default function HotelsPage() {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:5000/api/hotels")
      .then((res) => res.json())
      .then((data) => {
        setHotels(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching hotels", err)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="text-center p-10">Loading hotels...</div>;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-orange-600 mb-10">Hotels in Kolhapur</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-white shadow-md border rounded-xl overflow-hidden hover:shadow-xl transition"
          >
            <div className="relative h-48 w-full">
              <Image
                src={hotel.image || "/placeholder.jpg"}
                alt={hotel.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-5">
              <h2 className="text-xl font-semibold">{hotel.name}</h2>
              <p className="text-gray-500 text-sm">{hotel.category}</p>

              <p className="mt-2 text-gray-700">
                ⭐ {hotel.rating} &nbsp;|&nbsp; {hotel.priceRange}
              </p>

              <p className="text-sm text-gray-600 mt-2">
                <strong>Amenities:</strong> {hotel.amenities.join(", ")}
              </p>

              <p className="text-sm text-gray-500 mt-2">📍 {hotel.address}</p>
              <p className="text-sm text-gray-500">☎ {hotel.phone}</p>

              {hotel.website && (
                <a
                  href={`https://${hotel.website}`}
                  target="_blank"
                  className="text-orange-600 mt-3 inline-block text-sm font-medium hover:underline"
                >
                  Visit Website →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
