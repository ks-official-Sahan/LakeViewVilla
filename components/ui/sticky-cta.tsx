"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { buildWhatsAppLink } from "@/lib/utils"

export function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 800
      setIsVisible(scrolled)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleWhatsApp = () => {
    const whatsappUrl = buildWhatsAppLink({
      name: "Interested Guest",
      dates: new Date().toISOString().split("T")[0],
      guests: 2,
      message: "I'm interested in booking Lake View Villa Tangalle",
      currentUrl: window.location.href,
    })
    window.open(whatsappUrl, "_blank")
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-40 flex gap-2 max-w-sm mx-auto"
        >
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700" data-magnetic>
            Book Now
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white border-green-600"
            onClick={handleWhatsApp}
            data-magnetic
          >
            WhatsApp
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
