export function calculateRoute(from, to) {
  // Mock route calculation for demo purposes
  const routes = [
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

  return routes
}
