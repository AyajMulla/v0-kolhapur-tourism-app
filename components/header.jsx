"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import LoginModal from "@/components/login-modal";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { user, logout } = useAuth();
  const { language, changeLanguage, t } = useLanguage();
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
        {/* Top bar with contact info and language toggle */}
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
            {/* Language Toggle */}
            <div className="flex items-center ml-4 space-x-2 border-l border-gray-300 pl-4">
              <button 
                onClick={() => changeLanguage('en')} 
                className={`px-2 py-0.5 rounded transition ${language === 'en' ? 'bg-orange-600 text-white font-bold' : 'hover:bg-orange-50'}`}
              >
                EN
              </button>
              <button 
                onClick={() => changeLanguage('mr')} 
                className={`px-2 py-0.5 rounded transition font-devanagari ${language === 'mr' ? 'bg-orange-600 text-white font-bold' : 'hover:bg-orange-50'}`}
              >
                मराठी
              </button>
              <button 
                onClick={() => changeLanguage('hi')} 
                className={`px-2 py-0.5 rounded transition font-devanagari ${language === 'hi' ? 'bg-orange-600 text-white font-bold' : 'hover:bg-orange-50'}`}
              >
                हिंदी
              </button>
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
              <p className="text-xs text-gray-500 font-devanagari">
                {t('capital')}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              scroll={false}
              className={`text-gray-700 hover:text-orange-600 transition-colors font-medium ${language !== 'en' ? 'font-devanagari' : ''}`}
              onClick={(e) => {
                if (globalThis.location.pathname === "/") {
                  e.preventDefault();
                  globalThis.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              {t('home')}
            </Link>
            <Link
              href="/places"
              className={`text-gray-700 hover:text-orange-600 transition-colors font-medium ${language !== 'en' ? 'font-devanagari' : ''}`}
            >
              {t('places')}
            </Link>
            <Link
              href="/culture"
              className={`text-gray-700 hover:text-orange-600 transition-colors font-medium ${language !== 'en' ? 'font-devanagari' : ''}`}
            >
              {t('culture')}
            </Link>
            <Link
              href="/food"
              className={`text-gray-700 hover:text-orange-600 transition-colors font-medium ${language !== 'en' ? 'font-devanagari' : ''}`}
            >
              {t('food')}
            </Link>
            <Link
              href="/hotels"
              className={`text-gray-700 hover:text-orange-600 transition-colors font-medium ${language !== 'en' ? 'font-devanagari' : ''}`}
            >
              {t('hotels')}
            </Link>
            
            {user && (
              <Link
                href="/plan-trip"
                className={`relative text-gray-700 hover:text-orange-600 transition-colors font-medium flex items-center ${language !== 'en' ? 'font-devanagari' : ''}`}
              >
                {t('planTripMenu')}
                {user.favorites?.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full min-w-[18px] text-center">
                    {user.favorites.length}
                  </span>
                )}
              </Link>
            )}
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === "admin" && (
                  <Link href="/admin" className={`text-orange-600 font-bold hover:text-red-700 transition ${language !== 'en' ? 'font-devanagari' : ''}`}>
                    {t('adminPanel')}
                  </Link>
                )}
                <span className={`text-gray-700 font-medium ${language !== 'en' ? 'font-devanagari' : ''}`}>
                  {language === 'en' ? `Hi, ${user.name}` : `${user.name}, नमस्कार`}
                </span>
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  className={`border-orange-500 text-orange-600 hover:bg-orange-50 ${language !== 'en' ? 'font-devanagari' : ''}`}
                >
                  {t('logout')}
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => setShowLogin(true)}
                className={`bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white ${language !== 'en' ? 'font-devanagari' : ''}`}
              >
                {t('login')}
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
                onClick={() => setIsMenuOpen(false)}
              >
                Hotels
              </Link>
              {user && (
                <Link
                  href="/plan-trip"
                  className="text-gray-700 hover:text-orange-600 transition-colors font-medium flex items-center justify-between"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Plan Trip</span>
                  {user.favorites?.length > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {user.favorites.length}
                    </span>
                  )}
                </Link>
              )}
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
