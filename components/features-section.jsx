import { MapPin, Camera, Utensils, Hotel, Calendar, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function FeaturesSection() {
  const features = [
    {
      icon: MapPin,
      title: "Expert Local Guides",
      description:
        "Discover hidden gems and authentic stories with our knowledgeable local guides who know every corner of Kolhapur.",
      color: "text-orange-500",
    },
    {
      icon: Camera,
      title: "Photography Tours",
      description:
        "Capture the essence of Kolhapur's architecture, culture, and landscapes with our specialized photography experiences.",
      color: "text-red-500",
    },
    {
      icon: Utensils,
      title: "Culinary Experiences",
      description:
        "Savor authentic Kolhapuri cuisine, from spicy mutton curry to sweet puran poli, at the best local restaurants.",
      color: "text-yellow-500",
    },
    {
      icon: Hotel,
      title: "Comfortable Stays",
      description:
        "Choose from heritage hotels, modern resorts, or budget-friendly accommodations that suit your travel style.",
      color: "text-green-500",
    },
    {
      icon: Calendar,
      title: "Festival Calendar",
      description:
        "Experience vibrant festivals like Navratri, Gudi Padwa, and local celebrations that showcase Kolhapur's rich culture.",
      color: "text-blue-500",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description:
        "Travel with confidence knowing our recommended places and services prioritize your safety and comfort.",
      color: "text-purple-500",
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-white via-orange-50 to-red-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose Kolhapur Tourism?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We provide comprehensive travel solutions to make your Kolhapur experience unforgettable. From ancient
            temples to modern amenities, we've got everything covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-2"
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-orange-100 group-hover:to-red-100 transition-all duration-300`}
                  >
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
