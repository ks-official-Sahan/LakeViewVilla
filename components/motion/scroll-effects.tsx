"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function ScrollEffects() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (prefersReducedMotion.matches) return

    // Section reveal animations
    const sections = document.querySelectorAll("[data-scroll-reveal]")

    sections.forEach((section) => {
      const direction = section.getAttribute("data-scroll-reveal") || "up"

      const fromVars: any = { opacity: 0 }

      switch (direction) {
        case "up":
          fromVars.y = 100
          break
        case "down":
          fromVars.y = -100
          break
        case "left":
          fromVars.x = -100
          break
        case "right":
          fromVars.x = 100
          break
        case "scale":
          fromVars.scale = 0.8
          break
      }

      gsap.fromTo(section, fromVars, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
        },
      })
    })

    // Parallax elements
    const parallaxElements = document.querySelectorAll("[data-parallax-speed]")

    parallaxElements.forEach((element) => {
      const speed = Number.parseFloat(element.getAttribute("data-parallax-speed") || "0.5")

      gsap.to(element, {
        yPercent: -100 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      })
    })

    // Stagger animations for lists
    const staggerGroups = document.querySelectorAll("[data-stagger]")

    staggerGroups.forEach((group) => {
      const children = group.children
      const delay = Number.parseFloat(group.getAttribute("data-stagger") || "0.1")

      gsap.fromTo(
        children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: delay,
          ease: "power2.out",
          scrollTrigger: {
            trigger: group,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return null
}
