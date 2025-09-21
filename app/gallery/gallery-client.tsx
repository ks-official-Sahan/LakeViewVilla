"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionReveal } from "@/components/motion/section-reveal";

type Img = { src: string; alt: string; w: number; h: number };

export default function GalleryClient({ images }: { images: Img[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  // Lightbox keyboard controls + body scroll lock
  useEffect(() => {
    if (selected == null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowLeft")
        setSelected((p) =>
          p == null ? null : p > 0 ? p - 1 : images.length - 1
        );
      if (e.key === "ArrowRight")
        setSelected((p) =>
          p == null ? null : p < images.length - 1 ? p + 1 : 0
        );
    };

    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [selected]);

  // Drag threshold so clicks don’t open after scroll
  const onMouseDown = (e: React.MouseEvent) => {
    dragStart.current = { x: e.clientX, y: e.clientY };
    setDragging(false);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    const s = dragStart.current;
    if (!s) return;
    const dx = Math.abs(e.clientX - s.x);
    const dy = Math.abs(e.clientY - s.y);
    if (dx + dy > 8) setDragging(true);
  };
  const onMouseUp = (index: number) => {
    if (!dragging) setSelected(index);
    dragStart.current = null;
    setDragging(false);
  };

  return (
    <>
      {/* Masonry (pure CSS columns) */}
      <div
        className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4"
        style={{ cursor: dragging ? "grabbing" : "grab" }}
      >
        {images.map((image, i) => (
          <motion.div
            key={image.src + i}
            className="break-inside-avoid group cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={() => onMouseUp(i)}
          >
            <SectionReveal>
              <div className="relative overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/15 backdrop-blur-md shadow-2xl">
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt || "Lake View Villa photo"}
                  width={image.w}
                  height={image.h}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </SectionReveal>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <div className="relative max-w-7xl max-h-[90vh] mx-4">
              <button
                onClick={() => setSelected(null)}
                className="absolute -top-12 right-0 text-white hover:text-cyan-400 transition-colors z-10"
                aria-label="Close"
              >
                <X size={32} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected((p) =>
                    p == null ? null : p > 0 ? p - 1 : images.length - 1
                  );
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-cyan-400 transition-colors z-10"
                aria-label="Previous image"
              >
                <ChevronLeft size={48} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected((p) =>
                    p == null ? null : p < images.length - 1 ? p + 1 : 0
                  );
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-cyan-400 transition-colors z-10"
                aria-label="Next image"
              >
                <ChevronRight size={48} />
              </button>

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={images[selected].src}
                  alt={images[selected].alt}
                  width={images[selected].w}
                  height={images[selected].h}
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                  priority
                />
              </motion.div>

              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white text-sm">
                {selected + 1} / {images.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
