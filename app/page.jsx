"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import TalukaGrid from "@/components/taluka-grid"
import FeaturesSection from "@/components/features-section"
import TraditionsSection from "@/components/traditions-section"
import Footer from "@/components/footer"
import SearchResults from "@/components/search-results"
import { kolhapurTalukas } from "@/data/tourism-data"
import { API_BASE_URL } from "@/lib/config"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTaluka, setSelectedTaluka] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const [liveTalukas, setLiveTalukas] = useState(kolhapurTalukas)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/places`)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        const enhancedTalukas = kolhapurTalukas.map(taluka => {
          const dbPlaces = data.filter(p => p.talukaId === taluka.id || p.talukaName === taluka.name);
          return {
            ...taluka,
            places: dbPlaces.length > 0 ? dbPlaces : taluka.places
          }
        });
        setLiveTalukas(enhancedTalukas);
      })
      .catch(err => console.error("Database connection natively asleep:", err));
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

      <HeroSection onSearch={handleSearch} />

      <main className="container mx-auto px-4 py-8">
        {isSearching ? (
          <SearchResults
            searchQuery={searchQuery}
            selectedTaluka={selectedTaluka}
            selectedCategory={selectedCategory}
            onClearSearch={clearSearch}
          />
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
