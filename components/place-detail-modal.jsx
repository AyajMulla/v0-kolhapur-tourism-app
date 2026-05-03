"use client"

import { useState, useEffect } from "react"
import { X, MapPin, Star, Phone, Globe, Clock, Utensils, Hotel, Navigation, Cloud, Heart, Camera, Info, Calendar, Lightbulb } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WeatherModal from "./weather-modal"
import RouteModal from "./route-modal"
import MapView from "./map-view"
import LoginModal from "./login-modal"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { API_BASE_URL } from "@/lib/config"

export default function PlaceDetailModal({ place, onClose }) {
  const [showWeather, setShowWeather] = useState(false)
  const [showRoute, setShowRoute] = useState(false)

  const [restaurants, setRestaurants] = useState([])
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  
  const { user, toggleFavorite } = useAuth()
  const { toast } = useToast()

  const handleToggleFavorite = async (e, placeId) => {
    e.stopPropagation()
    if (!user) {
      setIsLoginModalOpen(true)
      return
    }
    
    try {
      const isFavInitially = user.favorites?.includes(placeId);
      await toggleFavorite(placeId);
      toast({
        title: isFavInitially ? "Removed from Wishlist" : "Added to Wishlist",
        description: isFavInitially ? "Place removed from your planned trip." : "Place added to your planned trip!",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      })
    }
  }

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

  if (!place) return null

  // Get nearby restaurants and hotels
  let nearbyRestaurants = [];
  if (place.nearbyRestaurants && place.nearbyRestaurants.length > 0) {
    // Use only explicitly linked restaurants if they exist
    nearbyRestaurants = restaurants.filter((r) => place.nearbyRestaurants.includes(r.id));
  } else {
    // Fallback to same Taluka but limit to 4
    nearbyRestaurants = restaurants.filter((r) => {
      const resTaluka = (r.talukaName || "").trim().toLowerCase();
      const resTalukaId = (r.talukaId || "").trim().toLowerCase();
      const placeTaluka = (place.talukaName || "").trim().toLowerCase();
      const placeTalukaId = (place.talukaId || "").trim().toLowerCase();
      return (resTaluka && resTaluka === placeTaluka) || (resTalukaId && resTalukaId === placeTalukaId);
    }).slice(0, 4);
  }

  let nearbyHotels = [];
  if (place.nearbyHotels && place.nearbyHotels.length > 0) {
    // Use only explicitly linked hotels if they exist
    nearbyHotels = hotels.filter((h) => place.nearbyHotels.includes(h.id));
  } else {
    // Fallback to same Taluka but limit to 4
    nearbyHotels = hotels.filter((h) => {
      const hotTaluka = (h.talukaName || "").trim().toLowerCase();
      const hotTalukaId = (h.talukaId || "").trim().toLowerCase();
      const placeTaluka = (place.talukaName || "").trim().toLowerCase();
      const placeTalukaId = (place.talukaId || "").trim().toLowerCase();
      return (hotTaluka && hotTaluka === placeTaluka) || (hotTalukaId && hotTalukaId === placeTalukaId);
    }).slice(0, 4);
  }

  return (
    <>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Content Box */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl z-10 flex flex-col border border-gray-200/50">
        
        {/* Absolute Floating Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2.5 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 hover:scale-105 transition-all shadow-lg"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>

        {/* Full Bleed Hero Image */}
        <div className="relative h-72 md:h-96 w-full shrink-0">
          <img 
            src={place.image || "/placeholder.jpg"} 
            alt={place.name} 
            className="w-full h-full object-cover" 
            onError={(e) => { e.target.src = "/placeholder.jpg"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/40 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm">{place.category}</Badge>
                <div className="flex items-center text-white/90 text-sm font-medium bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-lg">
                  <MapPin className="h-4 w-4 mr-1.5 text-orange-400" />
                  <span>{place.talukaName}</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight max-w-2xl">{place.name}</h2>
                
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center bg-white/20 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/10 shadow-lg">
                    <Star className="h-5 w-5 text-yellow-400 mr-2 fill-yellow-400" />
                    <span className="text-white font-bold text-lg">{place.rating}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-2xl h-11 w-11 bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/10 transition-all shadow-lg ${
                      user?.favorites?.includes(place.id) ? "text-red-500" : "text-white"
                    }`}
                    onClick={(e) => handleToggleFavorite(e, place.id)}
                  >
                    <Heart className={`h-6 w-6 ${user?.favorites?.includes(place.id) ? "fill-red-500" : ""}`} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center justify-center bg-gray-50/80 p-5 rounded-2xl border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="p-3 bg-orange-100/80 text-orange-600 rounded-xl mb-3"><Clock className="h-6 w-6" /></div>
              <div className="text-sm font-semibold text-gray-800">Duration</div>
              <div className="text-xs text-gray-500 mt-1 font-medium">{place.visitDuration}</div>
            </div>
            <div className="flex flex-col items-center justify-center bg-gray-50/80 p-5 rounded-2xl border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="p-3 bg-blue-100/80 text-blue-600 rounded-xl mb-3"><Star className="h-6 w-6" /></div>
              <div className="text-sm font-semibold text-gray-800">Rating</div>
              <div className="text-xs text-gray-500 mt-1 font-medium">{place.rating}/5</div>
            </div>
            <div className="flex flex-col items-center justify-center bg-gray-50/80 p-5 rounded-2xl border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="p-3 bg-green-100/80 text-green-600 rounded-xl mb-3"><Camera className="h-6 w-6" /></div>
              <div className="text-sm font-semibold text-gray-800">Category</div>
              <div className="text-xs text-gray-500 mt-1 font-medium">{place.category}</div>
            </div>
            <div className="flex flex-col items-center justify-center bg-gray-50/80 p-5 rounded-2xl border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="p-3 bg-purple-100/80 text-purple-600 rounded-xl mb-3"><MapPin className="h-6 w-6" /></div>
              <div className="text-sm font-semibold text-gray-800">Location</div>
              <div className="text-xs text-gray-500 mt-1 font-medium">{place.talukaName}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => setShowWeather(true)}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-7 rounded-2xl transition-all duration-300 shadow-lg shadow-orange-900/20 border-0 group h-auto"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white/20 rounded-xl group-hover:scale-110 transition-transform backdrop-blur-sm">
                  <Cloud className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <div className="text-xs opacity-90 font-medium uppercase tracking-wider mb-0.5">Current Conditions</div>
                  <div className="text-base font-bold">Check Weather</div>
                </div>
              </div>
            </Button>

            <Button
              onClick={() => setShowRoute(true)}
              className="flex-1 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300 font-medium py-7 rounded-2xl transition-all duration-300 shadow-sm group h-auto"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-gray-100 rounded-xl group-hover:scale-110 transition-transform">
                  <Navigation className="h-6 w-6 text-gray-700" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">Travel Guide</div>
                  <div className="text-base font-bold">Get Directions</div>
                </div>
              </div>
            </Button>
          </div>

          {/* Tabs Content */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="flex w-full bg-transparent border-b border-gray-200 h-auto p-0 mb-8 overflow-x-auto hide-scrollbar">
              <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 data-[state=active]:bg-transparent bg-transparent py-3 px-6 font-semibold text-gray-500 hover:text-gray-700 transition-colors">Overview</TabsTrigger>
              <TabsTrigger value="restaurants" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 data-[state=active]:bg-transparent bg-transparent py-3 px-6 font-semibold text-gray-500 hover:text-gray-700 transition-colors">Restaurants</TabsTrigger>
              <TabsTrigger value="hotels" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 data-[state=active]:bg-transparent bg-transparent py-3 px-6 font-semibold text-gray-500 hover:text-gray-700 transition-colors">Hotels</TabsTrigger>
              <TabsTrigger value="map" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 data-[state=active]:bg-transparent bg-transparent py-3 px-6 font-semibold text-gray-500 hover:text-gray-700 transition-colors">Map</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8 animate-in fade-in-50 duration-500">
              <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100/50">
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                  <Info className="h-5 w-5 text-orange-500 mr-2" />
                  About This Place
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">{place.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                    Best Time to Visit
                  </h3>
                  <p className="text-gray-600 font-medium">{place.bestTimeToVisit}</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
                    Visitor Tips
                  </h3>
                  <ul className="text-gray-600 space-y-2 font-medium">
                    <li className="flex items-start"><div className="h-1.5 w-1.5 rounded-full bg-orange-400 mt-2 mr-2 shrink-0"></div>Carry water and comfortable walking shoes</li>
                    <li className="flex items-start"><div className="h-1.5 w-1.5 rounded-full bg-orange-400 mt-2 mr-2 shrink-0"></div>Photography is allowed in most areas</li>
                    <li className="flex items-start"><div className="h-1.5 w-1.5 rounded-full bg-orange-400 mt-2 mr-2 shrink-0"></div>Respect local customs and traditions</li>
                    {place.visitorTips && place.visitorTips.map((tip, idx) => (
                      <li key={`custom-${idx}`} className="flex items-start"><div className="h-1.5 w-1.5 rounded-full bg-orange-400 mt-2 mr-2 shrink-0"></div>{tip}</li>
                    ))}
                  </ul>
                </div>
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

              <TabsContent value="map" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Location Map</h3>
                  <MapView name={place.name} coordinates={place.coordinates} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Weather Modal */}
      {showWeather && <WeatherModal place={place} onClose={() => setShowWeather(false)} />}

      {/* Route Modal */}
      {showRoute && <RouteModal destination={place} onClose={() => setShowRoute(false)} />}
      
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  )
}
