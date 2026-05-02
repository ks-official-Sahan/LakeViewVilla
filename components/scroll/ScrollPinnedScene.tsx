"use client";

import {
  useRef,
  useEffect,
  type ReactNode,
  type CSSProperties,
  type ComponentPropsWithoutRef,
} from "react";
import { gsap } from "@/lib/gsap";

export type ScrollPinnedSceneProps = {
  children: ReactNode;
  end?: string;
  scrub?: number | boolean;
  className?: string;
  style?: CSSProperties;
} & Omit<ComponentPropsWithoutRef<"section">, "children">;

/**
 * Pins this section while the user scrolls through `end` distance.
 * Compose inner motion with separate `useGSAP` / GSAP timelines scoped to children.
 */
export function ScrollPinnedScene({
  children,
  end = "+=100%",
  scrub = 0.55,
  className = "",
  style,
  ...sectionProps
}: ScrollPinnedSceneProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end,
          pin: true,
          scrub,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [end, scrub]);

  return (
    <section
      ref={sectionRef}
      className={`relative min-h-[min(100dvh,920px)] ${className}`}
      style={style}
      {...sectionProps}
    >
      {children}
    </section>
  );
}
