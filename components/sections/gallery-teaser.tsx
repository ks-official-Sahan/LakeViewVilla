"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useGSAP } from "@/lib/gsap";
import { gsap, EASE, DURATION } from "@/lib/gsap";
import { X, ChevronLeft, ChevronRight, ArrowRight, Maximize2 } from "lucide-react";
import { BOOKING_FACTS } from "@/data/content";

export function GalleryTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [lightbox, setLightbox] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const images = BOOKING_FACTS.images ?? [];
  const preview = images.slice(0, 6);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      // Heading reveal
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: DURATION.reveal,
          ease: EASE.premium,
          scrollTrigger: { trigger: headingRef.current, start: "top 85%", once: true },
        }
      );

      let revertParallax: (() => void) | undefined;

      // Staggered grid reveal + tiered scrub parallax (plan §4.5: ~0.3 / 0.5 / 0.7 × baseline)
      const cells = gridRef.current?.querySelectorAll<HTMLElement>("[data-cell]");
      if (cells?.length) {
        gsap.fromTo(
          cells,
          { opacity: 0, y: 60, scale: 0.94, filter: "blur(4px)" },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.9,
            ease: EASE.premium,
            stagger: { each: 0.1, from: "start" },
            scrollTrigger: { trigger: gridRef.current, start: "top 80%", once: true },
          }
        );

        const mm = gsap.matchMedia();
        revertParallax = () => mm.revert();
        const PARALLAX_BASE_Y = -24;
        const SPEED_TIERS = [0.3, 0.5, 0.5, 0.5, 0.7, 0.7];

        mm.add("(min-width: 768px)", () => {
          cells.forEach((cell, i) => {
            const tier = SPEED_TIERS[i] ?? 0.55;
            gsap.to(cell, {
              yPercent: PARALLAX_BASE_Y * tier,
              ease: "none",
              scrollTrigger: {
                trigger: gridRef.current!,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5,
              },
            });
          });
        });
      }

      // CTA reveal
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: EASE.out,
          scrollTrigger: { trigger: ctaRef.current, start: "top 90%", once: true },
        }
      );

      return () => revertParallax?.();
    },
    { scope: sectionRef }
  );

  // Lightbox keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => ((i ?? 0) + 1) % images.length);
      if (e.key === "ArrowLeft") setLightbox((i) => ((i ?? 0) - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, images.length]);

  const openLightbox = useCallback((i: number) => {
    setLightbox(i);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
    document.body.style.overflow = "";
  }, []);

  return (
    <section
      ref={sectionRef}
      id="gallery"
      aria-labelledby="gallery-heading"
      className="relative overflow-hidden py-24 md:py-36 bg-[var(--color-background)]"
    >
      {/* Cinematic gradient ambient overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, rgba(var(--color-gold-rgb, 212,168,83), 0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-4 md:px-8">
        {/* Heading */}
        <div ref={headingRef} className="mb-16 flex flex-col items-center text-center md:mb-24">
          <p className="mb-4 text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-gold)]">
            Visual Story
          </p>
          <h2
            id="gallery-heading"
            className="font-[var(--font-display)] text-[clamp(2.5rem,5vw,4.5rem)] font-black tracking-tighter text-[var(--color-foreground)] leading-[1.1]"
          >
            A glimpse of{" "}
            <span className="text-gradient-gold inline-block italic pr-2">
              paradise
            </span>
          </h2>
          <p className="mt-6 max-w-2xl text-base md:text-lg text-[var(--color-muted)] font-medium">
            Step into the serene elegance of Lake View Villa. Curated spaces designed to harmonize with the raw beauty of Tangalle's lagoon.
          </p>
        </div>

        {/* Premium Bento Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 gap-2 md:grid-cols-4 md:grid-rows-2 md:gap-4 lg:gap-6 perspective-container"
        >
          {preview.map((img, i) => {
            // Bento sizing logic
            let colSpan = "col-span-1";
            let rowSpan = "row-span-1";
            let aspect = "aspect-[4/5]";

            if (i === 0) {
              colSpan = "col-span-2 md:col-span-2";
              rowSpan = "row-span-2";
              aspect = "aspect-[4/3] md:aspect-auto h-full";
            } else if (i === 3) {
              colSpan = "col-span-2 md:col-span-2";
              rowSpan = "row-span-1";
              aspect = "aspect-[21/9]";
            }

            return (
              <div
                key={i}
                data-cell
                className={`group relative overflow-hidden rounded-xl md:rounded-3xl bg-[var(--color-surface)] shadow-lg ${colSpan} ${rowSpan} card-tilt cursor-pointer border border-[var(--color-border)]`}
                style={{ transformStyle: "preserve-3d" }}
                onClick={() => openLightbox(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openLightbox(i);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View full image: ${img.alt}`}
              >
                <motion.div
                  layoutId={lightbox === i ? "gallery-teaser-flip" : undefined}
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  className={`relative w-full overflow-hidden ${aspect}`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-all duration-[1.2s] cubic-bezier(0.23, 1, 0.32, 1) group-hover:scale-110 group-hover:brightness-[0.85]"
                    sizes={i === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                  />
                  
                  {/* Cinematic grain overlay on images */}
                  <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

                  {/* Dark vignette gradient for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

                  {/* Image info overlay */}
                  <div className="absolute bottom-0 left-0 p-4 md:p-6 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-white text-sm font-semibold tracking-wide drop-shadow-md">
                      {img.alt || "Villa details"}
                    </p>
                  </div>

                  {/* Expand Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-500 group-hover:opacity-100 scale-75 group-hover:scale-100">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
                      <Maximize2 className="h-6 w-6 text-white drop-shadow-md" />
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="mt-16 flex justify-center">
          <Link
            href="/gallery"
            transitionTypes={["spa-page"]}
            className="group inline-flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-4 text-sm font-bold text-[var(--color-foreground)] shadow-sm transition-all duration-300 hover:border-[var(--color-gold)] hover:shadow-[0_8px_30px_rgba(212,168,83,0.15)] btn-ripple"
          >
            Explore Full Gallery
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-background)] transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight className="h-4 w-4 text-[var(--color-gold)]" />
            </span>
          </Link>
        </div>
      </div>

      {/* ── Cinematic Lightbox ──────────────────────────────────────── */}
      {lightbox !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-8 backdrop-blur-xl"
          onClick={closeLightbox}
        >
          <div
            className="relative flex h-full w-full max-w-[90vw] md:max-w-[80vw] flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image — shared layout id with grid thumb for FLIP */}
            <div className="relative flex h-[80vh] w-full items-center justify-center">
              <motion.div
                layoutId="gallery-teaser-flip"
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                className="relative max-h-full max-w-full"
              >
                <Image
                  src={images[lightbox].src}
                  alt={images[lightbox].alt}
                  width={images[lightbox].w}
                  height={images[lightbox].h}
                  className="max-h-full max-w-full w-auto h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                  quality={90}
                  priority
                />
              </motion.div>
            </div>

            {/* Caption */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-full bg-white/10 px-6 py-2 backdrop-blur-md border border-white/10">
              <span className="text-sm font-medium text-white">
                {lightbox + 1} <span className="text-white/40">/</span> {images.length}
              </span>
              <div className="h-1 w-1 rounded-full bg-white/30" />
              <span className="text-sm text-white/80">{images[lightbox].alt}</span>
            </div>

            {/* Controls */}
            <button
              ref={closeRef}
              onClick={closeLightbox}
              aria-label="Close lightbox"
              className="absolute right-0 top-0 md:-right-8 md:-top-8 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-105 border border-white/10"
            >
              <X className="h-5 w-5" />
            </button>

            <button
              onClick={() => setLightbox((i) => ((i ?? 0) - 1 + images.length) % images.length)}
              aria-label="Previous image"
              className="absolute left-0 top-1/2 flex h-14 w-14 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/5 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:-translate-x-1 md:-left-12 border border-white/10"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>

            <button
              onClick={() => setLightbox((i) => ((i ?? 0) + 1) % images.length)}
              aria-label="Next image"
              className="absolute right-0 top-1/2 flex h-14 w-14 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/5 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:translate-x-1 md:-right-12 border border-white/10"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
