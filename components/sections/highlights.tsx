"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  SunMedium,
  Wifi,
  Utensils,
  BedDouble,
  Waves,
  MapPin,
  Sparkles,
  Wind,
  ShieldCheck,
} from "lucide-react";
import { HIGHLIGHTS as RAW_HIGHLIGHTS } from "@/data/content";

gsap.registerPlugin(ScrollTrigger);

type Item =
  | string
  | {
      title: string;
      description?: string;
      icon?: React.ComponentType<{ className?: string }>;
    };

const DEFAULT_DESCRIPTIONS = [
  "Panoramic lagoon vistas—mornings start brighter here.",
  "Lightning-fast Wi-Fi for work or stream under the palms.",
  "Private chef on request—Sri Lankan flavors, zero hassle.",
  "A/C bedrooms with plush, hotel-grade bedding.",
  "Swim, paddle or drift: the lagoon is your backyard.",
  "Easy access to beaches, markets, and hidden coves.",
  "Daily housekeeping; you relax, we’ll handle the rest.",
  "24/7 support for transfers, directions, and local tips.",
  "Privacy, safety, serenity—engineered into the stay.",
];

const DEFAULT_ICONS = [
  SunMedium,
  Wifi,
  Utensils,
  BedDouble,
  Waves,
  MapPin,
  Sparkles,
  Wind,
  ShieldCheck,
];

function normalize(items: Item[]) {
  return items.map((it, i) =>
    typeof it === "string"
      ? {
          title: it,
          description: DEFAULT_DESCRIPTIONS[i % DEFAULT_DESCRIPTIONS.length],
          icon: DEFAULT_ICONS[i % DEFAULT_ICONS.length],
        }
      : {
          title: it.title,
          description:
            it.description ??
            DEFAULT_DESCRIPTIONS[i % DEFAULT_DESCRIPTIONS.length],
          icon: it.icon ?? DEFAULT_ICONS[i % DEFAULT_ICONS.length],
        }
  );
}

export function Highlights() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = useReducedMotion();
  const saveData = useMemo(
    () =>
      typeof navigator !== "undefined" &&
      Boolean((navigator as any).connection?.saveData),
    []
  );
  const allowMotion = !prefersReducedMotion && !saveData;

  const HIGHLIGHTS = useMemo(() => normalize(RAW_HIGHLIGHTS as Item[]), []);

  useEffect(() => {
    const section = sectionRef.current!;
    const header = headerRef.current!;
    const grid = gridRef.current!;
    if (!section || !header || !grid) return;

    section.style.willChange = "opacity, transform";
    header.style.willChange = "opacity, transform";
    grid.style.willChange = "opacity, transform";

    // Bind to hero CSS vars; if absent, render fully visible.
    const styles = getComputedStyle(document.documentElement);
    const hasVars =
      styles.getPropertyValue("--hero-progress") !== "" ||
      styles.getPropertyValue("--hero-xfade") !== "";

    if (hasVars) {
      section.style.opacity = "calc(1 - var(--hero-xfade, 1))";
      section.style.transform =
        "translateY(calc(28px * (1 - var(--hero-progress, 0))))";
    } else {
      section.style.opacity = "1";
      section.style.transform = "none";
    }

    if (!allowMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        header,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 80%", once: true },
        }
      );

      const cards = grid.querySelectorAll<HTMLElement>("[data-card]");
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
          scrollTrigger: { trigger: grid, start: "top 78%", once: true },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [allowMotion]);

  return (
    <section
      id="highlights"
      ref={sectionRef}
      className="relative py-28 md:py-32"
      aria-labelledby="highlights-heading"
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 0%, rgba(14,165,233,0.10), transparent 60%)",
          maskImage:
            "linear-gradient(to bottom, black 15%, rgba(0,0,0,0.75) 50%, transparent 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(0,0,0,0.03) 0 6px, transparent 6px 12px)",
        }}
      />

      <div className="container mx-auto px-4">
        <div ref={headerRef} className="relative text-center mb-16 md:mb-20">
          <h2
            id="highlights-heading"
            className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 text-balance"
            style={{ textShadow: "0 1px 0 rgba(255,255,255,0.4)" }}
          >
            Everything you need for the perfect stay
          </h2>
          <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto text-pretty">
            Thoughtfully designed amenities and services to make your lagoon
            retreat unforgettable.
          </p>
        </div>

        {/* ✅ FIXED: single-line className (no multiline string) */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 [--mx:50%] [--my:50%]"
        >
          {HIGHLIGHTS.map(({ title, description, icon: Icon }, idx) => (
            <motion.article
              key={`${title}-${idx}`}
              data-card
              tabIndex={0}
              aria-label={`Highlight: ${title}`}
              className="group relative rounded-2xl p-6 md:p-8 bg-white/70 backdrop-blur-xl shadow-[0_10px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-900/5 transition-transform duration-300 hover:-translate-y-2 focus-visible:-translate-y-2"
              style={{
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
                backgroundImage:
                  "radial-gradient(240px 160px at var(--mx) var(--my), rgba(56,189,248,0.10), transparent 60%)",
              }}
              whileHover={{ rotateX: -3 }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "radial-gradient(180px 140px at var(--mx) var(--my), rgba(14,165,233,0.18), transparent 70%)",
                }}
              />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl grid place-items-center mb-4 bg-gradient-to-br from-sky-500 to-cyan-500 shadow-md">
                  {Icon ? (
                    <Icon className="w-6 h-6 text-white" />
                  ) : (
                    <Sparkles className="w-6 h-6 text-white" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-sky-700 transition-colors">
                  {title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {description}
                </p>
              </div>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
              >
                <span
                  className="absolute -inset-x-2 -top-1 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)",
                    filter: "blur(1px)",
                    animation: "cardShine 1.8s ease-in-out infinite",
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
