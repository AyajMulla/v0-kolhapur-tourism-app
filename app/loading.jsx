export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Loading Kolhapur Tourism...</h2>
        <p className="text-gray-500 mt-2">Discovering amazing places for you</p>
      </div>
    </div>
  )
}
