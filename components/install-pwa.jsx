"use client"

import { useState, useEffect } from "react"
import { Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isSafari, setIsSafari] = useState(false)
  const [isInsecure, setIsInsecure] = useState(false)

  useEffect(() => {
    // Check for secure context (HTTPS or localhost)
    const isSecure = window.isSecureContext || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    setIsInsecure(!isSecure)
    
    console.log("PWA: Debug Info", {
      isSecureContext: window.isSecureContext,
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      isSecure: isSecure
    });

    if (!isSecure) {
      console.warn("PWA: Features are disabled because this is not a secure context (HTTPS or localhost).")
    }

    // Detect Safari on iOS
    const ua = window.navigator.userAgent
    const isIOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i)
    const isSafariBrowser = !!ua.match(/Safari/i) && !ua.match(/CriOS/i)
    setIsSafari(isIOS && isSafariBrowser)

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      console.log("PWA: beforeinstallprompt event captured (Automated Install Available)")
      
      const alreadyDismissed = sessionStorage.getItem("pwa-prompt-dismissed");
      if (!alreadyDismissed) {
        // For browsers that support the prompt, show it slightly earlier
        setTimeout(() => setIsVisible(true), 3000)
      }
    }

    // Fallback: If after 8 seconds we don't have an automated prompt, show manual instructions
    const fallbackTimer = setTimeout(() => {
      const alreadyDismissed = sessionStorage.getItem("pwa-prompt-dismissed");
      if (!alreadyDismissed && !deferredPrompt && !window.matchMedia("(display-mode: standalone)").matches) {
        console.log("PWA: Fallback to Manual Instructions (No automated prompt after 8s)")
        setIsVisible(true)
      }
    }, 8000)

    window.addEventListener("beforeinstallprompt", handler)

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsVisible(false)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
      clearTimeout(fallbackTimer)
    }
  }, [deferredPrompt])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    
    // Show the native install prompt
    deferredPrompt.prompt()
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice
    console.log(`User response to the install prompt: ${outcome}`)
    
    // We've used the prompt, and can't use it again, so clear it
    setDeferredPrompt(null)
    setIsVisible(false)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    // Optional: save to session storage so we don't show it again this session
    sessionStorage.setItem("pwa-prompt-dismissed", "true")
  }

  // Don't show if already dismissed in this session
  useEffect(() => {
    if (sessionStorage.getItem("pwa-prompt-dismissed")) {
      setIsVisible(false)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-24 left-4 right-4 z-[60] md:left-auto md:right-6 md:w-[320px] animate-in slide-in-from-bottom-5 duration-500">
      <Card className="p-4 bg-orange-600 text-white shadow-2xl border-0 overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-700 to-red-600 opacity-50 group-hover:opacity-70 transition-opacity" />
        
        <div className="relative z-10 flex items-start gap-3">
          <div className="p-2 bg-white/20 rounded-lg shrink-0">
            <Download className="h-5 w-5" />
          </div>
          
          <div className="flex-1 pr-6">
            <h4 className="font-bold text-sm">Install Kolhapur Tourism</h4>
            <p className="text-xs text-orange-50 mt-1">
              {isInsecure 
                ? "Mobile browsers REQUIRE a secure https:// link (like a tunnel) to enable PWA and Location features. Local IPs are blocked."
                : isSafari 
                  ? "Tap the Share icon and then 'Add to Home Screen' to install." 
                  : !deferredPrompt 
                    ? "Tap the three dots (⋮) and select 'Install app' or 'Add to home screen'."
                    : "Add to your home screen for faster access & offline mode."}
            </p>
            {!isInsecure && (
              <div className="mt-3 flex gap-2">
                {deferredPrompt && !isSafari ? (
                  <Button 
                    size="sm" 
                    onClick={handleInstallClick}
                    className="bg-white text-orange-600 hover:bg-orange-50 font-bold px-4 h-8"
                  >
                    Install Now
                  </Button>
                ) : (
                  <div className="flex items-center gap-1 text-xs font-bold bg-white/20 px-2 py-1 rounded">
                    <span>{isSafari ? "Scroll down to 'Add to Home Screen'" : "Tap your browser menu (⋮)"}</span>
                  </div>
                ) }
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDismiss}
                  className="text-white hover:bg-white/10 px-2 h-8"
                >
                  Later
                </Button>
              </div>
            )}
            {isInsecure && (
              <div className="mt-3">
                <Button 
                  size="sm" 
                  onClick={() => alert("1. Install 'localtunnel' or 'zrok' to create an HTTPS link.\n2. Or connect your Android via USB and use Chrome 'Port Forwarding'.\n3. Local IPs like 192.168... are NOT considered secure origins.")}
                  className="bg-white text-orange-600 font-bold px-4 h-8"
                >
                  View Solution
                </Button>
              </div>
            )}
          </div>

          <button 
            onClick={handleDismiss}
            className="absolute top-0 right-0 p-1 text-white/60 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </Card>
    </div>
  )
}
