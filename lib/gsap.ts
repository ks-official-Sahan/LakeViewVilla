/**
 * Centralized GSAP + ScrollTrigger + useGSAP registration.
 * Import from this file ONLY — never import gsap/ScrollTrigger directly
 * in components. This prevents re-registration on HMR and route transitions.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP, ScrollToPlugin);

  // Premium easing presets
  gsap.config({
    nullTargetWarn: false,
  });
}

export const EASE = {
  /** Smooth deceleration — elements settling into place */
  out: "power3.out",
  /** Smooth acceleration + deceleration */
  inOut: "power2.inOut",
  /** Buttery smooth — premium scroll-driven animations */
  premium: "power4.out",
  /** Elastic snap — playful micro-interactions */
  elastic: "elastic.out(1, 0.5)",
  /** Sharp entrance */
  expo: "expo.out",
} as const;

export const DURATION = {
  fast: 0.3,
  normal: 0.6,
  slow: 0.9,
  reveal: 1.2,
} as const;

export { gsap, ScrollTrigger, ScrollToPlugin, useGSAP };
