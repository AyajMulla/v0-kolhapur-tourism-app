/* Homepage */
"use client"

import { useState } from "react"
import { Search, MapPin, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function HeroSection({ onSearch, talukas = [] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTaluka, setSelectedTaluka] = useState("")
  const [selectedTalukaName, setSelectedTalukaName] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  const handleSearch = () => {
    // Pass taluka name so hotel/restaurant address filtering works
    onSearch(searchQuery, selectedTaluka, selectedCategory)
  }

  const handleTalukaChange = (e) => {
    const val = e.target.value
    setSelectedTaluka(val)
    const t = talukas.find(t => t.id === val)
    setSelectedTalukaName(t ? t.name : "")
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background with multiple images */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 z-10" />
        <div className="grid grid-cols-2 md:grid-cols-6 h-full">
          <div
            className="bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{ backgroundImage: "url(/mahalaxmi-temple-kolhapur.jpg)" }}
          />
          <div
            className="bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{ backgroundImage: "url(/panhala-fort-maharashtra.jpg)" }}
          />
          <div
            className="bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{ backgroundImage: "url(/radhanagari-wildlife-sanctuary.jpg)" }}
          />
          <div
            className="bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{ backgroundImage: "url(/gaganbawada-hills-maharashtra.jpg)" }}
          />
          <div
            className="bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{ backgroundImage: "url(/kolhapur-new-palace-architecture.jpg)" }}
          />
          <div
            className="bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{ backgroundImage: "url(/dajipur-bison-sanctuary.jpg)" }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 text-center text-white px-4 max-w-6xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-shimmer">Discover Kolhapur</h1>
          <p className="text-xl md:text-2xl mb-4 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            The Cultural Capital of Maharashtra
          </p>
          <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Explore ancient temples, majestic forts, royal palaces, and pristine wildlife sanctuaries. Experience the
            rich Maratha heritage, authentic Kolhapuri cuisine, and warm hospitality that makes Kolhapur a truly
            unforgettable destination.
          </p>
        </div>

        {/* Enhanced Search Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-white">Plan Your Perfect Trip</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search places, temples, forts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 bg-white/90 border-white/30 text-gray-800 placeholder-gray-500 h-12"
              />
            </div>

            {/* Taluka Selection - native select for reliable rendering */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5 z-10 pointer-events-none" />
              <select
                value={selectedTaluka}
                onChange={handleTalukaChange}
                className="w-full pl-10 pr-4 h-12 rounded-md bg-white border border-gray-200 text-gray-800 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 appearance-none cursor-pointer"
              >
                <option value="">All Talukas</option>
                {talukas.map((taluka) => (
                  <option key={taluka.id} value={taluka.id}>
                    {taluka.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            {/* Category Selection - native select for reliable rendering */}
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5 z-10 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 h-12 rounded-md bg-white border border-gray-200 text-gray-800 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 appearance-none cursor-pointer"
              >
                <option value="">All Categories</option>
                <option value="Religious">Religious</option>
                <option value="Historical">Historical</option>
                <option value="Nature">Nature</option>
                <option value="Adventure">Adventure</option>
                <option value="Wildlife">Wildlife</option>
                <option value="Scenic">Scenic</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white h-12 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Search className="h-5 w-5 mr-2" />
              Explore Now
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold text-orange-300">50+</div>
              <div className="text-sm text-gray-300">Tourist Places</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold text-red-300">12</div>
              <div className="text-sm text-gray-300">Talukas</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold text-yellow-300">100+</div>
              <div className="text-sm text-gray-300">Restaurants</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-300">25+</div>
              <div className="text-sm text-gray-300">Hotels</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
