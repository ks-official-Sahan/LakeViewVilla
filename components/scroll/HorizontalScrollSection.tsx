"use client";

import { useRef, useEffect, type ReactNode, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "framer-motion";

interface HorizontalScrollSectionProps {
  children: ReactNode;
  /** Additional className for the outer container */
  className?: string;
  /** Additional inline style */
  style?: CSSProperties;
  /** Show progress bar. Default: true */
  showProgress?: boolean;
  /** Snap to child items. Default: false */
  snap?: boolean;
}

export function HorizontalScrollSection({
  children,
  className = "",
  style,
  showProgress = true,
  snap = false,
}: HorizontalScrollSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const scrollWidth = track.scrollWidth;
    const viewportWidth = window.innerWidth;
    const distance = scrollWidth - viewportWidth;

    if (prefersReduced || distance <= 0) return;

    const mm = gsap.matchMedia();

    mm.add("(max-width: 767px)", () => {
      /* Native horizontal scroll on small viewports — avoid pin + scrub cost */
      return () => {};
    });

    mm.add("(min-width: 768px)", () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance}`,
            pin: true,
            scrub: 0.5,
            snap: snap
              ? {
                  snapTo: 1 / (track.children.length - 1),
                  duration: { min: 0.2, max: 0.5 },
                  ease: "power2.inOut",
                }
              : undefined,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        tl.to(track, {
          x: -distance,
          ease: "none",
        });

        if (progressRef.current) {
          tl.to(progressRef.current, { scaleX: 1, ease: "none" }, 0);
        }
      }, section);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [snap, prefersReduced]);

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-x-auto overflow-y-hidden md:overflow-x-hidden md:overflow-hidden ${className}`}
      style={style}
      aria-label="Horizontal scroll section"
    >
      {/* Progress bar — desktop pinned scroll only (hidden when overflow-x-auto on mobile) */}
      {showProgress && (
        <div
          className="absolute top-0 left-0 right-0 z-10 hidden h-[2px] bg-border/20 md:block"
          aria-hidden="true"
        >
          <div
            ref={progressRef}
            className="h-full origin-left bg-linear-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      )}

      <div
        ref={trackRef}
        className="flex w-max min-w-full items-stretch gap-0 will-change-transform md:w-max"
      >
        {children}
      </div>
    </section>
  );
}
