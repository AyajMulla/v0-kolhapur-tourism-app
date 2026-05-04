"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useLanguage } from "@/lib/language-context"
import { API_BASE_URL } from "@/lib/config"
import { Calendar, Clock, MapPin, Star, Utensils, Hotel as HotelIcon, ChevronRight, Wand2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { Heart } from "lucide-react"

export default function PlanTripPage() {
  const { t, language } = useLanguage()
  const { toast } = useToast()
  const [days, setDays] = useState(1)
  const [interests, setInterests] = useState([])
  const [itinerary, setItinerary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [allPlaces, setAllPlaces] = useState([])
  const [allHotels, setAllHotels] = useState([])
  const [allRestaurants, setAllRestaurants] = useState([])
  const { user, token } = useAuth()
  const [planSource, setPlanSource] = useState('interests') // 'interests' or 'wishlist'

  const favoritePlaces = allPlaces.filter(p => user?.favorites?.includes(p.id))

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/places`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/hotels`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/restaurants`).then(res => res.json())
    ]).then(([placesData, hotelsData, restaurantsData]) => {
      setAllPlaces(placesData)
      setAllHotels(hotelsData)
      setAllRestaurants(restaurantsData)
    }).catch(err => console.error(err))
  }, [])

  const toggleInterest = (interest) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest))
    } else {
      setInterests([...interests, interest])
    }
  }

  const generateItinerary = () => {
    if (planSource === 'interests' && interests.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one interest.",
        variant: "destructive"
      })
      return
    }
    
    if (planSource === 'wishlist' && favoritePlaces.length === 0) {
      toast({
        title: "Wishlist Empty",
        description: "Please add some places to your wishlist first.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    setTimeout(() => {
      let filtered = []
      if (planSource === 'wishlist') {
        filtered = [...favoritePlaces]
      } else {
        filtered = allPlaces.filter(p => interests.includes(p.category))
      }

      if (filtered.length === 0) filtered = allPlaces.slice(0, 15)

      const grouped = {}
      filtered.forEach(p => {
        const taluka = p.talukaName || 'Other'
        if (!grouped[taluka]) grouped[taluka] = []
        grouped[taluka].push(p)
      })

      const plan = []
      const usedTalukas = Object.keys(grouped)
      
      for (let i = 0; i < days; i++) {
        const dayPlaces = []
        const currentTaluka = usedTalukas[i % usedTalukas.length]
        
        if (grouped[currentTaluka]) {
          dayPlaces.push(...grouped[currentTaluka].slice(0, 3))
        }

        // Find a hotel and restaurant in this Taluka for the day
        const dayHotel = allHotels.find(h => h.talukaName === currentTaluka) || allHotels[i % allHotels.length]
        const dayRest = allRestaurants.find(r => r.talukaName === currentTaluka) || allRestaurants[i % allRestaurants.length]

        plan.push({
          day: i + 1,
          places: dayPlaces,
          hotel: dayHotel,
          restaurant: dayRest,
          taluka: currentTaluka
        })
      }

      setItinerary(plan)
      setLoading(false)
      window.scrollTo({ top: 600, behavior: 'smooth' })
    }, 1500)
  }

  const handleSendEmail = async () => {
    if (!itinerary) return;
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/user/plan-trip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ itinerary })
      });

      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Itinerary Sent! 📧",
          description: data.msg || `We've sent your plan to your registered email address.`,
        })
      } else {
        throw new Error(data.error || "Failed to send email");
      }
    } catch (err) {
      toast({
        title: "Email Error",
        description: err.message,
        variant: "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen bg-orange-50/30">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent ${language !== 'en' ? 'font-devanagari' : ''}`}>
            {t('planTrip')}
          </h1>
          <p className="text-gray-600 text-lg">
            Create your personalized Kolhapur journey in seconds.
          </p>
        </div>

        {/* Generator Form */}
        <Card className="mb-12 border-orange-200 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center">
              <Wand2 className="mr-2 h-5 w-5" />
              Itinerary Settings
            </h2>
          </div>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Duration */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-orange-500" />
                  Trip Duration
                </label>
                <div className="flex space-x-4">
                  {[1, 2, 3, 4, 5].map(d => (
                    <button
                      key={d}
                      onClick={() => setDays(d)}
                      className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                        days === d 
                        ? 'border-orange-500 bg-orange-500 text-white shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-orange-200 text-gray-600'
                      }`}
                    >
                      {d} {d === 1 ? 'Day' : 'Days'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider flex items-center">
                  <Star className="mr-2 h-4 w-4 text-orange-500" />
                  Your Interests
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Religious', 'Historical', 'Nature', 'Wildlife', 'Adventure'].map(interest => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 rounded-full border transition-all ${
                        interests.includes(interest)
                        ? 'bg-orange-100 border-orange-500 text-orange-700 font-bold'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button 
              onClick={generateItinerary}
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 text-lg rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating...
                </div>
              ) : `Generate Trip from ${planSource === 'interests' ? 'Interests' : 'Wishlist'}`}
            </Button>
          </CardContent>
        </Card>

        {/* Wishlist Section */}
        {user && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <Heart className="mr-2 h-6 w-6 text-red-500 fill-red-500" />
                Your Wishlist ({favoritePlaces.length})
              </h2>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                  onClick={() => setPlanSource('interests')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${planSource === 'interests' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  By Interests
                </button>
                <button 
                  onClick={() => setPlanSource('wishlist')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${planSource === 'wishlist' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  By Wishlist
                </button>
              </div>
            </div>

            {favoritePlaces.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {favoritePlaces.map(place => (
                  <div key={place.id} className="group relative rounded-xl overflow-hidden aspect-video bg-gray-200">
                    <img src={place.image} alt={place.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-3">
                      <p className="text-white text-xs font-bold truncate">{place.name}</p>
                      <p className="text-white/70 text-[10px]">{place.talukaName}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-2 border-gray-200 bg-transparent">
                <CardContent className="p-8 text-center">
                  <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Your wishlist is empty. Save some places to plan a custom trip!</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Results */}
        {itinerary && (
          <div className="animate-fade-in space-y-12">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Your Kolhapur Itinerary</h2>
              <Button 
                onClick={handleSendEmail}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center"
              >
                <Mail className="mr-2 h-4 w-4" />
                Send to My Email
              </Button>
            </div>

            {itinerary.map((dayPlan) => (
              <div key={dayPlan.day} className="relative pl-8 border-l-4 border-orange-200 pb-8">
                <div className="absolute -left-[14px] top-0 w-6 h-6 bg-orange-500 rounded-full border-4 border-white shadow-md" />
                <h3 className="text-2xl font-bold text-orange-700 mb-6 flex items-center">
                  Day {dayPlan.day} - {dayPlan.taluka} Exploration
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {dayPlan.places.map((place, idx) => (
                    <Card key={place.id} className="overflow-hidden hover:shadow-xl transition-shadow border-none shadow-md">
                      <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${place.image})` }} />
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">
                            {idx === 0 ? "Morning" : idx === 1 ? "Afternoon" : "Evening"}
                          </span>
                          <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-[10px]">
                            {place.category}
                          </Badge>
                        </div>
                        <h4 className="font-bold text-gray-800 mb-1 text-lg leading-tight">{place.name}</h4>
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          {place.talukaName}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Dynamic Food & Hotel Suggestions */}
                  <Card className="bg-gradient-to-br from-orange-600 to-red-700 text-white shadow-lg border-none">
                    <CardContent className="p-6 flex flex-col justify-center h-full">
                      <h4 className="font-bold mb-4 flex items-center text-lg">
                        <Utensils className="mr-2 h-5 w-5" />
                        Dining & Stay
                      </h4>
                      
                      <div className="space-y-4">
                        {dayPlan.restaurant && (
                          <div>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-orange-200 mb-1">Recommended Food</p>
                            <p className="font-bold text-white leading-tight">{dayPlan.restaurant.name}</p>
                            <p className="text-xs text-orange-100 opacity-80">{dayPlan.restaurant.address?.slice(0, 40)}...</p>
                          </div>
                        )}

                        {dayPlan.hotel && (
                          <div>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-orange-200 mb-1">Recommended Stay</p>
                            <p className="font-bold text-white leading-tight">{dayPlan.hotel.name}</p>
                            <p className="text-xs text-orange-100 opacity-80">{dayPlan.hotel.address?.slice(0, 40)}...</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
