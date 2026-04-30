import "./globals.css"
import { Playfair_Display, Noto_Sans_Devanagari } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import AIAssistant from "@/components/ai-assistant"

// Only Google fonts now
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
})

const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
})

export const metadata = {
  title: "Kolhapur Tourism - Discover the Cultural Capital of Maharashtra",
  description:
    "Explore the rich heritage, temples, forts, and natural beauty of Kolhapur. Your complete guide to tourist places, food, and accommodation.",
  icons: {
    icon: "/favicon.svg",
  },
}

import { AuthProvider } from "@/lib/auth-context"
import SWRegister from "@/components/sw-register"

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${notoSansDevanagari.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <AIAssistant />
            <Toaster />
            <SWRegister />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
