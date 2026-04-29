"use client";

import { useRef, useEffect, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

type TextRevealVariant = "words" | "chars" | "lines";

interface TextRevealProps {
  /** The text content to reveal */
  text: string;
  /** How to split text for animation. Default: "words" */
  variant?: TextRevealVariant;
  /** HTML tag. Default: "p" */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  /** Duration per element in seconds. Default: 0.6 */
  duration?: number;
  /** Stagger between elements in seconds. Default: 0.04 */
  stagger?: number;
  /** ScrollTrigger start. Default: "top 80%" */
  start?: string;
  /** Additional className */
  className?: string;
  /** Additional style */
  style?: CSSProperties;
}

export function TextReveal({
  text,
  variant = "words",
  as: Tag = "p",
  duration = 0.6,
  stagger = 0.04,
  start = "top 80%",
  className = "",
  style,
}: TextRevealProps) {
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

    const ctx = gsap.context(() => {
      gsap.fromTo(
        elements,
        {
          opacity: 0,
          y: 16,
          rotateX: 20,
          filter: "blur(4px)",
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          filter: "blur(0px)",
          duration,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container,
            start,
            once: true,
          },
        },
      );
    }, container);

    return () => ctx.revert();
  }, [text, variant, duration, stagger, start, prefersReduced]);

  const Component = Tag as any;

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
