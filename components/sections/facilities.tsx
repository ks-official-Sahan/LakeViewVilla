"use client";

import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import { gsap, EASE, DURATION } from "@/lib/gsap";
import { FACILITIES } from "@/data/content";
import { FacilityCard } from "@/components/ui2/facility-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FacilitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0, duration: DURATION.reveal, ease: EASE.premium,
          scrollTrigger: { trigger: headingRef.current, start: "top 85%", once: true },
        }
      );

      gsap.fromTo(
        carouselRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: DURATION.reveal, ease: EASE.premium, delay: 0.2,
          scrollTrigger: { trigger: carouselRef.current, start: "top 88%", once: true },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="facilities-heading"
      className="relative overflow-hidden py-24 md:py-32"
    >
      {/* Ambient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-80"
        style={{
          background:
            "radial-gradient(60% 50% at 70% 0%, rgba(34,211,238,.08), transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        {/* Heading */}
        <div ref={headingRef} className="mb-10 md:mb-14">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
            Best Choice
          </p>
          <div className="flex items-end gap-2">
            <h2
              id="facilities-heading"
              className="font-[var(--font-display)] text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold tracking-tight text-[var(--color-foreground)]"
            >
              Villa Facilities
            </h2>
            <span aria-hidden className="mb-2.5 h-2 w-2 rounded-full bg-amber-400" />
          </div>
          <p className="mt-3 max-w-xl text-sm text-[var(--color-muted)] md:text-base">
            Swipe on mobile or use the arrows to browse every amenity.
          </p>
        </div>

        {/* Carousel */}
        <div ref={carouselRef}>
          <Carousel
            opts={{ align: "start", loop: true }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {FACILITIES.map((f) => (
                <CarouselItem
                  key={f.id}
                  className="pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <div className="h-full">
                    <FacilityCard
                      title={f.title}
                      description={f.description}
                      image={f.image}
                      alt={f.alt}
                      badge={f.badge}
                      className="h-full min-h-[22rem] md:min-h-[25rem]"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious
              aria-label="Previous facility"
              className="-left-3 bg-[var(--color-surface)]/90 backdrop-blur border border-[var(--color-border)] text-[var(--color-foreground)] shadow-md hover:bg-[var(--color-surface)] md:-left-5"
            >
              <ChevronLeft className="h-4 w-4" />
            </CarouselPrevious>
            <CarouselNext
              aria-label="Next facility"
              className="-right-3 bg-[var(--color-surface)]/90 backdrop-blur border border-[var(--color-border)] text-[var(--color-foreground)] shadow-md hover:bg-[var(--color-surface)] md:-right-5"
            >
              <ChevronRight className="h-4 w-4" />
            </CarouselNext>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
