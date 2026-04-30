"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Star, MapPin, Phone, Globe } from "lucide-react"
import { API_BASE_URL } from "@/lib/config"

export default function HotelsPage() {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/hotels`)
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 font-medium">Loading hotels...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        <Link href="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mb-6 transition-colors group">
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-orange-600 mb-2">Hotels in Kolhapur</h1>
        <p className="text-gray-500 mb-10">{hotels.length} properties available</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white shadow-md border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              {/* Hotel Image — using plain img tag to avoid Next.js domain restrictions */}
              <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                <img
                  src={hotel.image || `https://picsum.photos/seed/${hotel.id}/800/500`}
                  alt={hotel.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  className="group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = `https://picsum.photos/seed/${hotel.id}bk/800/500`;
                  }}
                />
                {/* Rating badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold text-gray-800">{hotel.rating}</span>
                </div>
                {/* Category badge */}
                <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  {hotel.category}
                </div>
              </div>

              <div className="p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-1">{hotel.name}</h2>

                {hotel.priceRange && (
                  <p className="text-orange-600 font-semibold text-sm mb-3">
                    {hotel.priceRange} <span className="text-gray-400 font-normal">/ night</span>
                  </p>
                )}

                {hotel.amenities && hotel.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {hotel.amenities.slice(0, 4).map((amenity, i) => (
                      <span key={i} className="bg-orange-50 text-orange-700 text-xs px-2 py-0.5 rounded-full border border-orange-100">
                        {amenity}
                      </span>
                    ))}
                    {hotel.amenities.length > 4 && (
                      <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                        +{hotel.amenities.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                <div className="space-y-1.5 text-sm text-gray-500">
                  {hotel.address && (
                    <div className="flex items-start gap-1.5">
                      <MapPin className="h-4 w-4 text-orange-400 mt-0.5 shrink-0" />
                      <span>{hotel.address}</span>
                    </div>
                  )}
                  {hotel.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-4 w-4 text-orange-400 shrink-0" />
                      <span>{hotel.phone}</span>
                    </div>
                  )}
                </div>

                {hotel.website && (
                  <a
                    href={hotel.website.startsWith("http") ? hotel.website : `https://${hotel.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center gap-1.5 text-orange-600 hover:text-orange-700 text-sm font-medium hover:underline"
                  >
                    <Globe className="h-4 w-4" />
                    Visit Website →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
