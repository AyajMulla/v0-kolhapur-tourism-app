"use client"

import { Star, MapPin, Phone, Globe, Utensils, Hotel } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function NearbyPlaces({ restaurants = [], hotels = [] }) {
  const renderRestaurantCard = (restaurant) => (
    <Card key={restaurant.id} className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">{restaurant.name}</h4>
            <p className="text-orange-600 text-sm">{restaurant.cuisine}</p>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium">{restaurant.rating}</span>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="h-3 w-3 mr-2" />
            <span>{restaurant.address}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Phone className="h-3 w-3 mr-2" />
            <span>{restaurant.phone}</span>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-xs text-gray-600 mb-1">Specialties:</p>
          <div className="flex flex-wrap gap-1">
            {restaurant.specialties?.slice(0, 2).map((specialty, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-green-600 font-medium text-sm">{restaurant.priceRange}</span>
          <span className="text-gray-500 text-xs">{restaurant.openHours}</span>
        </div>
      </CardContent>
    </Card>
  )

  const renderHotelCard = (hotel) => (
    <Card key={hotel.id} className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">{hotel.name}</h4>
            <p className="text-blue-600 text-sm">{hotel.category}</p>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium">{hotel.rating}</span>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="h-3 w-3 mr-2" />
            <span>{hotel.address}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Phone className="h-3 w-3 mr-2" />
            <span>{hotel.phone}</span>
          </div>
          {hotel.website && (
            <div className="flex items-center text-gray-600 text-sm">
              <Globe className="h-3 w-3 mr-2" />
              <span className="text-blue-600">{hotel.website}</span>
            </div>
          )}
        </div>

        <div className="mb-3">
          <p className="text-xs text-gray-600 mb-1">Amenities:</p>
          <div className="flex flex-wrap gap-1">
            {hotel.amenities?.slice(0, 2).map((amenity, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-green-600 font-medium text-sm">{hotel.priceRange}</span>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs">
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Nearby Restaurants */}
      {restaurants.length > 0 && (
        <div>
          <div className="flex items-center mb-4">
            <Utensils className="h-5 w-5 text-orange-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Nearby Restaurants ({restaurants.length})</h3>
          </div>
          <div className="grid gap-4">{restaurants.map(renderRestaurantCard)}</div>
        </div>
      )}

      {/* Nearby Hotels */}
      {hotels.length > 0 && (
        <div>
          <div className="flex items-center mb-4">
            <Hotel className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Nearby Hotels ({hotels.length})</h3>
          </div>
          <div className="grid gap-4">{hotels.map(renderHotelCard)}</div>
        </div>
      )}

      {/* No Data Message */}
      {restaurants.length === 0 && hotels.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="flex justify-center space-x-4 mb-4">
            <Utensils className="h-12 w-12 text-gray-300" />
            <Hotel className="h-12 w-12 text-gray-300" />
          </div>
          <p>No nearby restaurants or hotels data available</p>
        </div>
      )}
    </div>
  )
}
