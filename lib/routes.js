export async function calculateRoute(startName, destName, startCoords, destCoords) {
  // If we have actual coordinates, we can fetch from OSRM
  if (startCoords && destCoords) {
    try {
      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${startCoords[1]},${startCoords[0]};${destCoords[1]},${destCoords[0]}?overview=false`)
      const data = await res.json()
      
      if (data.code === "Ok" && data.routes.length > 0) {
        const route = data.routes[0]
        const distKm = (route.distance / 1000).toFixed(1)
        const durationMin = Math.round(route.duration / 60)
        
        return [
          {
            id: 1,
            name: "Fastest Route",
            distance: `${distKm} km`,
            duration: `${durationMin} minutes`,
            description: "Direct real-time routing based on live location",
          }
        ]
      }
    } catch (err) {
      console.error("OSRM Route error", err)
    }
  }

  // Mock route fallback if coordinates are missing or API fails
  return [
    {
      id: 1,
      name: "Fastest Route",
      distance: `${Math.floor(Math.random() * 50) + 10} km`,
      duration: `${Math.floor(Math.random() * 60) + 30} minutes`,
      description: "Via main highways and city roads",
    },
    {
      id: 2,
      name: "Scenic Route",
      distance: `${Math.floor(Math.random() * 70) + 20} km`,
      duration: `${Math.floor(Math.random() * 90) + 45} minutes`,
      description: "Through countryside and scenic spots",
    },
  ]
}
