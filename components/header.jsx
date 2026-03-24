"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import LoginModal from "@/components/login-modal";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      variant: "default",
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-orange-100">
      <div className="container mx-auto px-4">
        {/* Top bar with contact info */}
        <div className="hidden md:flex justify-between items-center py-2 text-sm text-gray-600 border-b border-orange-50">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1">
              <Phone className="h-3 w-3" />
              <span>+91 935 940 5574</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail className="h-3 w-3" />
              <span>info@kolhapurtourism.com</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span>Kolhapur, Maharashtra, India</span>
          </div>
        </div>

        {/* Main navigation */}
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Kolhapur Tourism
              </h1>
              <p className="text-xs text-gray-500">
                Cultural Capital of Maharashtra
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              scroll={false}
              onClick={(e) => {
                // If already on home, prevent full reload
                if (globalThis.location.pathname === "/") {
                  e.preventDefault();
                  globalThis.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              Home
            </Link>
            <Link
              href="/places"
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              Places
            </Link>
            <Link
              href="/culture"
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              Culture
            </Link>
            <Link
              href="/food"
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              Food
            </Link>
            <Link
              href="/hotels"
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              Hotels
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === "admin" && (
                  <Link href="/admin" className="text-orange-600 font-bold hover:text-red-700 transition">
                    Admin Panel
                  </Link>
                )}
                <span className="text-gray-700 font-medium">Hi, {user.name}</span>
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  className="border-orange-500 text-orange-600 hover:bg-orange-50"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => setShowLogin(true)}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
              >
                Sign In
              </Button>
            )}
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-orange-100">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                href="/places"
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                Places
              </Link>
              <Link
                href="/culture"
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                Culture
              </Link>
              <Link
                href="/food"
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                Food
              </Link>
              <Link
                href="/hotels"
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                Hotels
              </Link>
              {user ? (
                <>
                  <div className="py-2 text-center text-gray-700 font-medium border-y border-orange-100 flex flex-col space-y-2">
                    <span>Logged in as {user.name}</span>
                    {user.role === "admin" && (
                      <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="text-orange-600 font-bold hover:underline">
                        Go to Admin Panel
                      </Link>
                    )}
                  </div>
                  <Button 
                    onClick={handleLogout}
                    variant="outline"
                    className="border-orange-500 text-orange-600 w-full hover:bg-orange-50"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => {
                    setShowLogin(true);
                    setIsMenuOpen(false);
                  }}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white w-full"
                >
                  Sign In
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </header>
  );
}
