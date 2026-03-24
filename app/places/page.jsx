"use client"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Search, SlidersHorizontal, Star, ArrowLeft } from "lucide-react"
import PlaceDetailModal from "@/components/place-detail-modal"
import { API_BASE_URL } from "@/lib/config"

export default function PlacesPage() {
  const [touristPlaces, setTouristPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPlace, setSelectedPlace] = useState(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedTaluka, setSelectedTaluka] = useState("All")
  const [sortBy, setSortBy] = useState("rating-desc")

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/places`)
      .then(res => res.json())
      .then(data => {
        setTouristPlaces(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching places", err)
        setLoading(false)
      })
  }, [])

  // Generate unique categories and talukas
  const categories = ["All", ...new Set(touristPlaces.map((p) => p.category))]
  const talukas = ["All", ...new Set(touristPlaces.map((p) => p.talukaName || p.talukaId || "Kolhapur"))]

  // Filtering + sorting logic
  const filteredPlaces = useMemo(() => {
    let places = touristPlaces

    // Search filter
    if (searchQuery.trim() !== "") {
      places = places.filter((p) =>
        (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategory !== "All") {
      places = places.filter((p) => p.category === selectedCategory)
    }

    // Taluka filter
    if (selectedTaluka !== "All") {
      places = places.filter((p) => {
        const tName = p.talukaName || p.talukaId || "Kolhapur";
        return tName === selectedTaluka;
      })
    }

    // Sorting
    if (sortBy === "rating-desc") {
      places = [...places].sort((a, b) => b.rating - a.rating)
    } else if (sortBy === "rating-asc") {
      places = [...places].sort((a, b) => a.rating - b.rating)
    }

    return places
  }, [searchQuery, selectedCategory, selectedTaluka, sortBy, touristPlaces])

  if (loading) return <div className="text-center p-10">Loading places...</div>;

  return (
    <div className="container mx-auto px-4 py-10">
      <Link href="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mb-6 transition-colors group">
        <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Explore
      </Link>

      {/* Page Title */}
      <h1 className="text-4xl font-bold text-orange-600 mb-6">Explore Tourist Places</h1>
      
      {/* Filters Section */}
      <div className="bg-white shadow-sm border p-5 rounded-xl mb-10">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">

          {/* Search */}
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
            <Search className="h-5 w-5 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-700"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded-lg px-3 py-2 text-gray-700"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Taluka Filter */}
          <select
            value={selectedTaluka}
            onChange={(e) => setSelectedTaluka(e.target.value)}
            className="border rounded-lg px-3 py-2 text-gray-700"
          >
            {talukas.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Sorting */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg px-3 py-2 text-gray-700"
          >
            <option value="rating-desc">Rating: High → Low</option>
            <option value="rating-asc">Rating: Low → High</option>
          </select>

        </div>
      </div>

      {/* Results Count */}
      <p className="text-gray-600 font-medium mb-5">
        Showing {filteredPlaces.length} places
      </p>

      {/* Places Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPlaces.map((place) => (
          <div 
            key={place.id}
            className="bg-white rounded-xl shadow-md hover:shadow-2xl transition border overflow-hidden cursor-pointer"
            onClick={() => setSelectedPlace(place)}
          >
            {/* Image */}
            <div className="relative h-52 w-full">
              <Image
                src={place.image || "/placeholder.jpg"}
                alt={place.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-5">
              <h2 className="text-xl font-semibold text-gray-800">{place.name}</h2>

              <div className="flex items-center text-gray-500 text-sm mt-1">
                <MapPin className="h-4 w-4 mr-1 text-orange-600" />
                {place.talukaName || place.talukaId || "Kolhapur"}
              </div>

              <p className="mt-2 text-gray-700 text-sm">
                {place.description.slice(0, 120)}...
              </p>

              <p className="mt-2 text-orange-600 text-sm font-semibold">
                {place.category}
              </p>

              <div className="mt-2 flex items-center text-yellow-500">
                <Star className="h-4 w-4 mr-1" />
                <span className="font-medium">{place.rating}</span>
              </div>

              <p className="text-sm text-gray-600 mt-2">
                Best Time: {place.bestTimeToVisit}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedPlace && (
        <PlaceDetailModal place={selectedPlace} onClose={() => setSelectedPlace(null)} />
      )}
    </div>
  )
}
