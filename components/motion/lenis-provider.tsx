"use client";

import {
  ReactLenis,
  useLenis as useLenisFromReact,
} from "lenis/react";
import { useEffect, useState, type ReactNode } from "react";

/** Lenis instance from `ReactLenis` context (`undefined` outside provider / during SSR). */
export function useLenis() {
  return useLenisFromReact();
}

/**
 * Bridges Lenis `raf` to GSAP ticker + ScrollTrigger after the Lenis instance exists.
 * Must render inside `ReactLenis` so `useLenisFromReact()` returns the live instance.
 */
function LenisGsapBridge() {
  const lenis = useLenisFromReact();

  useEffect(() => {
    if (!lenis) return;

    let cancelled = false;
    let scrollCb: ((instance: import("lenis").default) => void) | undefined;
    let tick: ((time: number) => void) | undefined;

    void import("@/lib/gsap").then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;

      scrollCb = () => {
        ScrollTrigger.update();
      };
      lenis.on("scroll", scrollCb);

      tick = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    });

    return () => {
      cancelled = true;
      if (scrollCb) lenis.off("scroll", scrollCb);
      void import("@/lib/gsap").then(({ gsap }) => {
        if (tick) gsap.ticker.remove(tick);
      });
    };
  }, [lenis]);

  return null;
}

interface LenisProviderProps {
  children: ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 1.5,
        infinite: false,
        autoRaf: false,
      }}
    >
      <LenisGsapBridge />
      {children}
    </ReactLenis>
  );
}
