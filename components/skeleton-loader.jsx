"use client"

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-0 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="pt-4 flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  )
}

export function TalukaSkeleton() {
  return (
    <div className="space-y-4 py-8">
      <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="h-[500px] w-full bg-gray-200 animate-pulse flex items-center justify-center">
      <div className="space-y-6 w-full max-w-2xl px-4">
        <div className="h-12 bg-gray-300 rounded w-3/4 mx-auto" />
        <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto" />
        <div className="h-16 bg-gray-300 rounded-full w-full" />
      </div>
    </div>
  )
}
