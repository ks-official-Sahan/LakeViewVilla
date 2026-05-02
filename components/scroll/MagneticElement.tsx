"use client";

import { useRef, type ReactNode, type CSSProperties } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

interface MagneticElementProps {
  children: ReactNode;
  /** Magnetic pull strength (px). Default: 12 */
  strength?: number;
  /** Framer Motion spring stiffness. Default: 280 */
  stiffness?: number;
  /** Framer Motion spring damping. Default: 26 */
  damping?: number;
  /** Framer Motion spring mass. Default: 0.72 */
  mass?: number;
  /** Additional className */
  className?: string;
  /** Additional inline style */
  style?: CSSProperties;
}

export function MagneticElement({
  children,
  strength = 12,
  stiffness = 280,
  damping = 26,
  mass = 0.72,
  className = "",
  style,
}: MagneticElementProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness, damping, mass });
  const springY = useSpring(y, { stiffness, damping, mass });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced) return;
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) / rect.width;
    const deltaY = (e.clientY - centerY) / rect.height;

    x.set(deltaX * strength);
    y.set(deltaY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY, ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}
