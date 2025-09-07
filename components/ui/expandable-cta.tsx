"use client"

import { useState } from "react"
import { MessageCircle, Phone, Calendar, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ExpandableCTA() {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleWhatsApp = () => {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP || "+94771234567"
    const message = encodeURIComponent(
      "Hi! I'm interested in booking Lake View Villa Tangalle. Could you please provide more information?",
    )
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank")
  }

  const handleCall = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP || "+94771234567"
    window.open(`tel:${phoneNumber}`, "_self")
  }

  const handleBooking = () => {
    // Scroll to booking section or open booking modal
    const bookingSection = document.getElementById("booking")
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`flex flex-col items-end gap-3 transition-all duration-300 ${isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
      >
        {/* WhatsApp Button */}
        <Button
          onClick={handleWhatsApp}
          className="glass hover:glass-strong rounded-full p-3 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          data-magnetic
        >
          <MessageCircle className="h-5 w-5" />
          <span className="ml-2 hidden sm:inline">WhatsApp</span>
        </Button>

        {/* Call Button */}
        <Button
          onClick={handleCall}
          className="glass hover:glass-strong rounded-full p-3 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          data-magnetic
        >
          <Phone className="h-5 w-5" />
          <span className="ml-2 hidden sm:inline">Call</span>
        </Button>

        {/* Book Now Button */}
        <Button
          onClick={handleBooking}
          className="glass hover:glass-strong rounded-full p-3 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          data-magnetic
        >
          <Calendar className="h-5 w-5" />
          <span className="ml-2 hidden sm:inline">Book Now</span>
        </Button>
      </div>

      {/* Main Toggle Button */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`mt-3 rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
          isExpanded
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white"
        }`}
        data-magnetic
      >
        {isExpanded ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </div>
  )
}
