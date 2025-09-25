export async function getWeatherData(city) {
  try {
    // Mock weather data for demo purposes
    const weatherData = {
      city: city,
      temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
      condition: ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain"][Math.floor(Math.random() * 4)],
      humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
      windSpeed: Math.floor(Math.random() * 10) + 5, // 5-15 km/h
      description: "Perfect weather for sightseeing!",
    }

    return weatherData
  } catch (error) {
    console.error("Error fetching weather data:", error)
    return null
  }
}
