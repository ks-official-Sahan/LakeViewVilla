"use client";

import { useRef, createElement, type ReactNode, type CSSProperties, type ElementType } from "react";
import { useGSAP } from "@/lib/gsap";
import { gsap, ScrollTrigger, EASE, DURATION } from "@/lib/gsap";

type RevealVariant =
  | "fade-up"
  | "fade-in"
  | "slide-left"
  | "slide-right"
  | "scale"
  | "blur-in";

interface ScrollRevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  /** Delay in seconds before animation starts */
  delay?: number;
  /** Duration override */
  duration?: number;
  /** Stagger children by this amount (seconds) */
  stagger?: number;
  /** ScrollTrigger start position */
  start?: string;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: CSSProperties;
  /** Whether to animate only once or every time entering viewport */
  once?: boolean;
  /** HTML tag to render as */
  as?: ElementType;
}

const VARIANT_FROM: Record<RevealVariant, gsap.TweenVars> = {
  "fade-up": { opacity: 0, y: 60 },
  "fade-in": { opacity: 0 },
  "slide-left": { opacity: 0, x: -80 },
  "slide-right": { opacity: 0, x: 80 },
  scale: { opacity: 0, scale: 0.85 },
  "blur-in": { opacity: 0, filter: "blur(12px)" },
};

const VARIANT_TO: Record<RevealVariant, gsap.TweenVars> = {
  "fade-up": { opacity: 1, y: 0 },
  "fade-in": { opacity: 1 },
  "slide-left": { opacity: 1, x: 0 },
  "slide-right": { opacity: 1, x: 0 },
  scale: { opacity: 1, scale: 1 },
  "blur-in": { opacity: 1, filter: "blur(0px)" },
};

export function ScrollReveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration,
  stagger = 0,
  start = "top 85%",
  className,
  style,
  once = true,
  as: Tag = "div",
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        // Immediately show content without animation
        gsap.set(containerRef.current, { opacity: 1 });
        return;
      }

      const targets =
        stagger > 0
          ? containerRef.current.children
          : containerRef.current;

      gsap.fromTo(targets, VARIANT_FROM[variant], {
        ...VARIANT_TO[variant],
        duration: duration ?? DURATION.reveal,
        delay,
        ease: EASE.premium,
        stagger: stagger > 0 ? { each: stagger, from: "start" } : undefined,
        scrollTrigger: {
          trigger: containerRef.current,
          start,
          toggleActions: once
            ? "play none none none"
            : "play reverse play reverse",
        },
      });
    },
    { scope: containerRef, dependencies: [variant, delay, stagger, once] }
  );

  return createElement(
    Tag,
    { ref: containerRef, className, style },
    children
  );
}
