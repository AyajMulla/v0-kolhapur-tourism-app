"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { X, Mail, Lock, User, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function LoginModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isOpen || !mounted) return null

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isLogin) {
        await login(formData.email, formData.password)
        toast({
          title: "Welcome Back!",
          description: "You have successfully logged in.",
          variant: "default",
        })
      } else {
        await register(formData.name, formData.email, formData.password)
        toast({
          title: "Account Created!",
          description: "Welcome to Kolhapur Tourism.",
          variant: "default",
        })
      }
      onClose() // Successfully logged in/registered, close modal
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-md md:max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="h-4 w-4 text-gray-500" />
          <span className="sr-only">Close</span>
        </button>
        <div className="flex flex-col md:flex-row w-full">

          
          {/* Left Side Branding */}
          <div className="hidden md:flex flex-col justify-center items-center w-2/5 bg-gradient-to-br from-orange-500 to-red-600 p-8 text-white">
            <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
            <p className="text-sm text-white/80 text-center mb-8">
              Join the Kolhapur Tourism community to save your favorite destinations and leave reviews.
            </p>
            <div className="w-24 h-24 rounded-full border-4 border-white/20 flex items-center justify-center">
              <User className="h-10 w-10 text-white/80" />
            </div>
          </div>

          {/* Right Side Form */}
          <div className="w-full md:w-3/5 p-8 relative">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {isLogin ? "Sign In" : "Create Account"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {isLogin ? "Welcome back! Please enter your details." : "Register to unlock premium features."}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start text-red-600 text-sm">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="pl-10"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white mt-6"
              >
                {loading ? "Please wait..." : (isLogin ? "Sign In" : "Register")}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError("")
                }}
                className="text-orange-600 font-semibold hover:underline"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
