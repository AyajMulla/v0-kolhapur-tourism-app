"use client"

import { useState } from "react"
import { Search, MapPin, Filter, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { kolhapurTalukas } from "@/data/tourism-data"

export default function EnhancedSearchSection({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTaluka, setSelectedTaluka] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery, selectedTaluka, selectedCategory)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const quickSearches = [
    { label: "Sacred Temples", category: "Religious", icon: "🕉️" },
    { label: "Historic Forts", category: "Historical", icon: "🏰" },
    { label: "Natural Beauty", category: "Nature", icon: "🌿" },
    { label: "Adventure Spots", category: "Adventure", icon: "⛰️" },
  ]

  return (
    <div className="relative">
      {/* Premium Search Container */}
      <div className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl luxury-card">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 text-yellow-300 mr-2" />
            <h2 className="text-3xl font-bold text-white text-shimmer">Discover Kolhapur</h2>
            <Sparkles className="h-6 w-6 text-yellow-300 ml-2" />
          </div>
          <p className="text-white/80 text-lg">Find your perfect destination in the cultural capital</p>
        </div>

        {/* Main Search Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Search Input */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-orange-500 transition-colors" />
            <Input
              placeholder="Search places, temples, forts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-12 pr-4 h-14 bg-white/95 border-2 border-white/30 focus:border-orange-400 text-gray-800 placeholder-gray-500 rounded-xl font-medium shadow-lg backdrop-blur-sm transition-all duration-300 focus:shadow-xl"
            />
          </div>

          {/* Taluka Selection */}
          <div className="relative group">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10 group-focus-within:text-orange-500 transition-colors" />
            <Select value={selectedTaluka} onValueChange={setSelectedTaluka}>
              <SelectTrigger className="pl-12 pr-4 h-14 bg-white/95 border-2 border-white/30 focus:border-orange-400 text-gray-800 rounded-xl font-medium shadow-lg backdrop-blur-sm transition-all duration-300">
                <SelectValue placeholder="Select Taluka" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-sm border border-orange-200 rounded-xl shadow-xl">
                <SelectItem value="all" className="font-medium">
                  All Talukas
                </SelectItem>
                {kolhapurTalukas.map((taluka) => (
                  <SelectItem key={taluka.id} value={taluka.id} className="font-medium">
                    {taluka.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Selection */}
          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10 group-focus-within:text-orange-500 transition-colors" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="pl-12 pr-4 h-14 bg-white/95 border-2 border-white/30 focus:border-orange-400 text-gray-800 rounded-xl font-medium shadow-lg backdrop-blur-sm transition-all duration-300">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-sm border border-orange-200 rounded-xl shadow-xl">
                <SelectItem value="all" className="font-medium">
                  All Categories
                </SelectItem>
                <SelectItem value="Religious" className="font-medium">
                  Religious Sites
                </SelectItem>
                <SelectItem value="Historical" className="font-medium">
                  Historical Places
                </SelectItem>
                <SelectItem value="Nature" className="font-medium">
                  Natural Attractions
                </SelectItem>
                <SelectItem value="Adventure" className="font-medium">
                  Adventure Sports
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            className="h-14 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 luxury-button"
          >
            <Search className="h-6 w-6 mr-2" />
            Explore Now
          </Button>
        </div>

        {/* Quick Search Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {quickSearches.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              onClick={() => {
                setSelectedCategory(item.category)
                setTimeout(handleSearch, 100)
              }}
              className="h-12 bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/50 text-white font-medium rounded-xl transition-all duration-300 backdrop-blur-sm group"
            >
              <span className="mr-2 text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
              {item.label}
            </Button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
            <div className="text-2xl font-bold text-orange-300 mb-1">50+</div>
            <div className="text-white/80 text-sm">Tourist Places</div>
          </div>
          <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
            <div className="text-2xl font-bold text-red-300 mb-1">12</div>
            <div className="text-white/80 text-sm">Talukas</div>
          </div>
          <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
            <div className="text-2xl font-bold text-yellow-300 mb-1">100+</div>
            <div className="text-white/80 text-sm">Restaurants</div>
          </div>
          <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
            <div className="text-2xl font-bold text-green-300 mb-1">25+</div>
            <div className="text-white/80 text-sm">Hotels</div>
          </div>
        </div>
      </div>
    </div>
  )
}
