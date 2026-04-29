"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@/lib/gsap";
import { gsap, EASE, DURATION } from "@/lib/gsap";
import { X, ChevronLeft, ChevronRight, ArrowRight, Expand } from "lucide-react";
import { BOOKING_FACTS } from "@/data/content";

export function GalleryTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [lightbox, setLightbox] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const images = BOOKING_FACTS.images ?? [];
  const preview = images.slice(0, 6);

  // Section entrance
  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      gsap.fromTo(headingRef.current, { opacity: 0, y: 36 }, {
        opacity: 1, y: 0, duration: DURATION.reveal, ease: EASE.premium,
        scrollTrigger: { trigger: headingRef.current, start: "top 85%", once: true },
      });

      const cells = gridRef.current?.querySelectorAll<HTMLElement>("[data-cell]");
      if (cells) {
        gsap.fromTo(cells, { opacity: 0, scale: 0.96, y: 24 }, {
          opacity: 1, scale: 1, y: 0,
          duration: 0.65, ease: EASE.out,
          stagger: { each: 0.07, from: "start" },
          scrollTrigger: { trigger: gridRef.current, start: "top 82%", once: true },
        });
      }
    },
    { scope: sectionRef }
  );

  // Lightbox focus management
  useEffect(() => {
    if (lightbox !== null) closeRef.current?.focus();
  }, [lightbox]);

  // Keyboard navigation
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
      className="relative overflow-hidden py-24 md:py-32"
    >
      {/* Ambient */}
      <div aria-hidden className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(55% 40% at 30% 60%, rgba(34,211,238,.06), transparent 65%)" }} />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        {/* Heading */}
        <div ref={headingRef} className="mb-12 flex flex-col items-center text-center md:mb-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Visual Story</p>
          <h2 id="gallery-heading"
            className="font-[var(--font-display)] text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold tracking-tight text-[var(--color-foreground)]">
            A glimpse of{" "}
            <span className="bg-gradient-to-r from-[#0ea5e9] to-[#22d3ee] bg-clip-text text-transparent">paradise</span>
          </h2>
          <p className="mt-4 max-w-xl text-[var(--color-muted)]">
            Immerse yourself in the serene beauty of Lake View Villa through our curated gallery.
          </p>
        </div>

        {/* Bento-style grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4"
        >
          {preview.map((img, i) => (
            <div
              key={i}
              data-cell
              className={`group relative cursor-pointer overflow-hidden rounded-2xl bg-[var(--color-surface)] ${
                i === 0 ? "col-span-2 row-span-2 md:col-span-1 md:row-span-2" : ""
              }`}
              style={{ aspectRatio: i === 0 ? "4/5" : "4/3" }}
              onClick={() => openLightbox(i)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(i); } }}
              tabIndex={0}
              role="button"
              aria-label={`Open ${img.alt} in full view`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-105"
                sizes={i === 0 ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 50vw, 33vw"}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/25 group-hover:opacity-100">
                <Expand className="h-7 w-7 text-white drop-shadow-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 text-sm font-semibold text-[var(--color-foreground)] shadow-sm transition-all hover:border-[var(--color-primary)]/40 hover:shadow-md"
          >
            View Full Gallery
            <ArrowRight className="h-4 w-4 text-[var(--color-primary)]" />
          </Link>
        </div>
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────── */}
      {lightbox !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <div
            className="relative flex max-h-full max-w-5xl w-full flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative max-h-[80vh] overflow-hidden rounded-2xl">
              <Image
                src={images[lightbox].src}
                alt={images[lightbox].alt}
                width={images[lightbox].w}
                height={images[lightbox].h}
                className="max-h-[80vh] w-full object-contain"
              />
            </div>

            {/* Caption */}
            <p className="mt-3 text-center text-sm text-white/60">
              {lightbox + 1} / {images.length} — {images[lightbox].alt}
            </p>

            {/* Controls */}
            <button
              ref={closeRef}
              onClick={closeLightbox}
              aria-label="Close lightbox"
              className="absolute -right-2 -top-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <button
              onClick={() => setLightbox((i) => ((i ?? 0) - 1 + images.length) % images.length)}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/25 md:-left-5"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={() => setLightbox((i) => ((i ?? 0) + 1) % images.length)}
              aria-label="Next image"
              className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/25 md:-right-5"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
