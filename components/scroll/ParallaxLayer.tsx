"use client";

import React, { useRef, useEffect, type ReactNode, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "framer-motion";

export interface ParallaxLayerProps {
  children: ReactNode;
  /**
   * Motion depth: scaled scrub distance (similar semantics to ParallaxSection `speed`).
   * Automatically halved on narrow screens when `mobileScale` is true.
   */
  depth?: number;
  axis?: "x" | "y";
  className?: string;
  style?: CSSProperties;
  as?: React.ElementType;
  /** When true (default), reduce parallax magnitude below `md` breakpoint */
  mobileScale?: boolean;
}

/**
 * Single composable layer for multi-plane parallax; pairs well inside a shared overflow anchor.
 */
export function ParallaxLayer({
  children,
  depth = 0.35,
  axis = "y",
  className = "",
  style,
  as: Tag = "div",
  mobileScale = true,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        narrow: "(max-width: 767px)",
        wide: "(min-width: 768px)",
      },
      (ctx) => {
        const narrow = !!ctx.conditions?.narrow;
        const scale = mobileScale && narrow ? 0.45 : 1;
        const distance = depth * 100 * scale;

        const tweenCtx = gsap.context(() => {
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
                scrub: 0.45,
              },
            },
          );
        }, el);

        return () => tweenCtx.revert();
      },
    );

    return () => mm.revert();
  }, [depth, axis, prefersReduced, mobileScale]);

  const Component = Tag as React.ElementType;

  return (
    <Component ref={ref} className={`will-change-transform ${className}`} style={style}>
      {children}
    </Component>
  );
}
