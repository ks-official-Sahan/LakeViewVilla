"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface InteractiveBackgroundProps {
  variant?: "gradient" | "parallax" | "webgl";
  className?: string;
}

export function InteractiveBackground({
  variant = "gradient",
  className = "",
}: InteractiveBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(pointer: coarse)");

    setPrefersReducedMotion(motionQuery.matches);
    setIsCoarsePointer(pointerQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    const handlePointerChange = (e: MediaQueryListEvent) =>
      setIsCoarsePointer(e.matches);

    motionQuery.addEventListener("change", handleMotionChange);
    pointerQuery.addEventListener("change", handlePointerChange);

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
      pointerQuery.removeEventListener("change", handlePointerChange);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    const gradient = gradientRef.current;

    if (!container) return;

    if (variant === "gradient" && gradient) {
      // Gradient morphing animation
      const tl = gsap.timeline({ repeat: -1, yoyo: true });

      tl.to(gradient, {
        background:
          "radial-gradient(circle at 30% 70%, rgba(6,182,212,0.15) 0%, rgba(14,165,233,0.1) 25%, rgba(59,130,246,0.05) 50%, transparent 80%)",
        duration: 8,
        ease: "power2.inOut",
      }).to(gradient, {
        background:
          "radial-gradient(circle at 70% 30%, rgba(14,165,233,0.15) 0%, rgba(59,130,246,0.1) 25%, rgba(6,182,212,0.05) 50%, transparent 80%)",
        duration: 8,
        ease: "power2.inOut",
      });

      // Mouse interaction
      const handleMouseMove = (e: MouseEvent) => {
        if (isCoarsePointer) return;

        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        const xPercent = (clientX / innerWidth) * 100;
        const yPercent = (clientY / innerHeight) * 100;

        gsap.to(gradient, {
          background: `radial-gradient(circle at ${xPercent}% ${yPercent}%, rgba(6,182,212,0.2) 0%, rgba(14,165,233,0.15) 25%, rgba(59,130,246,0.1) 50%, transparent 80%)`,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      container.addEventListener("mousemove", handleMouseMove);

      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        tl.kill();
      };
    }

    if (variant === "parallax") {
      // Parallax layers animation
      const layers = container.querySelectorAll("[data-parallax]");

      layers.forEach((layer, index) => {
        const speed = Number.parseFloat(
          layer.getAttribute("data-parallax") || "0.5"
        );

        gsap.to(layer, {
          yPercent: -50 * speed,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }
  }, [variant, prefersReducedMotion, isCoarsePointer]);

  if (variant === "webgl") {
    const webglEnabled = process.env.NEXT_PUBLIC_FEATURE_WEBGL_BG === "1";

    if (!webglEnabled || prefersReducedMotion || isCoarsePointer) {
      return (
        <div className={`fixed inset-0 -z-10 ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-lagoon-50 via-coastal-100 to-lagoon-100" />
        </div>
      );
    }

    return (
      <div ref={containerRef} className={`fixed inset-0 -z-10 ${className}`}>
        <canvas
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(14,165,233,0.05) 100%)",
          }}
        />
      </div>
    );
  }

  if (variant === "parallax") {
    return (
      <div
        ref={containerRef}
        className={`fixed inset-0 -z-10 overflow-hidden ${className}`}
      >
        <div
          data-parallax="0.3"
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('/villa/optimized/garden_img_01.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          data-parallax="0.5"
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url('/villa/optimized/garden_img_02.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-lagoon-50/20 to-coastal-100/30" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`fixed inset-0 -z-10 ${className}`}>
      <div
        ref={gradientRef}
        className="absolute inset-0 bg-gradient-to-br from-lagoon-50 via-coastal-100 to-lagoon-100"
      />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px, 40px 40px",
        }}
      />
    </div>
  );
}
