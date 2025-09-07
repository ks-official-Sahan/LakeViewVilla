"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Users, Bed } from "lucide-react"
import { PROPERTY } from "@/data/booking"

export function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % PROPERTY.images_sample.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images with Parallax */}
      <div className="absolute inset-0">
        {PROPERTY.images_sample.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={`${PROPERTY.name} view ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <div className="space-y-6 animate-fade-in">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
            {PROPERTY.scores_reviews.overall_score}/10 • {PROPERTY.scores_reviews.reviews_count} Reviews
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">{PROPERTY.name}</h1>

          <p className="text-xl md:text-2xl text-white/90 text-balance max-w-2xl mx-auto">
            Luxury beachfront villa with stunning lake and ocean views in the heart of Tangalle
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>Beachfront Location</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>Up to {PROPERTY.occupancy.max_guests} Guests</span>
            </div>
            <div className="flex items-center gap-2">
              <Bed className="w-5 h-5" />
              <span>{PROPERTY.occupancy.bedrooms} Bedrooms</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
              Book Your Stay
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900 bg-transparent"
            >
              View Gallery
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
