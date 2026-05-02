"use client";

import { useRef, useEffect, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "framer-motion";

export interface CounterRevealProps {
  value: number;
  format?: (n: number) => string;
  duration?: number;
  start?: string;
  className?: string;
  style?: CSSProperties;
  prefix?: string;
  suffix?: string;
}

export function CounterReveal({
  value,
  format = (n) =>
    Number.isInteger(value) ? String(Math.round(n)) : n.toFixed(1),
  duration = 2,
  start = "top 88%",
  className = "",
  style,
  prefix = "",
  suffix = "",
}: CounterRevealProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const el = numRef.current;
    const wrap = wrapRef.current;
    if (!el || !wrap) return;

    if (prefersReduced) {
      el.textContent = format(value);
      return;
    }

    const obj = { n: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        n: value,
        duration,
        ease: "power2.out",
        scrollTrigger: {
          trigger: wrap,
          start,
          once: true,
        },
        onUpdate: () => {
          el.textContent = format(obj.n);
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, [value, duration, start, format, prefersReduced]);

  return (
    <span ref={wrapRef} className={className} style={style} aria-live="polite">
      {prefix}
      <span ref={numRef}>0</span>
      {suffix}
    </span>
  );
}
