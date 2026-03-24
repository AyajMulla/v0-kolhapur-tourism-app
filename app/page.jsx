"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import TalukaGrid from "@/components/taluka-grid"
import FeaturesSection from "@/components/features-section"
import TraditionsSection from "@/components/traditions-section"
import Footer from "@/components/footer"
import SearchResults from "@/components/search-results"
import { API_BASE_URL } from "@/lib/config"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTaluka, setSelectedTaluka] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const [liveTalukas, setLiveTalukas] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/talukas`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/places`).then(res => res.json())
    ])
      .then(([talukasData, placesData]) => {
        if (!Array.isArray(talukasData) || !Array.isArray(placesData)) return;
        
        const enhancedTalukas = talukasData.map(taluka => {
          const dbPlaces = placesData.filter(p => p.talukaId === taluka.id || p.talukaName === taluka.name || taluka.places.includes(p.id));
          return {
            ...taluka,
            places: dbPlaces
          }
        });
        setLiveTalukas(enhancedTalukas);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Database connection natively asleep:", err);
        setIsLoading(false);
        toast({
          title: "Server Disconnected",
          description: "Could not connect to the backend database. Please ensure the server is running.",
          variant: "destructive",
        })
      });
  }, [])

  const handleSearch = (query, taluka, category) => {
    setSearchQuery(query)
    setSelectedTaluka(taluka)
    setSelectedCategory(category)
    setIsSearching(query.length > 0 || taluka.length > 0 || category.length > 0)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSelectedTaluka("")
    setSelectedCategory("")
    setIsSearching(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <Header />

      <HeroSection onSearch={handleSearch} talukas={liveTalukas} />

      <main className="container mx-auto px-4 py-8">
        {isSearching ? (
          <SearchResults
            searchQuery={searchQuery}
            selectedTaluka={selectedTaluka}
            selectedCategory={selectedCategory}
            onClearSearch={clearSearch}
          />
        ) : isLoading ? (
          <div className="flex justify-center items-center py-20 text-orange-600">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <>
            <TalukaGrid talukas={liveTalukas} />
            <TraditionsSection />
            <FeaturesSection />
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
