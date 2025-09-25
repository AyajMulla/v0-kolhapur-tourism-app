"use client"

import { useState } from "react"
import { Search, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { kolhapurTalukas } from "@/data/tourism-data"

export default function SearchSection({ onSearch }) {
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

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl">
      <h2 className="text-2xl font-semibold mb-6 text-white text-center">Find Your Perfect Destination</h2>

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

        {/* Taluka Selection */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
          <Select value={selectedTaluka} onValueChange={setSelectedTaluka}>
            <SelectTrigger className="pl-10 bg-white/90 border-white/30 text-gray-800 h-12">
              <SelectValue placeholder="Select Taluka" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Talukas</SelectItem>
              {kolhapurTalukas.map((taluka) => (
                <SelectItem key={taluka.id} value={taluka.id}>
                  {taluka.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Selection */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="pl-10 bg-white/90 border-white/30 text-gray-800 h-12">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Religious">Religious</SelectItem>
              <SelectItem value="Historical">Historical</SelectItem>
              <SelectItem value="Nature">Nature</SelectItem>
              <SelectItem value="Adventure">Adventure</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white h-12 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Search className="h-5 w-5 mr-2" />
          Search Now
        </Button>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedCategory("Religious")
            handleSearch()
          }}
          className="text-white hover:bg-white/20 border border-white/30"
        >
          Temples
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedCategory("Historical")
            handleSearch()
          }}
          className="text-white hover:bg-white/20 border border-white/30"
        >
          Forts
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedCategory("Nature")
            handleSearch()
          }}
          className="text-white hover:bg-white/20 border border-white/30"
        >
          Nature
        </Button>
      </div>
    </div>
  )
}
