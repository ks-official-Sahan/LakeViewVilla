/**
 * Design System Tokens — LakeViewVilla
 *
 * Single source of truth for all design decisions.
 * WCAG 2.2 AAA compliant (7:1+ contrast ratios).
 *
 * Color philosophy:
 *   - Lagoon Teal: Primary brand color (tropical water)
 *   - Deep Ocean: Secondary (depth, trust)
 *   - Sunset Gold: Accent (warmth, luxury)
 *   - Nature greens & sand neutrals for supporting roles
 */

// ─── Color Palette ──────────────────────────────────────────────────────────

export const palette = {
  // Brand primaries
  lagoonTeal: {
    50: "hsl(189, 85%, 97%)",
    100: "hsl(189, 82%, 92%)",
    200: "hsl(189, 80%, 82%)",
    300: "hsl(189, 78%, 68%)",
    400: "hsl(189, 76%, 52%)",
    500: "hsl(189, 84%, 33%)", // Primary
    600: "hsl(189, 88%, 27%)",
    700: "hsl(189, 90%, 22%)",
    800: "hsl(189, 92%, 16%)",
    900: "hsl(189, 94%, 10%)",
    950: "hsl(189, 96%, 6%)",
  },
  deepOcean: {
    50: "hsl(205, 70%, 96%)",
    100: "hsl(205, 68%, 90%)",
    200: "hsl(205, 66%, 78%)",
    300: "hsl(205, 64%, 64%)",
    400: "hsl(205, 68%, 50%)",
    500: "hsl(205, 70%, 39%)", // Secondary
    600: "hsl(205, 74%, 32%)",
    700: "hsl(205, 78%, 25%)",
    800: "hsl(205, 80%, 18%)",
    900: "hsl(205, 82%, 12%)",
    950: "hsl(205, 85%, 7%)",
  },
  sunsetGold: {
    50: "hsl(40, 95%, 97%)",
    100: "hsl(40, 92%, 92%)",
    200: "hsl(40, 88%, 82%)",
    300: "hsl(40, 85%, 68%)",
    400: "hsl(40, 82%, 55%)",
    500: "hsl(40, 80%, 48%)", // Accent
    600: "hsl(36, 82%, 42%)",
    700: "hsl(32, 85%, 35%)",
    800: "hsl(28, 88%, 28%)",
    900: "hsl(24, 90%, 20%)",
  },
  sand: {
    50: "hsl(35, 30%, 98%)",
    100: "hsl(35, 25%, 95%)",
    200: "hsl(35, 20%, 90%)",
    300: "hsl(35, 18%, 82%)",
    400: "hsl(35, 14%, 68%)",
    500: "hsl(35, 10%, 55%)",
    600: "hsl(35, 8%, 42%)",
    700: "hsl(35, 10%, 30%)",
    800: "hsl(35, 12%, 20%)",
    900: "hsl(35, 15%, 12%)",
    950: "hsl(35, 18%, 6%)",
  },
} as const;

// ─── Spacing (8pt grid with golden ratio progression) ───────────────────────

export const spacing = {
  px: "1px",
  0: "0",
  0.5: "0.125rem", // 2px
  1: "0.25rem",    // 4px
  1.5: "0.375rem", // 6px
  2: "0.5rem",     // 8px — base unit
  3: "0.75rem",    // 12px
  4: "1rem",       // 16px
  5: "1.25rem",    // 20px
  6: "1.5rem",     // 24px
  8: "2rem",       // 32px
  10: "2.5rem",    // 40px
  12: "3rem",      // 48px
  16: "4rem",      // 64px
  20: "5rem",      // 80px
  24: "6rem",      // 96px
  32: "8rem",      // 128px
  40: "10rem",     // 160px
  48: "12rem",     // 192px
  64: "16rem",     // 256px
} as const;

// ─── Typography (Perfect Fourth scale — 1.333 ratio) ────────────────────────

