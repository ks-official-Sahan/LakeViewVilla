"use client";

import React, {
  useRef,
  useEffect,
  type ReactNode,
  type CSSProperties,
} from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "framer-motion";

type RevealVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "scale-up"
  | "scale-down"
  | "clip-up"
  | "clip-down"
  | "clip-left"
  | "clip-right"
  | "rotate-in"
  | "blur-in";

interface RevealOnScrollProps {
  children: ReactNode;
  variant?: RevealVariant;
  /** Duration in seconds. Default: 0.8 */
  duration?: number;
  /** Delay in seconds. Default: 0 */
  delay?: number;
  /** Stagger children by this amount in seconds. Default: 0 (no stagger) */
  stagger?: number;
  /** CSS selector for stagger targets. Default: "> *" (direct children) */
  staggerSelector?: string;
  /** ScrollTrigger start position. Default: "top 85%" */
  start?: string;
  /** Animate only once. Default: true */
  once?: boolean;
  /** Additional className */
  className?: string;
  /** Additional inline style */
  style?: CSSProperties;
  /** HTML tag to render. Default: "div" */
  as?: React.ElementType;
}

const VARIANT_FROM: Record<RevealVariant, gsap.TweenVars> = {
  "fade-up": { opacity: 0, y: 40 },
  "fade-down": { opacity: 0, y: -40 },
  "fade-left": { opacity: 0, x: -40 },
  "fade-right": { opacity: 0, x: 40 },
  "scale-up": { opacity: 0, scale: 0.85 },
  "scale-down": { opacity: 0, scale: 1.15 },
  "clip-up": { opacity: 0, clipPath: "inset(100% 0% 0% 0%)" },
  "clip-down": { opacity: 0, clipPath: "inset(0% 0% 100% 0%)" },
  "clip-left": { opacity: 0, clipPath: "inset(0% 100% 0% 0%)" },
  "clip-right": { opacity: 0, clipPath: "inset(0% 0% 0% 100%)" },
  "rotate-in": { opacity: 0, rotateX: 15, y: 30 },
  "blur-in": { opacity: 0, filter: "blur(12px)", y: 20 },
};

const VARIANT_TO: Record<RevealVariant, gsap.TweenVars> = {
  "fade-up": { opacity: 1, y: 0 },
  "fade-down": { opacity: 1, y: 0 },
  "fade-left": { opacity: 1, x: 0 },
  "fade-right": { opacity: 1, x: 0 },
  "scale-up": { opacity: 1, scale: 1 },
  "scale-down": { opacity: 1, scale: 1 },
  "clip-up": { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" },
  "clip-down": { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" },
  "clip-left": { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" },
  "clip-right": { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" },
  "rotate-in": { opacity: 1, rotateX: 0, y: 0 },
  "blur-in": { opacity: 1, filter: "blur(0px)", y: 0 },
};

function scaleFromVars(
  from: gsap.TweenVars,
  factor: number,
): gsap.TweenVars {
  const next = { ...from };
  if (typeof next.y === "number") next.y = Math.round(next.y * factor);
  if (typeof next.x === "number") next.x = Math.round(next.x * factor);
  if (typeof next.rotateX === "number")
    next.rotateX = Math.round(next.rotateX * factor);
  return next;
}

export function RevealOnScroll({
  children,
  variant = "fade-up",
  duration = 0.8,
  delay = 0,
  stagger = 0,
  staggerSelector = "> *",
  start = "top 85%",
  once = true,
  className = "",
  style,
  as: Tag = "div",
}: RevealOnScrollProps) {
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced) return;

    const mm = gsap.matchMedia();

    const run = (motionScale: number, staggerFactor: number) => {
      const targets =
        stagger > 0 ? el.querySelectorAll(staggerSelector) : el;
      const from = scaleFromVars(VARIANT_FROM[variant], motionScale);
      const to = {
        ...VARIANT_TO[variant],
        duration,
        delay,
        ease: "power3.out",
        stagger:
          stagger > 0 ? stagger * staggerFactor : undefined,
        scrollTrigger: {
          trigger: el,
          start,
          once,
          toggleActions: once ? "play none none none" : "play reverse play reverse",
        },
      };

      const ctx = gsap.context(() => {
        gsap.fromTo(targets, from, to);
      }, el);
      return () => ctx.revert();
    };

    mm.add(
      {
        mobile: "(max-width: 767px)",
        desktop: "(min-width: 768px)",
      },
      (ctx) => {
        const mobile = !!ctx.conditions?.mobile;
        const cleanup = run(mobile ? 0.55 : 1, mobile ? 0.65 : 1);
        return () => cleanup?.();
      },
    );

    return () => mm.revert();
  }, [
    variant,
    duration,
    delay,
    stagger,
    staggerSelector,
    start,
    once,
    prefersReduced,
  ]);

  const Component = Tag as any;

  return (
    <Component
      ref={ref}
      className={className}
      style={{ willChange: "transform, opacity", ...style }}
    >
      {children}
    </Component>
  );
}
