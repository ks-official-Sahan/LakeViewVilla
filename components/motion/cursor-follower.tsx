"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

export function CursorFollower() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)
  const trailRefs = useRef<HTMLDivElement[]>([])
  const ribbonRefs = useRef<HTMLDivElement[]>([])
  const [isCoarsePointer, setIsCoarsePointer] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: coarse)")
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

    setIsCoarsePointer(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setIsCoarsePointer(e.matches)
    mediaQuery.addEventListener("change", handleChange)

    if (mediaQuery.matches || prefersReducedMotion.matches) {
      return () => mediaQuery.removeEventListener("change", handleChange)
    }

    const cursor = cursorRef.current
    const follower = followerRef.current
    const trails = trailRefs.current
    const ribbons = ribbonRefs.current

    if (!cursor || !follower) return

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0,
      })

      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: "power2.out",
      })

      // Animate trail elements with staggered delays
      trails.forEach((trail, index) => {
        gsap.to(trail, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.4 + index * 0.1,
          ease: "power2.out",
        })
      })

      ribbons.forEach((ribbon, index) => {
        gsap.to(ribbon, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.6 + index * 0.15,
          ease: "power3.out",
          rotation: index * 15,
        })
      })
    }

    const onMouseEnterMagnetic = (e: Event) => {
      const target = e.target as HTMLElement
      const rect = target.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      gsap.to([cursor, follower], {
        scale: 2,
        duration: 0.3,
        ease: "power2.out",
      })

      gsap.to(trails, {
        scale: 1.5,
        opacity: 0.8,
        duration: 0.3,
        stagger: 0.05,
      })

      gsap.to(ribbons, {
        scale: 1.2,
        opacity: 0.9,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out",
      })

      // Magnetic attraction with safe bounds (max 20px offset)
      const maxOffset = 20
      const offsetX = Math.min(Math.max(centerX - e.clientX, -maxOffset), maxOffset)
      const offsetY = Math.min(Math.max(centerY - e.clientY, -maxOffset), maxOffset)

      gsap.to(cursor, {
        x: e.clientX + offsetX * 0.3,
        y: e.clientY + offsetY * 0.3,
        duration: 0.5,
        ease: "power2.out",
      })
    }

    const onMouseLeaveMagnetic = () => {
      gsap.to([cursor, follower], {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      })

      gsap.to(trails, {
        scale: 1,
        opacity: 0.6,
        duration: 0.3,
        stagger: 0.05,
      })

      gsap.to(ribbons, {
        scale: 1,
        opacity: 0.4,
        rotation: 0,
        duration: 0.4,
        stagger: 0.08,
      })
    }

    const onMouseEnterInteractive = () => {
      gsap.to(cursor, {
        scale: 0.5,
        backgroundColor: "rgba(6,182,212,1)",
        duration: 0.2,
      })

      gsap.to(follower, {
        scale: 2,
        borderColor: "rgba(6,182,212,0.8)",
        duration: 0.2,
      })
    }

    const onMouseLeaveInteractive = () => {
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: "rgba(255,255,255,1)",
        duration: 0.2,
      })

      gsap.to(follower, {
        scale: 1,
        borderColor: "rgba(255,255,255,0.3)",
        duration: 0.2,
      })
    }

    document.addEventListener("mousemove", onMouseMove)

    // Enhanced selectors for interactive elements
    const magneticElements = document.querySelectorAll("[data-magnetic]")
    const interactiveElements = document.querySelectorAll("button, a, [role='button'], input, textarea")

    magneticElements.forEach((element) => {
      element.addEventListener("mouseenter", onMouseEnterMagnetic)
      element.addEventListener("mouseleave", onMouseLeaveMagnetic)
    })

    interactiveElements.forEach((element) => {
      if (!element.hasAttribute("data-magnetic")) {
        element.addEventListener("mouseenter", onMouseEnterInteractive)
        element.addEventListener("mouseleave", onMouseLeaveInteractive)
      }
    })

    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      mediaQuery.removeEventListener("change", handleChange)

      magneticElements.forEach((element) => {
        element.removeEventListener("mouseenter", onMouseEnterMagnetic)
        element.removeEventListener("mouseleave", onMouseLeaveMagnetic)
      })

      interactiveElements.forEach((element) => {
        element.removeEventListener("mouseenter", onMouseEnterInteractive)
        element.removeEventListener("mouseleave", onMouseLeaveInteractive)
      })
    }
  }, [isCoarsePointer])

  if (isCoarsePointer) return null

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference hidden lg:block shadow-[0_0_20px_rgba(255,255,255,0.8)]"
        style={{ transform: "translate(-50%, -50%)" }}
      />

      {/* Follower ring */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-10 h-10 border-2 border-white/30 rounded-full pointer-events-none z-[9998] mix-blend-difference hidden lg:block shadow-[0_0_30px_rgba(255,255,255,0.4)]"
        style={{ transform: "translate(-50%, -50%)" }}
      />

      {/* Trail dots */}
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          ref={(el) => {
            if (el) trailRefs.current[index] = el
          }}
          className="fixed top-0 left-0 rounded-full pointer-events-none z-[9997] mix-blend-difference hidden lg:block"
          style={{
            width: `${8 - index}px`,
            height: `${8 - index}px`,
            backgroundColor: `rgba(255,255,255,${0.6 - index * 0.1})`,
            transform: "translate(-50%, -50%)",
            boxShadow: `0 0 ${15 - index * 2}px rgba(255,255,255,${0.5 - index * 0.08})`,
          }}
        />
      ))}

      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={`ribbon-${index}`}
          ref={(el) => {
            if (el) ribbonRefs.current[index] = el
          }}
          className="fixed top-0 left-0 pointer-events-none z-[9996] mix-blend-screen hidden lg:block"
          style={{
            width: `${2 + index * 0.5}px`,
            height: `${12 - index}px`,
            backgroundColor: `rgba(6,182,212,${0.4 - index * 0.04})`,
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            filter: `blur(${index * 0.3}px)`,
            boxShadow: `0 0 ${8 + index * 2}px rgba(6,182,212,${0.3 - index * 0.03})`,
          }}
        />
      ))}
    </>
  )
}