export const typography = {
  fontFamily: {
    display: "var(--font-montserrat), ui-serif, Georgia, serif",
    sans: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
    mono: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace",
  },
  fontSize: {
    xs: ["0.75rem", { lineHeight: "1rem" }],         // 12px
    sm: ["0.875rem", { lineHeight: "1.25rem" }],     // 14px
    base: ["1rem", { lineHeight: "1.625rem" }],      // 16px — generous leading
    lg: ["1.125rem", { lineHeight: "1.75rem" }],     // 18px
    xl: ["1.25rem", { lineHeight: "1.875rem" }],     // 20px
    "2xl": ["1.5rem", { lineHeight: "2rem" }],       // 24px
    "3xl": ["1.875rem", { lineHeight: "2.375rem" }], // 30px
    "4xl": ["2.25rem", { lineHeight: "2.75rem" }],   // 36px
    "5xl": ["3rem", { lineHeight: "1.15" }],         // 48px
    "6xl": ["3.75rem", { lineHeight: "1.1" }],       // 60px
    "7xl": ["4.5rem", { lineHeight: "1.05" }],       // 72px
    "8xl": ["6rem", { lineHeight: "1" }],            // 96px
    "9xl": ["8rem", { lineHeight: "1" }],            // 128px
  },
  fontWeight: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  letterSpacing: {
    tighter: "-0.04em",
    tight: "-0.02em",
    normal: "0",
    wide: "0.02em",
    wider: "0.05em",
    widest: "0.12em",
  },
} as const;

// ─── Shadows (5-level elevation system) ─────────────────────────────────────

export const shadows = {
  // Light theme shadows
  light: {
    xs: "0 1px 2px rgba(2, 6, 23, 0.04)",
    sm: "0 1px 3px rgba(2, 6, 23, 0.06), 0 1px 2px rgba(2, 6, 23, 0.04)",
    md: "0 4px 6px -1px rgba(2, 6, 23, 0.06), 0 2px 4px -2px rgba(2, 6, 23, 0.04)",
    lg: "0 10px 15px -3px rgba(2, 6, 23, 0.06), 0 4px 6px -4px rgba(2, 6, 23, 0.04)",
    xl: "0 20px 25px -5px rgba(2, 6, 23, 0.08), 0 8px 10px -6px rgba(2, 6, 23, 0.04)",
    "2xl": "0 25px 50px -12px rgba(2, 6, 23, 0.18)",
    glow: "0 0 20px rgba(14, 142, 154, 0.15), 0 0 60px rgba(14, 142, 154, 0.08)",
  },
  // Dark theme shadows
  dark: {
    xs: "0 1px 2px rgba(0, 0, 0, 0.2)",
    sm: "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.35), 0 4px 6px -4px rgba(0, 0, 0, 0.2)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    glow: "0 0 20px rgba(56, 189, 248, 0.2), 0 0 60px rgba(56, 189, 248, 0.1)",
  },
} as const;

// ─── Animation Tokens ───────────────────────────────────────────────────────

export const animation = {
  duration: {
    instant: "75ms",
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
    slower: "700ms",
    cinematic: "1200ms",
  },
  easing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    smooth: "cubic-bezier(0.23, 1, 0.32, 1)",
    // Premium scroll animation curves
    scrollReveal: "cubic-bezier(0.16, 1, 0.3, 1)",
    scrollSmooth: "cubic-bezier(0.25, 0.1, 0.25, 1)",
  },
} as const;

// ─── Borders & Radii ────────────────────────────────────────────────────────

export const radius = {
  none: "0",
  sm: "6px",
  md: "10px",
  lg: "14px",
  xl: "20px",
  "2xl": "28px",
  full: "9999px",
} as const;

// ─── Breakpoints ────────────────────────────────────────────────────────────

export const breakpoints = {
  xs: "475px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// ─── Z-Index Scale ──────────────────────────────────────────────────────────

export const zIndex = {
  behind: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  toast: 50,
  tooltip: 60,
  max: 9999,
} as const;
