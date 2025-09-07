"use client"

import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"
import { useRef } from "react"
import { gsap } from "gsap"

import { cn } from "@/lib/utils"

const HoverCard = HoverCardPrimitive.Root

const HoverCardTrigger = HoverCardPrimitive.Trigger

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
))
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

interface EnhancedHoverCardProps {
  children: React.ReactNode
  className?: string
  enableTilt?: boolean
  glassEffect?: boolean
}

const EnhancedHoverCard = React.forwardRef<HTMLDivElement, EnhancedHoverCardProps>(
  ({ children, className = "", enableTilt = true, glassEffect = true }, ref) => {
    const cardRef = useRef<HTMLDivElement>(null)

    const handleMouseEnter = () => {
      const card = cardRef.current
      if (!card) return

      gsap.to(card, {
        y: -8,
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
      })

      if (glassEffect) {
        gsap.to(card, {
          boxShadow: "0 25px 50px -12px rgba(6,182,212,0.25), 0 0 0 1px rgba(6,182,212,0.1)",
          duration: 0.3,
          ease: "power2.out",
        })
      }
    }

    const handleMouseLeave = () => {
      const card = cardRef.current
      if (!card) return

      gsap.to(card, {
        y: 0,
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        duration: 0.3,
        ease: "power2.out",
      })

      if (glassEffect) {
        gsap.to(card, {
          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
          duration: 0.3,
          ease: "power2.out",
        })
      }
    }

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!enableTilt) return

      const card = cardRef.current
      if (!card) return

      const rect = card.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = (e.clientX - centerX) / rect.width
      const deltaY = (e.clientY - centerY) / rect.height

      // Limit tilt to safe bounds (max 10 degrees)
      const maxTilt = 10
      const rotateY = deltaX * maxTilt
      const rotateX = -deltaY * maxTilt

      gsap.to(card, {
        rotateX: Math.max(-maxTilt, Math.min(maxTilt, rotateX)),
        rotateY: Math.max(-maxTilt, Math.min(maxTilt, rotateY)),
        duration: 0.2,
        ease: "power2.out",
      })
    }

    const baseClasses = glassEffect
      ? "backdrop-blur-md bg-white/10 border border-white/20"
      : "bg-white border border-gray-200"

    return (
      <div
        ref={cardRef}
        className={cn(
          "rounded-lg p-6 transition-all duration-300 cursor-pointer",
          "shadow-lg hover:shadow-xl",
          baseClasses,
          className,
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </div>
    )
  },
)

EnhancedHoverCard.displayName = "EnhancedHoverCard"

export { HoverCard, HoverCardTrigger, HoverCardContent, EnhancedHoverCard }
