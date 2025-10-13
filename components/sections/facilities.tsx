"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionReveal } from "@/components/motion/section-reveal";
import { FACILITIES } from "@/data/content";
import { FacilityCard } from "@/components/ui2/facility-card";

// Embla-based carousel primitives in your repo
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function FacilitiesSection() {
  const [api, setApi] = useState<any>(null);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      const i = api.selectedScrollSnap?.() ?? 0;
      setSelected(typeof i === "number" ? i : 0);
    };
    api.on?.("select", onSelect);
    onSelect();
    return () => api.off?.("select", onSelect);
  }, [api]);

  return (
    <SectionReveal>
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <header className="mb-8 sm:mb-10 md:mb-12">
            <p className="text-sm sm:text-base font-medium text-primary">
              Best Choice
            </p>
            <div className="mt-2 flex items-end gap-2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                Villa Facilities
              </h2>
              <span
                aria-hidden
                className="mb-2 inline-block h-2 w-2 rounded-full bg-amber-500"
              />
            </div>
            <p className="mt-3 max-w-2xl text-foreground/70">
              Swipe on mobile or use the arrows to browse. Smooth, responsive,
              and fully theme-aware.
            </p>
          </header>

          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{ align: "start", loop: true }}
          >
            {/* Gutters without page overflow */}
            <CarouselContent className="-ml-2 p-2 sm:-ml-3">
              {FACILITIES.map((f) => (
                <CarouselItem
                  key={f.id}
                  className="
                  pl-2 sm:pl-3
                  basis-full          /* 1 on small */
                  md:basis-1/2        /* 2 on medium */
                  lg:basis-1/3        /* 3 on large and up */
                "
                >
                  <div className="h-full">
                    <FacilityCard
                      title={f.title}
                      description={f.description}
                      image={f.image}
                      alt={f.alt}
                      badge={f.badge}
                      className="
                      h-full
                      sm:min-h-[22rem]
                      md:min-h-[24rem]
                      lg:min-h-[26rem]
                    "
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Controls (kept inside container - no overflow) */}
            <CarouselPrevious
              aria-label="Previous facilities"
              className="
              left-2 md:left-3
              bg-card/90 backdrop-blur
              ring-1 ring-border hover:bg-card
              text-foreground shadow-sm
            "
            >
              <ChevronLeft className="h-5 w-5" />
            </CarouselPrevious>
            <CarouselNext
              aria-label="Next facilities"
              className="
              right-2 md:right-3
              bg-card/90 backdrop-blur
              ring-1 ring-border hover:bg-card
              text-foreground shadow-sm
            "
            >
              <ChevronRight className="h-5 w-5" />
            </CarouselNext>
          </Carousel>

          {/* SR-only status for a11y */}
          <p className="sr-only" aria-live="polite">
            Slide {selected + 1} of {FACILITIES.length}
          </p>

          {/* <hr className="mt-10 md:mt-12 h-px w-full bg-border/70" /> */}
        </div>
      </section>
    </SectionReveal>
  );
}
