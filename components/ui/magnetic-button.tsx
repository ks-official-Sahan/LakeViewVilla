"use client"

import type React from "react"

import { useRef, type ReactNode } from "react"
import { gsap } from "gsap"

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  strength?: number
}

export function MagneticButton({ children, className = "", onClick, strength = 0.3 }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleMouseEnter = () => {
    const button = buttonRef.current
    if (!button) return

    gsap.to(button, {
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out",
    })

    // Ripple effect
    const ripple = document.createElement("div")
    ripple.className = "absolute inset-0 bg-white/20 rounded-full scale-0"
    button.appendChild(ripple)

    gsap.to(ripple, {
      scale: 1,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => ripple.remove(),
    })
  }

  const handleMouseLeave = () => {
    const button = buttonRef.current
    if (!button) return

    gsap.to(button, {
      scale: 1,
      x: 0,
      y: 0,
      duration: 0.3,
      ease: "power2.out",
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const button = buttonRef.current
    if (!button) return

    const rect = button.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength

    gsap.to(button, {
      x: deltaX,
      y: deltaY,
      duration: 0.3,
      ease: "power2.out",
    })
  }

  return (
    <button
      ref={buttonRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      data-magnetic
    >
      {children}
    </button>
  )
}
