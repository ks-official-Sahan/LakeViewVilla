"use client"

import type React from "react"

import { useRef, useState } from "react"
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { SectionReveal } from "@/components/motion/section-reveal"

export function ExperiencesReel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const x = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 30 })

  const experiences = [
    {
      name: "Rekawa turtle beach",
      image: "/images/turtle-beach.jpg",
      description: "Watch sea turtles nesting under starlit skies",
    },
    {
      name: "Mulkirigala rock temple",
      image: "/images/rock-temple.jpg",
      description: "Ancient Buddhist temple carved into rock",
    },
    {
      name: "Yala safari day trip",
      image: "/images/yala-safari.jpg",
      description: "Spot leopards and elephants in their natural habitat",
    },
    {
      name: "Hummanaya blowhole",
      image: "/images/blowhole.jpg",
      description: "Natural water spout creating spectacular displays",
    },
  ]

  const handleDragEnd = () => {
    setIsDragging(false)
    const currentX = x.get()
    const threshold = 100

    if (currentX > threshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else if (currentX < -threshold && currentIndex < experiences.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }

    x.set(0)
  }

  const goToNext = () => {
    if (currentIndex < experiences.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      goToPrev()
    } else if (e.key === "ArrowRight") {
      goToNext()
    }
  }

  return (
    <SectionReveal>
      <section id="experiences" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Discover Tangalle's wonders</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto text-pretty">
              From ancient temples to wildlife encounters, create memories that last a lifetime.
            </p>
          </motion.div>

          <div
            className="relative max-w-4xl mx-auto"
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="region"
            aria-label="Experiences carousel"
          >
            <motion.div
              ref={containerRef}
              className="overflow-hidden rounded-2xl"
              style={{ x: springX }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={handleDragEnd}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  className="relative h-96 md:h-[500px] bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center text-white"
                  style={{
                    backgroundImage: `url(${experiences[currentIndex].image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="relative z-10 text-center px-8">
                    <motion.h3
                      className="text-3xl md:text-4xl font-bold mb-4 text-balance"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {experiences[currentIndex].name}
                    </motion.h3>
                    <motion.p
                      className="text-lg md:text-xl text-white/90 text-pretty"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {experiences[currentIndex].description}
                    </motion.p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Navigation Buttons */}
            <button
              onClick={goToPrev}
              disabled={currentIndex === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
              aria-label="Previous experience"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={goToNext}
              disabled={currentIndex === experiences.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
              aria-label="Next experience"
            >
              <ChevronRight size={24} />
            </button>

            {/* Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {experiences.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    index === currentIndex ? "bg-blue-600" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to experience ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </SectionReveal>
  )
}
