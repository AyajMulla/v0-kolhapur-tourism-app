import Link from "next/link"
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export default function Footer() {
  const { t, language } = useLanguage()

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  Kolhapur Tourism
                </h3>
                <p className={`text-xs text-gray-400 ${language !== 'en' ? 'font-devanagari' : ''}`}>
                  {language === 'mr' ? 'सांस्कृतिक राजधानी' : language === 'hi' ? 'सांस्कृतिक राजधानी' : 'Cultural Capital'}
                </p>
              </div>
            </div>
            <p className={`text-gray-300 text-sm leading-relaxed ${language !== 'en' ? 'font-devanagari' : ''}`}>
              {t('footerDesc')}
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className={`text-lg font-semibold text-orange-400 ${language !== 'en' ? 'font-devanagari' : ''}`}>
              {t('quickLinks')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/places" className={`text-gray-300 hover:text-white transition-colors text-sm ${language !== 'en' ? 'font-devanagari' : ''}`}>
                  {t('places')}
                </Link>
              </li>
              <li>
                <Link href="/hotels" className={`text-gray-300 hover:text-white transition-colors text-sm ${language !== 'en' ? 'font-devanagari' : ''}`}>
                  {t('hotels')}
                </Link>
              </li>
              <li>
                <Link href="/food" className={`text-gray-300 hover:text-white transition-colors text-sm ${language !== 'en' ? 'font-devanagari' : ''}`}>
                  {t('food')}
                </Link>
              </li>
              <li>
                <Link href="/plan-trip" className={`text-gray-300 hover:text-white transition-colors text-sm ${language !== 'en' ? 'font-devanagari' : ''}`}>
                  {t('planTrip')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div className="space-y-4">
            <h4 className={`text-lg font-semibold text-red-400 ${language !== 'en' ? 'font-devanagari' : ''}`}>
              {t('popularDestinations')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className={`text-gray-300 hover:text-white transition-colors text-sm ${language !== 'en' ? 'font-devanagari text-xs' : ''}`}>
                  {language === 'mr' ? 'महालक्ष्मी मंदिर' : 'Mahalaxmi Temple'}
                </Link>
              </li>
              <li>
                <Link href="#" className={`text-gray-300 hover:text-white transition-colors text-sm ${language !== 'en' ? 'font-devanagari text-xs' : ''}`}>
                  {language === 'mr' ? 'पन्हाळा किल्ला' : 'Panhala Fort'}
                </Link>
              </li>
              <li>
                <Link href="#" className={`text-gray-300 hover:text-white transition-colors text-sm ${language !== 'en' ? 'font-devanagari text-xs' : ''}`}>
                  {language === 'mr' ? 'नया राजवाडा' : 'New Palace'}
                </Link>
              </li>
              <li>
                <Link href="#" className={`text-gray-300 hover:text-white transition-colors text-sm ${language !== 'en' ? 'font-devanagari text-xs' : ''}`}>
                  {language === 'mr' ? 'राधानगरी अभयारण्य' : 'Radhanagari Wildlife'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className={`text-lg font-semibold text-yellow-400 ${language !== 'en' ? 'font-devanagari' : ''}`}>
              {t('contactUs')}
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
                <div className={language !== 'en' ? 'font-devanagari text-sm' : ''}>
                  <p className="text-gray-300 text-sm">
                    {language === 'mr' ? 'पर्यटन कार्यालय, कोल्हापूर' : 'Tourism Office, Kolhapur'}
                    <br />
                    {language === 'mr' ? 'महाराष्ट्र, भारत - ४१६००१' : 'Maharashtra, India - 416001'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">+91 935 9405574</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-orange-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">ayajmulla2341@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className={`text-gray-400 text-sm ${language !== 'en' ? 'font-devanagari' : ''}`}>{t('copyright')}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className={`text-gray-400 hover:text-white transition-colors text-sm ${language !== 'en' ? 'font-devanagari' : ''}`}>
              {t('privacyPolicy')}
            </Link>
            <Link href="#" className={`text-gray-400 hover:text-white transition-colors text-sm ${language !== 'en' ? 'font-devanagari' : ''}`}>
              {t('termsOfService')}
            </Link>
            <Link href="#" className={`text-gray-400 hover:text-white transition-colors text-sm ${language !== 'en' ? 'font-devanagari' : ''}`}>
              {t('sitemap')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
