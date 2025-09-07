"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { SectionReveal } from "@/components/motion/section-reveal"
import { generateBreadcrumbSchema } from "@/lib/structured-data"
import { BookingAdapter } from "@/lib/booking-adapter"
import { safeArray } from "@/lib/utils"
import Head from "next/head"

async function getGalleryImages() {
  try {
    const bookingFacts = await BookingAdapter.getBookingFacts()
    const bookingImages = bookingFacts?.images || []

    // Combine booking images with local fallback images
    const fallbackImages = [
      {
        src: "/serene-lagoon-at-sunrise-with-villa-silhouette.jpg",
        alt: "Serene lagoon at sunrise with villa silhouette",
        w: 1200,
        h: 800,
      },
      {
        src: "/villa-interior-living-room.png",
        alt: "Villa interior living room with modern furnishings",
        w: 1200,
        h: 800,
      },
      {
        src: "/villa-lagoon-video-poster.jpg",
        alt: "Villa lagoon aerial view",
        w: 1200,
        h: 800,
      },
    ]

    return safeArray([...bookingImages, ...fallbackImages])
  } catch (error) {
    console.warn("[Gallery] Failed to load booking images:", error)
    return [
      {
        src: "/serene-lagoon-at-sunrise-with-villa-silhouette.jpg",
        alt: "Serene lagoon at sunrise with villa silhouette",
        w: 1200,
        h: 800,
      },
      {
        src: "/villa-interior-living-room.png",
        alt: "Villa interior living room with modern furnishings",
        w: 1200,
        h: 800,
      },
      {
        src: "/villa-lagoon-video-poster.jpg",
        alt: "Villa lagoon aerial view",
        w: 1200,
        h: 800,
      },
    ]
  }
}

export default async function GalleryPage() {
  const galleryImages = await getGalleryImages()

  return (
    <>
      <Head>
        <title>Gallery - Lake View Villa Tangalle</title>
        <meta
          name="description"
          content="Explore the beauty of Lake View Villa Tangalle through our curated collection of images showcasing the serene lagoon views and villa amenities."
        />
        <link rel="canonical" href="https://lakeviewvillatangalle.com/gallery" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              generateBreadcrumbSchema([
                { name: "Home", url: "https://lakeviewvillatangalle.com/" },
                { name: "Gallery", url: "https://lakeviewvillatangalle.com/gallery" },
              ]),
            ),
          }}
        />
      </Head>

      <GalleryClient images={galleryImages} />
    </>
  )
}

function GalleryClient({ images }: { images: Array<{ src: string; alt: string; w: number; h: number }> }) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle keyboard navigation in lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return

      switch (e.key) {
        case "Escape":
          setSelectedImage(null)
          break
        case "ArrowLeft":
          setSelectedImage((prev) => (prev === null ? null : prev > 0 ? prev - 1 : images.length - 1))
          break
        case "ArrowRight":
          setSelectedImage((prev) => (prev === null ? null : prev < images.length - 1 ? prev + 1 : 0))
          break
      }
    }

    if (selectedImage !== null) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [selectedImage, images.length])

  const handleMouseDown = () => setIsDragging(false)
  const handleMouseMove = () => setIsDragging(true)
  const handleMouseUp = (index: number) => {
    if (!isDragging) {
      setSelectedImage(index)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="relative z-10 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <SectionReveal>
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Villa Gallery
                </span>
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Explore the beauty of Lake View Villa Tangalle through our curated collection of images
              </p>
              <p className="text-sm text-slate-400 mt-2">
                {images.length} images showcasing our villa and surroundings
              </p>
            </div>
          </SectionReveal>
        </div>
      </div>

      {/* Masonry Gallery */}
      <div className="container mx-auto px-4 pb-20">
        <SectionReveal>
          <div
            ref={containerRef}
            className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4"
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
          >
            {images.map((image, index) => (
              <motion.div
                key={index}
                className="break-inside-avoid mb-4 group cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={() => handleMouseUp(index)}
              >
                <div className="relative overflow-hidden rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 shadow-2xl">
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    width={image.w}
                    height={image.h}
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </SectionReveal>
      </div>

      {/* Lightbox Dialog */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-7xl max-h-[90vh] mx-4">
              {/* Close button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-cyan-400 transition-colors z-10"
                aria-label="Close lightbox"
              >
                <X size={32} />
              </button>

              {/* Navigation buttons */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImage((prev) => (prev === null ? null : prev > 0 ? prev - 1 : images.length - 1))
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-cyan-400 transition-colors z-10"
                aria-label="Previous image"
              >
                <ChevronLeft size={48} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImage((prev) => (prev === null ? null : prev < images.length - 1 ? prev + 1 : 0))
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-cyan-400 transition-colors z-10"
                aria-label="Next image"
              >
                <ChevronRight size={48} />
              </button>

              {/* Image */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={images[selectedImage].src || "/placeholder.svg"}
                  alt={images[selectedImage].alt}
                  width={images[selectedImage].w}
                  height={images[selectedImage].h}
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                  priority
                />
              </motion.div>

              {/* Image counter */}
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white text-sm">
                {selectedImage + 1} / {images.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
