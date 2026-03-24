import TraditionsSection from "@/components/traditions-section"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CulturePage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <Link href="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mb-6 transition-colors group">
        <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>
      <TraditionsSection />
    </div>
  )
}
