"use client";

import { useRef, useEffect, type CSSProperties, type ElementType } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "framer-motion";

export type SplitTextRevealVariant = "words" | "chars" | "lines";

export interface SplitTextRevealProps {
  text: string;
  variant?: SplitTextRevealVariant;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  duration?: number;
  stagger?: number;
  start?: string;
  className?: string;
  style?: CSSProperties;
  /** Stronger motion on desktop; toned down on small screens via matchMedia */
  intensity?: "subtle" | "kinetic";
}

export function SplitTextReveal({
  text,
  variant = "words",
  as: Tag = "p",
  duration = 0.6,
  stagger = 0.04,
  start = "top 80%",
  className = "",
  style,
  intensity = "kinetic",
}: SplitTextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  const parts =
    variant === "chars"
      ? text.split("")
      : variant === "lines"
        ? text.split("\n")
        : text.split(/\s+/);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReduced) return;

    const elements = container.querySelectorAll("[data-reveal-part]");
    const mm = gsap.matchMedia();

    mm.add(
      {
        mobile: "(max-width: 767px)",
        desktop: "(min-width: 768px)",
      },
      (ctx) => {
        const mobile = !!ctx.conditions?.mobile;
        const kinetic = intensity === "kinetic";
        const yFrom = mobile ? (kinetic ? 10 : 8) : kinetic ? 18 : 12;
        const rotFrom = mobile ? (kinetic ? 8 : 6) : kinetic ? 22 : 14;
        const blurFrom = mobile ? (kinetic ? 2 : 1.5) : kinetic ? 5 : 3;

        const tweenCtx = gsap.context(() => {
          gsap.fromTo(
            elements,
            {
              opacity: 0,
              y: yFrom,
              rotateX: rotFrom,
              filter: `blur(${blurFrom}px)`,
            },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              filter: "blur(0px)",
              duration: mobile ? duration * 0.92 : duration,
              stagger: mobile ? stagger * 0.75 : stagger,
              ease: "power3.out",
              scrollTrigger: {
                trigger: container,
                start,
                once: true,
              },
            },
          );
        }, container);

        return () => tweenCtx.revert();
      },
    );

    return () => mm.revert();
  }, [text, variant, duration, stagger, start, prefersReduced, intensity]);

  const Component = Tag as ElementType;

  return (
    <Component
      ref={containerRef}
      className={className}
      style={{ perspective: "800px", ...style }}
      aria-label={text}
    >
      {parts.map((part, i) => (
        <span
          key={`${part}-${i}`}
          data-reveal-part
          className="inline-block"
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform, opacity, filter",
          }}
          aria-hidden="true"
        >
          {variant === "words" ? (
            <>
              {part}
              {i < parts.length - 1 && "\u00A0"}
            </>
          ) : variant === "chars" ? (
            part === " " ? "\u00A0" : part
          ) : (
            part
          )}
        </span>
      ))}
    </Component>
  );
}
