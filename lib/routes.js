function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

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

    // Accurate fallback calculation if API fails
    const straightDist = calculateHaversineDistance(startCoords[0], startCoords[1], destCoords[0], destCoords[1]);
    const estRoadDist = (straightDist * 1.3).toFixed(1); // 30% more for road turns
    const estTime = Math.round(estRoadDist * 1.5); // ~40km/h average

    return [
      {
        id: 1,
        name: "Estimated Route",
        distance: `${estRoadDist} km`,
        duration: `${estTime} minutes`,
        description: "Calculated based on geographical distance (estimated road path)",
      }
    ]
  }

  // Final fallback if no coordinates available at all
  return [
    {
      id: 1,
      name: "Fastest Route",
      distance: "Calculation pending...",
      duration: "Calculating...",
      description: "Coordinates not available for calculation",
    }
  ]
}
