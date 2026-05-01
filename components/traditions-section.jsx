"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Crown, Music, Utensils, Palette, Calendar, Heart, Star, Sparkles } from "lucide-react"

const traditions = [
  {
    id: 1,
    title: "Kolhapuri Chappal",
    marathi: "कोल्हापुरी चप्पल",
    description:
      "World-famous handcrafted leather footwear known for its durability and unique design. Each pair is meticulously crafted by skilled artisans using traditional techniques passed down through generations.",
    icon: Crown,
    category: "Craft",
    color: "from-amber-500 to-orange-600",
    facts: ["300+ years old tradition", "Exported worldwide", "UNESCO recognized craft"],
  },
  {
    id: 2,
    title: "Lavani Dance",
    marathi: "लावणी नृत्य",
    description:
      "Traditional Marathi folk dance form characterized by powerful rhythm and expressive movements. Lavani represents the cultural soul of Maharashtra with its vibrant costumes and energetic performances.",
    icon: Music,
    category: "Dance",
    color: "from-pink-500 to-rose-600",
    facts: ["Ancient art form", "UNESCO Intangible Heritage", "Royal court entertainment"],
  },
  {
    id: 3,
    title: "Kolhapuri Misal",
    marathi: "कोल्हापुरी मिसळ",
    description:
      "Spicy and flavorful traditional breakfast dish made with sprouted lentils, spices, and served with pav bread. Known as one of the spiciest dishes in Indian cuisine.",
    icon: Utensils,
    category: "Cuisine",
    color: "from-red-500 to-orange-600",
    facts: ["Spice level: Extreme", "Traditional recipe", "Morning favorite"],
  },
  {
    id: 4,
    title: "Warli Art",
    marathi: "वार्ली कला",
    description:
      "Ancient tribal art form using simple geometric patterns to depict daily life, nature, and celebrations. This 2500-year-old art form uses natural pigments on mud walls.",
    icon: Palette,
    category: "Art",
    color: "from-green-500 to-teal-600",
    facts: ["2500 years old", "Tribal heritage", "Natural pigments"],
  },
  {
    id: 5,
    title: "Gudi Padwa",
    marathi: "गुढी पाडवा",
    description:
      "Marathi New Year celebration marked by hoisting colorful Gudi flags. Families prepare traditional sweets and wear new clothes to welcome the new year with prosperity.",
    icon: Calendar,
    category: "Festival",
    color: "from-purple-500 to-indigo-600",
    facts: ["Marathi New Year", "Spring celebration", "Family tradition"],
  },
  {
    id: 6,
    title: "Kolhapuri Jewelry",
    marathi: "कोल्हापुरी दागिने",
    description:
      "Traditional gold jewelry known for intricate designs and cultural significance. Kolhapuri jewelry includes the famous Kolhapuri Saaj necklace worn by Marathi brides.",
    icon: Heart,
    category: "Jewelry",
    color: "from-yellow-500 to-amber-600",
    facts: ["Bridal tradition", "22k gold", "Handcrafted designs"],
  },
]

const festivals = [
  {
    name: "Navratri",
    marathi: "नवरात्री",
    description: "Nine nights of devotion to Goddess Durga",
    month: "September/October",
  },
  {
    name: "Diwali",
    marathi: "दिवाळी",
    description: "Festival of lights celebrating victory of good over evil",
    month: "October/November",
  },
  {
    name: "Ganesh Chaturthi",
    marathi: "गणेश चतुर्थी",
    description: "Celebration of Lord Ganesha with grand processions",
    month: "August/September",
  },
]


export default function TraditionsSection() {
  const { t, language } = useLanguage()
  const [selectedTradition, setSelectedTradition] = useState(null)

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 cultural-pattern">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 fade-in-up">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-orange-500" />
            <h2 className={`text-4xl md:text-5xl font-bold text-gray-800 ${language !== 'en' ? 'font-devanagari' : 'font-serif text-shimmer'}`}>
              {t('traditionsTitle')}
            </h2>
            <Sparkles className="w-8 h-8 text-orange-500" />
          </div>
          <p className={`text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed ${language !== 'en' ? 'font-devanagari' : ''}`}>
            {t('traditionsDesc')}
          </p>
        </div>

        {/* Traditions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {traditions.map((tradition, index) => {
            const IconComponent = tradition.icon
            return (
              <Card
                key={tradition.id}
                className="tradition-card cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedTradition(tradition)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${tradition.color} text-white`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <Badge variant="secondary" className="category-badge text-white">
                      {tradition.category}
                    </Badge>
                  </div>

                  <h3 className={`text-xl font-bold mb-2 ${language !== 'en' ? 'font-devanagari' : 'font-serif'}`}>
                    {language === 'mr' ? tradition.marathi : tradition.title}
                  </h3>
                  <p className={`text-muted-foreground text-sm leading-relaxed mb-4 ${language !== 'en' ? 'font-devanagari' : ''}`}>
                    {tradition.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {tradition.facts.map((fact, idx) => (
                      <Badge key={idx} variant="outline" className={`text-xs ${language !== 'en' ? 'font-devanagari text-[10px]' : ''}`}>
                        {fact}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Festivals Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 glass-effect">
          <div className="text-center mb-8">
            <h3 className={`text-3xl font-bold mb-2 ${language !== 'en' ? 'font-devanagari' : 'font-serif text-gradient'}`}>
              Traditional Festivals
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {festivals.map((festival, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-white to-orange-50 border-2 border-orange-100 festival-glow"
              >
                <Star className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <h4 className={`text-xl font-bold mb-1 ${language !== 'en' ? 'font-devanagari' : ''}`}>
                  {language === 'mr' ? festival.marathi : festival.name}
                </h4>
                <p className={`text-sm text-muted-foreground mb-2 ${language !== 'en' ? 'font-devanagari' : ''}`}>
                  {festival.description}
                </p>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  {festival.month}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Button size="lg" className={`premium-button text-white font-semibold px-8 py-4 text-lg rounded-full ${language !== 'en' ? 'font-devanagari' : ''}`}>
            Explore Cultural Tours
            <Heart className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
