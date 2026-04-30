"use client"

import { useState } from "react"
import { MapPin, Star, Clock, Users, ChevronDown, ChevronUp, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import PlaceDetailModal from "./place-detail-modal"
import { useAuth } from "@/lib/auth-context"
import LoginModal from "./login-modal"
import { useToast } from "@/hooks/use-toast"

export default function TalukaGrid({ talukas }) {
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [expandedTalukas, setExpandedTalukas] = useState({})
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

  const toggleExpand = (talukaId) => {
    setExpandedTalukas(prev => ({ ...prev, [talukaId]: !prev[talukaId] }))
  }

  const handlePlaceClick = (place, talukaName) => {
    setSelectedPlace({
      ...place,
      talukaName: talukaName,
    })
  }

  return (
    <div className="space-y-12">
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Explore Kolhapur by Region</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Discover the diverse attractions across different talukas of Kolhapur, each offering unique experiences and
          cultural treasures.
        </p>
      </div>

      {talukas.map((taluka) => (
        <div key={taluka.id} className="space-y-6">
          {/* Taluka Header */}
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{taluka.name}</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">{taluka.description}</p>
          </div>

          {/* Places Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(expandedTalukas[taluka.id] ? taluka.places : taluka.places.slice(0, 3)).map((place) => (
              <Card
                key={place.id}
                className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border-0 bg-white/90 backdrop-blur-sm hover:-translate-y-2 overflow-hidden luxury-card"
                onClick={() => handlePlaceClick(place, taluka.name)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={place.image || "/placeholder.jpg"}
                    alt={place.name}
                    fetchPriority={taluka.id === "karveer" && place.id === "mahalaxmi-temple" ? "high" : undefined}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { e.target.src = "/placeholder.jpg"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-orange-500/90 text-white font-medium">{place.category}</Badge>
                  </div>
                  <div className="absolute top-4 right-4 z-10">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-colors ${
                        user?.favorites?.includes(place.id) ? "text-red-500 fill-red-500" : "text-white"
                      }`}
                      onClick={(e) => handleToggleFavorite(e, place.id)}
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h4 className="text-white font-bold text-xl mb-2 text-balance">{place.name}</h4>
                    <div className="flex items-center text-white/90 text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{taluka.name}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{place.rating}</span>
                      <span className="text-gray-500 text-sm ml-1">rating</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{place.visitDuration}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">{place.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Users className="h-4 w-4 mr-1" />
                      <span>Perfect for families</span>
                    </div>
                    <div className="text-orange-600 font-medium text-sm hover:text-orange-700 transition-colors">
                      Learn More →
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {taluka.places.length > 3 && (
            <div className="flex justify-center mt-6">
              <Button 
                variant="outline" 
                className="border-orange-200 text-orange-600 hover:bg-orange-50 bg-white"
                onClick={() => toggleExpand(taluka.id)}
              >
                {expandedTalukas[taluka.id] ? (
                  <><ChevronUp className="w-4 h-4 mr-2" /> Show Less</>
                ) : (
                  <><ChevronDown className="w-4 h-4 mr-2" /> Show {taluka.places.length - 3} More Options</>
                )}
              </Button>
            </div>
          )}
        </div>
      ))}

      {/* Place Detail Modal */}
      {selectedPlace && <PlaceDetailModal place={selectedPlace} onClose={() => setSelectedPlace(null)} />}
    </div>
  )
}
