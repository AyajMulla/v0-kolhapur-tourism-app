"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, MapPin, Star, Clock, Phone, Globe, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import PlaceDetailModal from "./place-detail-modal"
import { API_BASE_URL } from "@/lib/config"

export default function SearchResults({ searchQuery, selectedTaluka, selectedCategory, onClearSearch }) {
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [activeTab, setActiveTab] = useState("places")

  const [touristPlaces, setTouristPlaces] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/places`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/restaurants`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/hotels`).then(res => res.json())
    ]).then(([p, r, h]) => {
      setTouristPlaces(p)
      setRestaurants(r)
      setHotels(h)
      setLoading(false)
    }).catch(err => {
      console.error("Error fetching search data", err)
      setLoading(false)
    })
  }, [])

  // Filter function with null checks
  const filterResults = (items, type) => {
    return items.filter((item) => {
      const matchesQuery =
        !searchQuery ||
        (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.cuisine && item.cuisine.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.specialties &&
          item.specialties.some(
            (specialty) => specialty && specialty.toLowerCase().includes(searchQuery.toLowerCase()),
          ))

      // Taluka filter: selectedTaluka is the taluka ID
      // For places: match talukaId directly
      // For hotels/restaurants: match by address containing taluka name
      const noTalukaFilter = !selectedTaluka || selectedTaluka === "all"
      const matchesTaluka =
        noTalukaFilter ||
        (type === "places" &&
          (item.talukaId === selectedTaluka || item.talukaName?.toLowerCase() === selectedTaluka.toLowerCase())) ||
        (type !== "places" &&
          item.address && item.address.toLowerCase().includes(selectedTaluka.toLowerCase()))

      const noCategoryFilter = !selectedCategory || selectedCategory === "all"
      const matchesCategory =
        noCategoryFilter || (item.category && item.category === selectedCategory)

      return matchesQuery && matchesTaluka && matchesCategory
    })
  }

  const filteredResults = useMemo(() => {
    const places = filterResults(touristPlaces, "places")
    const restaurantResults = filterResults(restaurants, "restaurants")
    const hotelResults = filterResults(hotels, "hotels")

    return {
      places,
      restaurants: restaurantResults,
      hotels: hotelResults,
      total: places.length + restaurantResults.length + hotelResults.length,
    }
  }, [searchQuery, selectedTaluka, selectedCategory, touristPlaces, restaurants, hotels])

  const renderPlaceCard = (place) => (
    <Card
      key={place.id}
      className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white/90 backdrop-blur-sm hover:-translate-y-1 overflow-hidden"
      onClick={() => setSelectedPlace(place)}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={place.image || "/placeholder.jpg"}
          alt={place.name || "Tourist place"}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { e.target.src = "/placeholder.jpg"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <Badge className="bg-orange-500/90 text-white mb-2">{place.category || "General"}</Badge>
          <h3 className="text-white font-bold text-lg mb-1">{place.name || "Unknown Place"}</h3>
          <div className="flex items-center text-white/90 text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{place.talukaName || "Kolhapur"}</span>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium">{place.rating || "4.0"}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            <span>{place.visitDuration || "2-3 hours"}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2">{place.description || "Beautiful tourist destination"}</p>
      </CardContent>
    </Card>
  )

  const renderRestaurantCard = (restaurant) => (
    <Card
      key={restaurant.id}
      className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm hover:-translate-y-1"
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{restaurant.name || "Restaurant"}</h3>
            <p className="text-orange-600 font-medium">{restaurant.cuisine || "Multi-cuisine"}</p>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="font-medium">{restaurant.rating || "4.0"}</span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">{restaurant.address || "Kolhapur"}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Phone className="h-4 w-4 mr-2" />
            <span className="text-sm">{restaurant.phone || "Contact available"}</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Specialties:</p>
          <div className="flex flex-wrap gap-1">
            {(restaurant.specialties || ["Local cuisine"]).slice(0, 3).map((specialty, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-green-600">{restaurant.priceRange || "₹200-400"}</span>
          <span className="text-sm text-gray-500">{restaurant.openHours || "Open daily"}</span>
        </div>
      </CardContent>
    </Card>
  )

  const renderHotelCard = (hotel) => (
    <Card
      key={hotel.id}
      className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm hover:-translate-y-1"
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{hotel.name || "Hotel"}</h3>
            <p className="text-blue-600 font-medium">{hotel.category || "Standard"}</p>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="font-medium">{hotel.rating || "4.0"}</span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">{hotel.address || "Kolhapur"}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Phone className="h-4 w-4 mr-2" />
            <span className="text-sm">{hotel.phone || "Contact available"}</span>
          </div>
          {hotel.website && (
            <div className="flex items-center text-gray-600">
              <Globe className="h-4 w-4 mr-2" />
              <span className="text-sm">{hotel.website}</span>
            </div>
          )}
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Amenities:</p>
          <div className="flex flex-wrap gap-1">
            {(hotel.amenities || ["Basic amenities"]).slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-green-600">{hotel.priceRange || "₹2000-4000"}</span>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const tabs = [
    { id: "places", label: "Places", count: filteredResults.places.length },
    { id: "restaurants", label: "Restaurants", count: filteredResults.restaurants.length },
    { id: "hotels", label: "Hotels", count: filteredResults.hotels.length },
  ]

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-100 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Search Results</h2>
            <p className="text-gray-600">
              Found {filteredResults.total} results
              {searchQuery && ` for "${searchQuery}"`}
              {selectedTaluka && selectedTaluka !== "all" && ` in ${selectedTaluka}`}
              {selectedCategory && selectedCategory !== "all" && ` in ${selectedCategory} category`}
            </p>
          </div>
          <Button
            onClick={onClearSearch}
            variant="outline"
            className="border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent"
          >
            <X className="h-4 w-4 mr-2" />
            Clear Search
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-6 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === "places" &&
          filteredResults.places.map((place) => <div key={place.id || Math.random()}>{renderPlaceCard(place)}</div>)}
        {activeTab === "restaurants" &&
          filteredResults.restaurants.map((restaurant) => (
            <div key={restaurant.id || Math.random()}>{renderRestaurantCard(restaurant)}</div>
          ))}
        {activeTab === "hotels" &&
          filteredResults.hotels.map((hotel) => <div key={hotel.id || Math.random()}>{renderHotelCard(hotel)}</div>)}
      </div>

      {/* No Results */}
      {filteredResults.total === 0 && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No results found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search criteria or browse all places</p>
          <Button onClick={onClearSearch} className="bg-orange-500 hover:bg-orange-600">
            Browse All Places
          </Button>
        </div>
      )}

      {/* Place Detail Modal */}
      {selectedPlace && <PlaceDetailModal place={selectedPlace} onClose={() => setSelectedPlace(null)} />}
    </div>
  )
}
