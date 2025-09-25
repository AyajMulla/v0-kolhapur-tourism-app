"use client"

import { useState, useEffect } from "react"
import { X, Cloud, Sun, CloudRain, Wind, Droplets, Thermometer } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getWeatherData } from "@/lib/weather"

export default function WeatherModal({ place, onClose }) {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const weatherData = await getWeatherData(place.name)
        setWeather(weatherData)
      } catch (error) {
        console.error("Error fetching weather:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [place.name])

  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case "sunny":
        return <Sun className="h-12 w-12 text-yellow-500" />
      case "partly cloudy":
        return <Cloud className="h-12 w-12 text-gray-500" />
      case "cloudy":
        return <Cloud className="h-12 w-12 text-gray-600" />
      case "light rain":
        return <CloudRain className="h-12 w-12 text-blue-500" />
      default:
        return <Sun className="h-12 w-12 text-yellow-500" />
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <DialogHeader className="relative">
          <Button onClick={onClose} variant="ghost" size="icon" className="absolute right-0 top-0 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </Button>
          <DialogTitle className="text-xl font-bold text-gray-800 pr-10">Weather at {place.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading weather data...</p>
            </div>
          ) : weather ? (
            <>
              {/* Current Weather */}
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6 text-center">
                  <div className="mb-4">{getWeatherIcon(weather.condition)}</div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">{weather.temperature}°C</h3>
                  <p className="text-lg text-gray-700 mb-1">{weather.condition}</p>
                  <p className="text-sm text-gray-600">{weather.description}</p>
                </CardContent>
              </Card>

              {/* Weather Details */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-orange-200">
                  <CardContent className="p-4 text-center">
                    <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-lg font-semibold text-gray-800">{weather.humidity}%</div>
                    <div className="text-sm text-gray-600">Humidity</div>
                  </CardContent>
                </Card>

                <Card className="border-green-200">
                  <CardContent className="p-4 text-center">
                    <Wind className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <div className="text-lg font-semibold text-gray-800">{weather.windSpeed} km/h</div>
                    <div className="text-sm text-gray-600">Wind Speed</div>
                  </CardContent>
                </Card>
              </div>

              {/* Travel Recommendation */}
              <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    <Thermometer className="h-5 w-5 text-orange-600 mr-2" />
                    <h4 className="font-semibold text-gray-800">Travel Recommendation</h4>
                  </div>
                  <p className="text-sm text-gray-700">
                    {weather.temperature > 30
                      ? "Hot weather - carry water and wear light clothing. Early morning or evening visits recommended."
                      : weather.temperature < 15
                        ? "Cool weather - carry warm clothing. Great weather for sightseeing!"
                        : "Pleasant weather - perfect for outdoor activities and sightseeing!"}
                  </p>
                </CardContent>
              </Card>

              {/* Best Time to Visit */}
              <Card className="border-purple-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Best Time to Visit</h4>
                  <p className="text-sm text-gray-700">{place.bestTimeToVisit}</p>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Cloud className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Weather data not available</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
