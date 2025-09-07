"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HIGHLIGHTS } from "@/data/content";

gsap.registerPlugin(ScrollTrigger);

export function Highlights() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const saveData = useMemo(
    () =>
      typeof navigator !== "undefined" && "connection" in navigator
        ? // @ts-ignore
          Boolean(navigator.connection?.saveData)
        : false,
    []
  );
  const allowMotion = !prefersReducedMotion && !saveData;

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const grid = gridRef.current;
    if (!section || !header || !grid) return;

    // compositor hints
    section.style.willChange = "opacity, transform";
    header.style.willChange = "opacity, transform";
    grid.style.willChange = "opacity, transform";

    // Bind section's reveal to the hero's published CSS variables.
    // Opacity = inverse of hero-xfade. Y = 30px → 0px along hero-progress.
    section.style.opacity = "calc(1 - var(--hero-xfade, 1))";
    section.style.transform =
      "translateY(calc(30px * (1 - var(--hero-progress, 0))))";

    if (!allowMotion) {
      // fall back to static render
      section.style.opacity = "1";
      section.style.transform = "none";
      header.style.opacity = "1";
      grid.style.opacity = "1";
      return;
    }

    // One-time header lift (non-scrub) for premium feel
    const ctx = gsap.context(() => {
      gsap.fromTo(
        header,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            once: true,
          },
        }
      );

      // Stagger cards once; scrubbing already happens at section level via CSS vars
      const cards = Array.from(
        grid.querySelectorAll<HTMLDivElement>("[data-card]")
      );
      gsap.fromTo(
        cards,
        { opacity: 0, y: 22, rotateX: 6 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: grid,
            start: "top 78%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [allowMotion]);

  return (
    <section
      id="highlights"
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-b from-white to-gray-50"
      aria-labelledby="highlights-heading"
    >
      <div className="container mx-auto px-4">
        <div ref={headerRef} className="text-center mb-16">
          <h2
            id="highlights-heading"
            className="text-4xl md:text-5xl font-bold mb-6 text-balance"
          >
            Everything you need for the perfect stay
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto text-pretty">
            Thoughtfully designed amenities and services to make your lagoon
            retreat unforgettable.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {HIGHLIGHTS.map((label) => (
            <motion.article
              key={label}
              data-card
              tabIndex={0}
              aria-label={`Highlight: ${label}`}
              className="group relative bg-white rounded-2xl p-8 shadow-lg ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-2 focus-within:-translate-y-2"
              whileHover={{ rotateX: -3 }}
              style={{
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
              }}
            >
              {/* glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "radial-gradient(60% 60% at 50% 12%, rgba(14,165,233,0.16), transparent 70%)",
                }}
              />
              {/* icon seed */}
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl mb-4 flex items-center justify-center shadow-md">
                  <div className="w-6 h-6 bg-white/95 rounded-md" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                  {label}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Experience the comfort and convenience of our carefully
                  curated amenities.
                </p>
              </div>
              {/* shine sweep */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
              >
                <span
                  className="absolute -inset-x-1 -top-1 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
                    filter: "blur(2px)",
                    animation: "cardShine 2s ease-in-out infinite",
                  }}
                />
              </span>
            </motion.article>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes cardShine {
          0% {
            transform: translateX(-20%);
          }
          100% {
            transform: translateX(120%);
          }
        }
      `}</style>
    </section>
  );
}
