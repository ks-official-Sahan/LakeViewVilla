"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { BOOKING_FACTS } from "@/data/content"
import { SectionReveal } from "@/components/motion/section-reveal"

export function GalleryTeaser() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const lightboxRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const images = [
    ...BOOKING_FACTS.images,
  ]

  useEffect(() => {
    if (selectedImage !== null && closeButtonRef.current) {
      closeButtonRef.current.focus()
    }
  }, [selectedImage])

  const openLightbox = (index: number) => {
    setSelectedImage(index)
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    document.body.style.overflow = "unset"
  }

  const goToNext = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length)
    }
  }

  const goToPrev = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeLightbox()
    } else if (e.key === "ArrowRight") {
      goToNext()
    } else if (e.key === "ArrowLeft") {
      goToPrev()
    }
  }

  return (
    <SectionReveal>
      <section id="gallery" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">A glimpse of paradise</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto text-pretty">
              Immerse yourself in the serene beauty of Lake View Villa through our curated gallery.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.slice(0, 6).map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`relative overflow-hidden rounded-2xl cursor-pointer group ${
                  index === 0 ? "md:col-span-2 md:row-span-2" : ""
                }`}
                onClick={() => openLightbox(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    openLightbox(index)
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View ${image.alt} in lightbox`}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
              >
                <div className={`relative ${index === 0 ? "h-96 md:h-full" : "h-64"}`}>
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes={index === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  <div
                    className={`absolute inset-0 ring-2 ring-transparent transition-all duration-300 ${
                      focusedIndex === index ? "ring-blue-500 ring-offset-2" : ""
                    }`}
                  ></div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Lightbox */}
          <AnimatePresence>
            {selectedImage !== null && (
              <motion.div
                ref={lightboxRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                onClick={closeLightbox}
                onKeyDown={handleKeyDown}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-label="Image lightbox"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="relative max-w-4xl max-h-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={images[selectedImage].src || "/placeholder.svg"}
                    alt={images[selectedImage].alt}
                    width={images[selectedImage].w}
                    height={images[selectedImage].h}
                    className="max-w-full max-h-[80vh] object-contain"
                  />

                  <button
                    ref={closeButtonRef}
                    onClick={closeLightbox}
                    className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-colors focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
                    aria-label="Close lightbox"
                  >
                    <X size={24} />
                  </button>

                  <button
                    onClick={goToPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-colors focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-colors focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </SectionReveal>
  )
}
