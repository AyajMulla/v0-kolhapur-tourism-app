"use client"

import { useState, useEffect } from "react"
import { X, MapPin, Star, Clock, Camera, Navigation, Phone, Globe, Utensils, Hotel } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WeatherModal from "./weather-modal"
import RouteModal from "./route-modal"
import { API_BASE_URL } from "@/lib/config"

export default function PlaceDetailModal({ place, onClose }) {
  const [showWeather, setShowWeather] = useState(false)
  const [showRoute, setShowRoute] = useState(false)

  const [restaurants, setRestaurants] = useState([])
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/restaurants`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/hotels`).then(res => res.json())
    ]).then(([r, h]) => {
      setRestaurants(r)
      setHotels(h)
      setLoading(false)
    }).catch(err => {
      console.error("Error fetching detail data", err)
      setLoading(false)
    })
  }, [])

  if (!place || loading) return null

  // Get nearby restaurants and hotels
  const nearbyRestaurants = restaurants.filter((restaurant) => place.nearbyRestaurants?.includes(restaurant.id))
  const nearbyHotels = hotels.filter((hotel) => place.nearbyHotels?.includes(hotel.id))

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent aria-describedby={undefined} showCloseButton={false} className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <DialogHeader className="relative">
            <Button onClick={onClose} variant="ghost" size="icon" className="absolute right-0 top-0 hover:bg-gray-100">
              <X className="h-5 w-5" />
            </Button>
            <DialogTitle className="text-2xl font-bold text-gray-800 pr-10">{place.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
              <img src={place.image || "/placeholder.svg"} alt={place.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge className="bg-orange-500/90 text-white mb-2">{place.category}</Badge>
                    <div className="flex items-center text-white">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{place.talukaName}</span>
                    </div>
                  </div>
                  <div className="flex items-center bg-black/30 rounded-lg px-3 py-1">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-white font-medium">{place.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center bg-orange-50 rounded-lg p-3">
                <Clock className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                <div className="text-sm font-medium text-gray-800">Duration</div>
                <div className="text-xs text-gray-600">{place.visitDuration}</div>
              </div>
              <div className="text-center bg-blue-50 rounded-lg p-3">
                <Star className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                <div className="text-sm font-medium text-gray-800">Rating</div>
                <div className="text-xs text-gray-600">{place.rating}/5</div>
              </div>
              <div className="text-center bg-green-50 rounded-lg p-3">
                <Camera className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <div className="text-sm font-medium text-gray-800">Category</div>
                <div className="text-xs text-gray-600">{place.category}</div>
              </div>
              <div className="text-center bg-purple-50 rounded-lg p-3">
                <MapPin className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                <div className="text-sm font-medium text-gray-800">Location</div>
                <div className="text-xs text-gray-600">{place.talukaName}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setShowWeather(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Navigation className="h-4 w-4 mr-2" />
                Check Weather
              </Button>
              <Button onClick={() => setShowRoute(true)} className="bg-green-600 hover:bg-green-700 text-white">
                <MapPin className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
              <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent">
                <Camera className="h-4 w-4 mr-2" />
                View Gallery
              </Button>
            </div>

            {/* Tabs Content */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
                <TabsTrigger value="hotels">Hotels</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">About This Place</h3>
                  <p className="text-gray-600 leading-relaxed">{place.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Best Time to Visit</h3>
                  <p className="text-gray-600">{place.bestTimeToVisit}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Visitor Tips</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Carry water and comfortable walking shoes</li>
                    <li>• Photography is allowed in most areas</li>
                    <li>• Local guides are available for detailed tours</li>
                    <li>• Respect local customs and traditions</li>
                    {place.visitorTips && place.visitorTips.map((tip, idx) => (
                      <li key={`custom-${idx}`}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="restaurants" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Nearby Restaurants ({nearbyRestaurants.length})
                  </h3>
                  {nearbyRestaurants.length > 0 ? (
                    <div className="grid gap-4">
                      {nearbyRestaurants.map((restaurant) => (
                        <Card key={restaurant.id} className="border border-orange-100">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-semibold text-gray-800">{restaurant.name}</h4>
                                <p className="text-orange-600 text-sm">{restaurant.cuisine}</p>
                              </div>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                <span className="text-sm font-medium">{restaurant.rating}</span>
                              </div>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{restaurant.address}</span>
                              </div>
                              <div className="flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                <span>{restaurant.phone}</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                              <span className="text-green-600 font-medium">{restaurant.priceRange}</span>
                              <div className="flex flex-wrap gap-1">
                                {restaurant.specialties?.slice(0, 2).map((specialty, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {specialty}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Utensils className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No nearby restaurants data available</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="hotels" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Nearby Hotels ({nearbyHotels.length})</h3>
                  {nearbyHotels.length > 0 ? (
                    <div className="grid gap-4">
                      {nearbyHotels.map((hotel) => (
                        <Card key={hotel.id} className="border border-blue-100">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-semibold text-gray-800">{hotel.name}</h4>
                                <p className="text-blue-600 text-sm">{hotel.category}</p>
                              </div>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                <span className="text-sm font-medium">{hotel.rating}</span>
                              </div>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{hotel.address}</span>
                              </div>
                              <div className="flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                <span>{hotel.phone}</span>
                              </div>
                              {hotel.website && (
                                <div className="flex items-center">
                                  <Globe className="h-3 w-3 mr-1" />
                                  <span className="text-blue-600">{hotel.website}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex justify-between items-center mt-3">
                              <span className="text-green-600 font-medium">{hotel.priceRange}</span>
                              <div className="flex flex-wrap gap-1">
                                {hotel.amenities?.slice(0, 2).map((amenity, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {amenity}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Hotel className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No nearby hotels data available</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Weather Modal */}
      {showWeather && <WeatherModal place={place} onClose={() => setShowWeather(false)} />}

      {/* Route Modal */}
      {showRoute && <RouteModal destination={place} onClose={() => setShowRoute(false)} />}
    </>
  )
}
