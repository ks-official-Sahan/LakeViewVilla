"use client";

import {
  useRef,
  useEffect,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

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
  const [totalWidth, setTotalWidth] = useState(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Calculate total scrollable width
    const scrollWidth = track.scrollWidth;
    const viewportWidth = window.innerWidth;
    const distance = scrollWidth - viewportWidth;
    setTotalWidth(distance);

    if (prefersReduced || distance <= 0) return;

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

      // Animate progress bar
      if (progressRef.current) {
        tl.to(
          progressRef.current,
          { scaleX: 1, ease: "none" },
          0,
        );
      }
    }, section);

    return () => ctx.revert();
  }, [snap, prefersReduced]);

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden ${className}`}
      style={style}
      aria-label="Horizontal scroll section"
    >
      {/* Progress bar */}
      {showProgress && (
        <div
          className="absolute top-0 left-0 right-0 h-[2px] z-10 bg-border/20"
          aria-hidden="true"
        >
          <div
            ref={progressRef}
            className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      )}

      {/* Scrolling track */}
      <div
        ref={trackRef}
        className="flex items-stretch gap-0 will-change-transform"
        style={{ width: "max-content" }}
      >
        {children}
      </div>
    </section>
  );
}
