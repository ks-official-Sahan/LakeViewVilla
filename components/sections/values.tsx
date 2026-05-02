"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@/lib/gsap";
import { gsap, ScrollTrigger, EASE, DURATION } from "@/lib/gsap";
import {
  Car, Waves, Utensils, Wind, Trees, ShowerHead, CheckCircle2,
} from "lucide-react";
import { VALUES_ITEMS } from "@/data/content";

const iconMap = {
  car: Car,
  waves: Waves,
  utensils: Utensils,
  wind: Wind,
  trees: Trees,
  shower: ShowerHead,
} as const;

const NEARBY = [
  "Goyambokka Beach — less than 1 km",
  "Hummanaya Blow Hole — 10 km",
  "Free WiFi · Air Conditioning · Free Parking",
];

export function ValuesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      // Image slides in from left
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: -60 },
        {
          opacity: 1, x: 0, duration: DURATION.reveal, ease: EASE.premium,
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true },
        }
      );

      // Copy fades up
      gsap.fromTo(
        copyRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: DURATION.reveal, ease: EASE.premium, delay: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true },
        }
      );

      let revertList: (() => void) | undefined;
      const items = listRef.current?.querySelectorAll<HTMLElement>("[data-value-item]");
      if (items?.length) {
        const mm = gsap.matchMedia();
        revertList = () => mm.revert();
        mm.add("(max-width: 767px)", () => {
          ScrollTrigger.batch(items, {
            batchMax: 3,
            interval: 0.05,
            once: true,
            start: "top 88%",
            onEnter: (batch) => {
              gsap.fromTo(
                batch,
                { opacity: 0, x: 16 },
                {
                  opacity: 1,
                  x: 0,
                  duration: 0.48,
                  stagger: 0.06,
                  ease: EASE.out,
                  overwrite: true,
                }
              );
            },
          });
        });
        mm.add("(min-width: 768px)", () => {
          ScrollTrigger.batch(items, {
            batchMax: 3,
            interval: 0.07,
            once: true,
            start: "top 84%",
            onEnter: (batch) => {
              gsap.fromTo(
                batch,
                { opacity: 0, x: 24 },
                {
                  opacity: 1,
                  x: 0,
                  duration: 0.55,
                  stagger: 0.09,
                  ease: EASE.out,
                  overwrite: true,
                }
              );
            },
          });
        });
      }

      return () => revertList?.();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="values-heading"
      className="relative overflow-hidden py-24 md:py-32"
    >
      {/* Ambient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 40% at 0% 60%, rgba(14,165,233,.07), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — hero image with floating badge */}
          <div ref={imageRef} className="relative">
            <div className="relative overflow-hidden rounded-[2rem] shadow-2xl">
              {/* Arch-style image */}
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src="/villa/optimized/with_guests_02.webp"
                  alt="Guests relaxing in the garden with lake view"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Gradient overlay at bottom */}
                <div
                  className="absolute inset-x-0 bottom-0 h-1/3"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(4,12,18,.65), transparent)",
                  }}
                />
              </div>
            </div>

            {/* Floating stat badge */}
            <div className="absolute -right-4 -top-4 flex h-20 w-20 flex-col items-center justify-center rounded-full border-4 border-[var(--color-surface)] bg-gradient-to-br from-[#0ea5e9] to-[#22d3ee] text-white shadow-xl md:-right-6 md:-top-6 md:h-24 md:w-24">
              <span className="text-lg font-black leading-none md:text-xl">4.9</span>
              <span className="text-[9px] font-semibold uppercase tracking-wide opacity-90">
                Rating
              </span>
            </div>

            {/* Floating badge bottom */}
            <div className="absolute -bottom-4 left-6 flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-lg md:-bottom-5 md:left-8">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#34d399] to-[#22d3ee]">
                <CheckCircle2 className="h-4.5 w-4.5 text-white" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-[var(--color-foreground)]">Verified Host</p>
                <p className="text-[var(--color-muted)]">Airbnb &amp; Booking.com</p>
              </div>
            </div>
          </div>

          {/* Right — copy */}
          <div ref={copyRef}>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
              Our Values
            </p>
            <h2
              id="values-heading"
              className="font-[var(--font-display)] text-[clamp(1.9rem,4vw,3rem)] font-extrabold leading-tight tracking-tight text-[var(--color-foreground)]"
            >
              The value we{" "}
              <span className="bg-gradient-to-r from-[#0ea5e9] to-[#22d3ee] bg-clip-text text-transparent">
                provide to you
              </span>
            </h2>

            {/* Highlights */}
            <ul className="mt-5 space-y-2">
              {NEARBY.map((item, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-[var(--color-muted)]">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
                  {item}
                </li>
              ))}
            </ul>

            {/* Value list */}
            <ul ref={listRef} className="mt-8 space-y-3">
              {VALUES_ITEMS.map((item) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap] ?? Car;
                return (
                  <li
                    key={item.id}
                    data-value-item
                    className="group flex items-start gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-all duration-200 hover:border-[var(--color-primary)]/30 hover:shadow-[0_4px_20px_rgba(14,165,233,.08)]"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-cyan-100 text-[var(--color-primary)] ring-1 ring-sky-200 dark:from-sky-900/30 dark:to-cyan-900/30 dark:ring-sky-800/50">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <h3 className="text-[15px] font-semibold text-[var(--color-foreground)]">
                        {item.title}
                      </h3>
                      <p className="mt-0.5 text-sm text-[var(--color-muted)]">{item.body}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
