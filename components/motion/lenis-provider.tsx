"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import Lenis from "lenis";
// import { gsap, ScrollTrigger } from "@/lib/gsap"; // Removed static import to prevent SSR Date.now() evaluation

type LenisContextValue = Lenis | null;

const LenisContext = createContext<LenisContextValue>(null);

export function useLenis() {
  return useContext(LenisContext);
}

interface LenisProviderProps {
  children: ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
      infinite: false,
      autoRaf: false, // GSAP drives the RAF loop for perfect sync
    });

    lenisRef.current = lenis;
    
    let tickerCallback: ((time: number) => void) | null = null;
    let gsapInstance: any = null;

    // Dynamically import GSAP to prevent Next.js from evaluating Date.now() on the server
    import("@/lib/gsap").then(({ gsap, ScrollTrigger }) => {
      if (!lenisRef.current) return; // Component unmounted before load
      
      gsapInstance = gsap;
      
      // Sync Lenis scroll position with ScrollTrigger
      lenis.on("scroll", ScrollTrigger.update);

      // Drive Lenis from GSAP's ticker for frame-perfect sync
      tickerCallback = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tickerCallback);

      // Disable GSAP's built-in lagSmoothing so Lenis controls pacing
      gsap.ticker.lagSmoothing(0);
    }).catch(console.error);

    return () => {
      if (gsapInstance && tickerCallback) {
        gsapInstance.ticker.remove(tickerCallback);
      }
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
}
