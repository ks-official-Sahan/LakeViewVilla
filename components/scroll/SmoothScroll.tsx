"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Context ────────────────────────────────────────────────────────────────

interface SmoothScrollContextValue {
  lenis: Lenis | null;
  isReady: boolean;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenis: null,
  isReady: false,
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

// ─── Provider ───────────────────────────────────────────────────────────────

interface SmoothScrollProviderProps {
  children: ReactNode;
  /** Lerp factor (0-1). Lower = smoother/slower. Default: 0.1 */
  lerp?: number;
  /** Duration in seconds. Default: 1.2 */
  duration?: number;
  /** Disable on touch devices for native scroll feel */
  disableOnTouch?: boolean;
}

export function SmoothScrollProvider({
  children,
  lerp = 0.1,
  duration = 1.2,
  disableOnTouch = true,
}: SmoothScrollProviderProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [isReady, setIsReady] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Respect reduced motion preference
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      setIsReady(true);
      return;
    }

    // Detect touch device
    const isTouch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (disableOnTouch && isTouch) {
      setIsReady(true);
      return;
    }

    const lenisInstance = new Lenis({
      lerp,
      duration,
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    // Bridge Lenis with GSAP ScrollTrigger
    lenisInstance.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    setLenis(lenisInstance);
    setIsReady(true);

    return () => {
      lenisInstance.destroy();
      gsap.ticker.remove(lenisInstance.raf as any);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [lerp, duration, disableOnTouch]);

  return (
    <SmoothScrollContext.Provider value={{ lenis, isReady }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
