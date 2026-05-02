"use client";

import { useRef, useMemo } from "react";
import { useGSAP } from "@/lib/gsap";
import { gsap, ScrollTrigger, EASE, DURATION } from "@/lib/gsap";
import {
  SunMedium, Wifi, Utensils, BedDouble, Waves,
  MapPin, Sparkles, Wind, ShieldCheck, Plane,
} from "lucide-react";
import { HIGHLIGHTS as RAW_HIGHLIGHTS } from "@/data/content";

type Item =
  | string
  | { title: string; description?: string; icon?: React.ComponentType<{ className?: string }> };

const DEFAULT_DESCRIPTIONS = [
  "Panoramic lagoon vistas — mornings start brighter here.",
  "A/C bedrooms with plush, hotel-grade bedding.",
  "Lightning-fast Wi-Fi for work or stream under the palms.",
  "Private chef on request — Sri Lankan flavors, zero hassle.",
  "24/7 support for transfers, directions, and local tips.",
  "Secure, on-site parking included at no extra charge.",
  "Easy access to beaches, markets, and hidden coves.",
  "Daily housekeeping — you relax, we handle the rest.",
  "Swim, paddle or drift: the lagoon is your backyard.",
  "Privacy, safety, serenity — engineered into the stay.",
];

const DEFAULT_ICONS = [
  SunMedium, BedDouble, Wifi, Utensils, Plane, MapPin, Wind, Sparkles, Waves, ShieldCheck,
];

function normalize(items: Item[]) {
  return items.map((it, i) =>
    typeof it === "string"
      ? { title: it, description: DEFAULT_DESCRIPTIONS[i % DEFAULT_DESCRIPTIONS.length], icon: DEFAULT_ICONS[i % DEFAULT_ICONS.length] }
      : { title: it.title, description: it.description ?? DEFAULT_DESCRIPTIONS[i % DEFAULT_DESCRIPTIONS.length], icon: it.icon ?? DEFAULT_ICONS[i % DEFAULT_ICONS.length] }
  );
}

export function Highlights() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const HIGHLIGHTS = useMemo(() => normalize([...RAW_HIGHLIGHTS] as Item[]), []);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      // Section heading — split reveal
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: DURATION.reveal, ease: EASE.premium,
          scrollTrigger: { trigger: headingRef.current, start: "top 85%", once: true },
        }
      );

      // Cards — batched ScrollTriggers (fewer callbacks, smoother with large grids)
      const cards = gridRef.current?.querySelectorAll<HTMLElement>("[data-card]");
      if (!cards?.length) return;

      const mm = gsap.matchMedia();

      mm.add("(max-width: 767px)", () => {
        ScrollTrigger.batch(cards, {
          batchMax: 4,
          interval: 0.05,
          once: true,
          start: "top 88%",
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { opacity: 0, y: 36, rotateX: 4, transformOrigin: "top center" },
              {
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 0.65,
                stagger: 0.06,
                ease: EASE.out,
                overwrite: true,
              }
            );
          },
        });
      });

      mm.add("(min-width: 768px)", () => {
        ScrollTrigger.batch(cards, {
          batchMax: 4,
          interval: 0.06,
          once: true,
          start: "top 82%",
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { opacity: 0, y: 60, rotateX: 6, transformOrigin: "top center" },
              {
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 0.75,
                stagger: 0.08,
                ease: EASE.out,
                overwrite: true,
              }
            );
          },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="highlights"
      aria-labelledby="highlights-heading"
      className="relative overflow-hidden py-24 md:py-32"
    >
      {/* Ambient glow top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-96"
        style={{
          background:
            "radial-gradient(70% 50% at 50% 0%, rgba(14,165,233,.10) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        {/* Section header */}
        <div ref={headingRef} className="mx-auto mb-16 max-w-2xl text-center md:mb-20">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
            Why Choose Us
          </p>
          <h2
            id="highlights-heading"
            className="font-[var(--font-display)] text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-tight tracking-tight text-[var(--color-foreground)]"
          >
            Everything for the{" "}
            <span className="bg-gradient-to-r from-[#0ea5e9] to-[#22d3ee] bg-clip-text text-transparent">
              perfect stay
            </span>
          </h2>
          <p className="mt-4 text-base text-[var(--color-muted)] md:text-lg">
            Thoughtfully designed amenities and services to make your lagoon
            retreat unforgettable.
          </p>
        </div>

        {/* Card grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          style={{ perspective: "1200px" }}
        >
          {HIGHLIGHTS.map(({ title, description, icon: Icon }, idx) => (
            <article
              key={`${title}-${idx}`}
              data-card
              tabIndex={0}
              aria-label={`Amenity: ${title}`}
              className="group relative cursor-default overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--color-primary)]/30 hover:shadow-[0_16px_48px_rgba(14,165,233,.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/60"
            >
              {/* Hover glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(220px 160px at 50% 0%, rgba(14,165,233,.08), transparent 70%)",
                }}
              />

              {/* Icon */}
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#22d3ee] shadow-md shadow-[#0ea5e9]/30">
                {Icon ? (
                  <Icon className="h-5 w-5 text-white" />
                ) : (
                  <Sparkles className="h-5 w-5 text-white" />
                )}
              </div>

              <h3 className="mb-2 text-[15px] font-semibold text-[var(--color-foreground)] transition-colors group-hover:text-[var(--color-primary)]">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                {description}
              </p>

              {/* Bottom shimmer line */}
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#22d3ee] transition-transform duration-500 group-hover:scale-x-100"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
