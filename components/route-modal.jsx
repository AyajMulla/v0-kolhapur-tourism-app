"use client"

import { useState, useEffect } from "react"
import { X, Navigation, MapPin, Clock, Car, Route } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { calculateRoute } from "@/lib/routes"

export default function RouteModal({ destination, onClose }) {
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRoute, setSelectedRoute] = useState(null)

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const routeData = await calculateRoute("Kolhapur City", destination.name)
        setRoutes(routeData)
        setSelectedRoute(routeData[0])
      } catch (error) {
        console.error("Error fetching routes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRoutes()
  }, [destination.name])

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <DialogHeader className="relative">
          <Button onClick={onClose} variant="ghost" size="icon" className="absolute right-0 top-0 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </Button>
          <DialogTitle className="text-xl font-bold text-gray-800 pr-10">Routes to {destination.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Route Overview */}
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-medium text-gray-800">From: Kolhapur City</div>
                    <div className="font-medium text-gray-800">To: {destination.name}</div>
                  </div>
                </div>
                <Navigation className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Calculating routes...</p>
            </div>
          ) : routes.length > 0 ? (
            <>
              {/* Route Options */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">Available Routes</h3>
                {routes.map((route) => (
                  <Card
                    key={route.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedRoute?.id === route.id
                        ? "border-orange-300 bg-orange-50"
                        : "border-gray-200 hover:border-orange-200 hover:bg-orange-25"
                    }`}
                    onClick={() => setSelectedRoute(route)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            {route.name.includes("Fastest") ? (
                              <Car className="h-5 w-5 text-orange-600" />
                            ) : (
                              <Route className="h-5 w-5 text-green-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{route.name}</h4>
                            <p className="text-sm text-gray-600">{route.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{route.distance}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{route.duration}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Selected Route Details */}
              {selectedRoute && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Route Details</h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{selectedRoute.distance}</div>
                        <div className="text-sm text-gray-600">Total Distance</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{selectedRoute.duration}</div>
                        <div className="text-sm text-gray-600">Estimated Time</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Badge className="bg-orange-500 text-white">{selectedRoute.name}</Badge>
                      <p className="text-sm text-gray-700">{selectedRoute.description}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  <Navigation className="h-4 w-4 mr-2" />
                  Start Navigation
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  View on Map
                </Button>
              </div>

              {/* Travel Tips */}
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Travel Tips</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Check traffic conditions before starting your journey</li>
                    <li>• Carry sufficient fuel and water for the trip</li>
                    <li>• Keep emergency contact numbers handy</li>
                    <li>• Follow traffic rules and drive safely</li>
                  </ul>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Route className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Route information not available</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
