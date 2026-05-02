"use client";

import React, { useRef, useEffect, type ReactNode, type CSSProperties } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "framer-motion";

interface ParallaxSectionProps {
  children: ReactNode;
  /** Parallax speed: -1 to 1. Negative = slower, positive = faster. Default: 0.3 */
  speed?: number;
  /** Additional className */
  className?: string;
  /** Additional inline style */
  style?: CSSProperties;
  /** HTML tag to render. Default: "div" */
  as?: React.ElementType;
  /** Parallax axis. Default: "y" */
  axis?: "x" | "y";
}

export function ParallaxSection({
  children,
  speed = 0.3,
  className = "",
  style,
  as: Tag = "div",
  axis = "y",
}: ParallaxSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced) return;

    const distance = speed * 100; // Convert to px-equivalent %

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { [axis]: -distance },
        {
          [axis]: distance,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5, // Smooth scrub
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [speed, axis, prefersReduced]);

  const Component = Tag as any;

  return (
    <Component
      ref={ref}
      className={`will-change-transform ${className}`}
      style={style}
    >
      {children}
    </Component>
  );
}

// ─── Image Parallax (optimized for background images) ───────────────────────

interface ParallaxImageProps {
  src: string;
  alt: string;
  /** Parallax speed. Default: 0.2 */
  speed?: number;
  /** Additional className for the container */
  className?: string;
  /** Overlay gradient. Default: none */
  overlay?: string;
}

export function ParallaxImage({
  src,
  alt,
  speed = 0.2,
  className = "",
  overlay,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image || prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        image,
        { yPercent: -speed * 20 },
        {
          yPercent: speed * 20,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.3,
          },
        },
      );
    }, container);

    return () => ctx.revert();
  }, [speed, prefersReduced]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      aria-label={alt}
      role="img"
    >
      <div
        ref={imageRef}
        className="absolute inset-[-10%] bg-cover bg-center will-change-transform"
        style={{ backgroundImage: `url(${src})` }}
      />
      {overlay && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: overlay }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
