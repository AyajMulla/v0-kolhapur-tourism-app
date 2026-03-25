"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { API_BASE_URL } from "@/lib/config"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Clock, Calendar, Mail, Trash2, ArrowRight, Loader2, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import PlaceDetailModal from "@/components/place-detail-modal"

export default function PlanTripPage() {
  const { user, token, toggleFavorite } = useAuth()
  const [wishlistPlaces, setWishlistPlaces] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    if (user && user.favorites) {
      fetchPlaces()
    } else if (!user) {
      setIsLoading(false)
    }
  }, [user])

  const fetchPlaces = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/places`)
      const allPlaces = await res.json()
      if (Array.isArray(allPlaces) && user?.favorites) {
        const filtered = allPlaces.filter(p => user.favorites.includes(p.id))
        setWishlistPlaces(filtered)
      }
    } catch (err) {
      console.error("Failed to fetch places:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = async (placeId) => {
    try {
      await toggleFavorite(placeId)
      setWishlistPlaces(prev => prev.filter(p => p.id !== placeId))
      toast({
        title: "Removed",
        description: "Place removed from your plan.",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to remove place.",
        variant: "destructive"
      })
    }
  }

  const handleEmailItinerary = async () => {
    if (!token) return
    setIsSending(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/plan-trip`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (res.ok) {
        toast({
          title: "Itinerary Sent!",
          description: "Check your email for your planned trip details.",
        })
      } else {
        throw new Error(data.msg || "Failed to send email")
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      })
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please log in</h2>
          <p className="text-gray-600 mb-8">You need to be logged in to plan your trip.</p>
          <Link href="/">
             <Button className="bg-orange-600 hover:bg-orange-700">Go to Home</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Trip Plan</h1>
              <p className="text-gray-600">Explore and manage your hand-picked Kolhapur destinations.</p>
            </div>
            {wishlistPlaces.length > 0 && (
              <Button 
                onClick={handleEmailItinerary}
                disabled={isSending}
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold h-12 px-8 rounded-full shadow-lg hover:shadow-orange-200 transition-all flex items-center gap-2"
              >
                {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mail className="h-5 w-5" />}
                Email My Itinerary
              </Button>
            )}
          </div>

          {wishlistPlaces.length === 0 ? (
            <Card className="border-dashed border-2 border-gray-200 bg-white/50 text-center py-20">
              <CardContent className="flex flex-col items-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <MapPin className="h-10 w-10 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                  Start exploring Kolhapur's amazing places and click the heart icon to add them to your personalized trip plan.
                </p>
                <Link href="/">
                  <Button className="bg-orange-600 hover:bg-orange-700">Explore Places</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {wishlistPlaces.map((place, index) => (
                <Card key={place.id} className="overflow-hidden bg-white border-0 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3 h-48 md:h-auto overflow-hidden">
                      <img 
                        src={place.image} 
                        alt={place.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="w-full md:w-2/3 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-2xl font-bold text-gray-900">{place.name}</h3>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemove(place.id)}
                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{place.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-orange-500" />
                            <span>{place.visitDuration}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-orange-500" />
                            <span>{place.bestTimeToVisit}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                        <span className="text-xs font-semibold uppercase tracking-wider text-orange-500">{place.category}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedPlace(place)}
                          className="text-sm font-medium text-gray-900 hover:text-orange-600 flex items-center p-0 h-auto"
                        >
                          View Details <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          <div className="mt-12 p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
               <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-blue-900 mb-1">Travel Tip</h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                Add at least 3-4 places to get a comprehensive itinerary. Your plan will be emailed as a clean, easy-to-read list that you can use while traveling in Kolhapur!
              </p>
            </div>
          </div>
        </div>
      </main>
      
      {selectedPlace && (
        <PlaceDetailModal place={selectedPlace} onClose={() => setSelectedPlace(null)} />
      )}
      
      <Footer />
    </div>
  )
}
