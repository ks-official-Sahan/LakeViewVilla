"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SITE_CONFIG } from "@/data/content"
import { buildWhatsAppUrl } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "#home" },
  { name: "Gallery", href: "#gallery" },
  { name: "Stays", href: "#stays" },
  { name: "Visit", href: "#location" },
  { name: "FAQ", href: "#faq" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      // Section spy
      const sections = navigation.map((item) => item.href.slice(1))
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })

      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleBooking = () => {
    window.open(SITE_CONFIG.bookingDeepLink, "_blank")
  }

  const handleWhatsApp = () => {
    const message =
      "Hi! I'm interested in booking Lake View Villa Tangalle. Could you please share availability and rates?"
    const url = buildWhatsAppUrl(SITE_CONFIG.whatsappNumber, message)
    window.open(url, "_blank")
  }

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.slice(1))
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMobileMenuOpen(false)
  }

  if (!isHydrated) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-xl font-bold text-white">Lake View Villa</div>
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <span key={item.name} className="text-white/70">
                {item.name}
              </span>
            ))}
            <div className="w-20 h-10 bg-white/20 rounded"></div>
          </div>
        </nav>
      </header>
    )
  }

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/10 backdrop-blur-xl shadow-2xl border-b border-white/30 shadow-cyan-500/20"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div
          className={`text-xl font-bold transition-all duration-300 ${
            isScrolled
              ? "text-white drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] text-shadow-neon"
              : "text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          }`}
          whileHover={{ scale: 1.05 }}
        >
          Lake View Villa
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navigation.map((item, index) => (
            <motion.button
              key={item.name}
              onClick={() => scrollToSection(item.href)}
              className={`transition-all duration-300 relative ${
                activeSection === item.href.slice(1)
                  ? isScrolled
                    ? "text-cyan-400 font-medium drop-shadow-[0_0_8px_rgba(6,182,212,1)]"
                    : "text-white font-medium drop-shadow-[0_0_10px_rgba(255,255,255,1)]"
                  : isScrolled
                    ? "text-white/90 hover:text-cyan-300 hover:drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]"
                    : "text-white/80 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              }`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              {item.name}
              {activeSection === item.href.slice(1) && (
                <motion.div
                  className={`absolute -bottom-1 left-0 right-0 h-0.5 ${
                    isScrolled
                      ? "bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                      : "bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]"
                  }`}
                  layoutId="activeSection"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button
              onClick={handleBooking}
              className={`transition-all duration-300 backdrop-blur-md border ${
                isScrolled
                  ? "bg-cyan-500/20 hover:bg-cyan-400/30 text-white border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                  : "bg-white/20 text-white hover:bg-white/30 border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
              }`}
              data-magnetic
            >
              Book Now
            </Button>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className={`md:hidden transition-colors duration-300 ${
            isScrolled
              ? "text-white drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
              : "text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
          }`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle mobile menu"
        >
          <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-black/20 backdrop-blur-xl border-t border-white/20"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {navigation.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`block w-full text-left py-3 px-4 rounded-lg transition-all backdrop-blur-sm ${
                    activeSection === item.href.slice(1)
                      ? "text-cyan-400 bg-cyan-500/20 font-medium border border-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                      : "text-white/90 hover:text-cyan-300 hover:bg-white/10 border border-white/20 hover:border-cyan-400/30"
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {item.name}
                </motion.button>
              ))}

              <div className="pt-4 space-y-3">
                <Button
                  onClick={handleBooking}
                  className="w-full bg-cyan-500/20 hover:bg-cyan-400/30 text-white border border-cyan-400/50 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                  data-magnetic
                >
                  Book on Booking.com
                </Button>

                <Button
                  onClick={handleWhatsApp}
                  variant="outline"
                  className="w-full border-green-400/50 text-green-400 hover:bg-green-500/20 bg-transparent backdrop-blur-md shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                  data-magnetic
                >
                  Message on WhatsApp
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
