// components/theme/theme-switch.tsx
"use client";

import * as React from "react";
import { useMantineColorScheme } from "@mantine/core";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

// Keep options stable across renders
const OPTIONS = [
  { key: "light", icon: Sun, label: "Light" },
  { key: "system", icon: Monitor, label: "System" },
  { key: "dark", icon: Moon, label: "Dark" },
] as const;
type Key = (typeof OPTIONS)[number]["key"];

export default function ThemeSwitch() {
  // ── Hooks (order never changes)
  const { theme, setTheme, systemTheme, resolvedTheme } = useTheme();
  const { setColorScheme } = useMantineColorScheme({ keepTransitions: true });

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // Apply both next-themes and Mantine in lockstep
  const applyTheme = React.useCallback(
    (t: Key) => {
      setTheme(t);
      setColorScheme(t === "system" ? "auto" : t);
    },
    [setTheme, setColorScheme]
  );

  // Update <meta name="theme-color"> after mount only (avoids SSR mismatch)
  React.useEffect(() => {
    if (!mounted) return;
    const eff: "light" | "dark" =
      (theme === "system"
        ? (systemTheme as "light" | "dark" | undefined)
        : (resolvedTheme as "light" | "dark" | undefined)) ?? "dark";

    const meta = document.querySelector(
      'meta[name="theme-color"]'
    ) as HTMLMetaElement | null;

    const fallback = eff === "dark" ? "#0a0f10" : "#f4f7f6";
    let color = fallback;
    try {
      const root = getComputedStyle(document.documentElement);
      const varHex = root.getPropertyValue("--color-background").trim();
      if (varHex) color = varHex;
    } catch {}
    if (meta) meta.setAttribute("content", color);
  }, [mounted, theme, systemTheme, resolvedTheme]);

  // ── SSR-safe placeholder (no theme-driven ARIA/state before mount)
  if (!mounted) {
    return (
      <div
        aria-hidden
        role="presentation"
        className="inline-flex h-10 items-center gap-1 rounded-full border border-border/80 bg-card/40 px-1.5 py-1 backdrop-blur-sm"
        data-mounted="false"
      >
        <div className="grid size-7 place-items-center rounded-full opacity-80">
          <Sun size={16} />
        </div>
        <div className="grid size-7 place-items-center rounded-full opacity-80">
          <Monitor size={16} />
        </div>
        <div className="grid size-7 place-items-center rounded-full opacity-80">
          <Moon size={16} />
        </div>
      </div>
    );
  }

  // ── Interactive radiogroup (client-only)
  const currentKey: Key = (theme as Key) ?? "system";
  const btnRefs = React.useRef<HTMLButtonElement[]>([]);
  const setRef = React.useCallback(
    (el: HTMLButtonElement | null, i: number) => {
      if (el) btnRefs.current[i] = el;
    },
    []
  );

  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const idx = OPTIONS.findIndex((o) => o.key === currentKey);
      if (idx < 0) return;

      const move = (nextIdx: number) => {
        const target = (nextIdx + OPTIONS.length) % OPTIONS.length;
        btnRefs.current[target]?.focus();
        applyTheme(OPTIONS[target].key);
      };

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          move(idx + 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          move(idx - 1);
          break;
        case "Home":
          e.preventDefault();
          move(0);
          break;
        case "End":
          e.preventDefault();
          move(OPTIONS.length - 1);
          break;
      }
    },
    [currentKey, applyTheme]
  );

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      onKeyDown={onKeyDown}
      className="inline-flex h-10 items-center gap-1 rounded-full border border-border/80 bg-card/40 px-1.5 py-1 backdrop-blur-sm"
      data-mounted="true"
    >
      {OPTIONS.map(({ key, icon: Icon, label }, i) => {
        const checked = currentKey === key;
        return (
          <button
            key={key}
            ref={(el) => setRef(el, i)}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={`Use ${label} theme`}
            tabIndex={checked ? 0 : -1}
            onClick={() => applyTheme(key)}
            title={label}
            className={[
              "relative grid size-7 place-items-center rounded-full outline-none transition-[transform,background,box-shadow] duration-150",
              "hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-primary/60",
              checked
                ? "bg-sky-500/30 shadow-[0_1px_0_rgba(0,0,0,0.06),0_6px_18px_rgba(0,0,0,0.10)]"
                : "bg-transparent",
              "data-[state=unchecked]:hover:-translate-y-0.5",
            ].join(" ")}
            data-state={checked ? "checked" : "unchecked"}
          >
            <Icon size={16} className="opacity-90" />
            <span className="sr-only">{label}</span>
          </button>
        );
      })}

      {/* SR-only live region to announce changes */}
      <span className="sr-only" aria-live="polite" role="status">
        Theme set to {theme}.
      </span>
    </div>
  );
}

// "use client";

// import { useMantineColorScheme } from "@mantine/core";
// import { Monitor, Moon, Sun } from "lucide-react";
// import { useTheme } from "next-themes";
// import React from "react";

// export default function ThemeSwitch() {
//   const { theme, setTheme, systemTheme } = useTheme();
//   const { setColorScheme } = useMantineColorScheme({ keepTransitions: true });
//   const [mounted, setMounted] = React.useState(false);
//   React.useEffect(() => setMounted(true), []);
//   if (!mounted) return null;

//   const setBoth = (t: "light" | "dark" | "system") => {
//     setTheme(t);
//     setColorScheme(t === "system" ? "auto" : t);
//   };

//   const current =
//     theme === "system" ? (systemTheme as "light" | "dark") : theme;

//   return (
//     <div
//       role="toolbar"
//       aria-label="Theme switcher"
//       className="h-[41px] backdrop-blur-sm flex items-center px-1.5 py-1 rounded-full border border-border"
//     >
//       <button
//         type="button"
//         onClick={() => setBoth("light")}
//         aria-label="Use light theme"
//         aria-pressed={current === "light"}
//         className={`w-7 h-7 rounded-full grid place-items-center mx-0.5 ${
//           current === "light" ? "bg-muted/40" : "hover:bg-muted/20"
//         }`}
//       >
//         <Sun size={16} />
//       </button>
//       <button
//         type="button"
//         onClick={() => setBoth("system")}
//         aria-label="Use system theme"
//         aria-pressed={theme === "system"}
//         className={`w-7 h-7 rounded-full grid place-items-center mx-0.5 ${
//           theme === "system" ? "bg-muted/40" : "hover:bg-muted/20"
//         }`}
//       >
//         <Monitor size={16} />
//       </button>
//       <button
//         type="button"
//         onClick={() => setBoth("dark")}
//         aria-label="Use dark theme"
//         aria-pressed={current === "dark"}
//         className={`w-7 h-7 rounded-full grid place-items-center mx-0.5 ${
//           current === "dark" ? "bg-muted/40" : "hover:bg-muted/20"
//         }`}
//       >
//         <Moon size={16} />
//       </button>
//     </div>
//   );
// }

// "use client";

// import { useMantineColorScheme } from "@mantine/core";
// import { Monitor, Moon, Sun } from "lucide-react";
// import { useTheme } from "next-themes";
// import React, { useEffect, useState } from "react";

// type themeProps = {
//   t: "light" | "dark" | "system";
// };

// const ThemeSwitch = () => {
//   const { theme, setTheme } = useTheme();
//   const { setColorScheme } = useMantineColorScheme({
//     keepTransitions: true,
//   });

//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const handleChangeTheme = ({ t }: themeProps) => {
//     if (mounted) {
//       if (t === "light") {
//         setTheme("light");
//         setColorScheme("light");
//       } else if (t === "dark") {
//         setTheme("dark");
//         setColorScheme("dark");
//       } else if (t === "system") {
//         setTheme("system");
//         setColorScheme("auto");
//       }
//     }
//   };

//   if (!mounted) return null;

//   return (
//     <div className="h-[41px] backdrop-blur-sm flex items-center px-[6px] py-[4px] rounded-full border border-evision_border_primary w-fit">
//       <div
//         onClick={() => handleChangeTheme({ t: "light" })}
//         className={`w-[28px] h-[28px] rounded-full flex justify-center items-center cursor-pointer ${
//           theme === "light" ? "bg-[#f7f7f7] dark:bg-[#1A1A1A80]" : ""
//         } `}
//       >
//         <Sun size={16} />
//       </div>
//       <div
//         onClick={() => handleChangeTheme({ t: "system" })}
//         className={`w-[28px] h-[28px] rounded-full flex justify-center items-center cursor-pointer ${
//           theme === "system" ? "bg-[#f7f7f7] dark:bg-[#1A1A1A80]" : ""
//         } `}
//       >
//         <Monitor size={16} />
//       </div>
//       <div
//         onClick={() => handleChangeTheme({ t: "dark" })}
//         className={`w-[28px] h-[28px] rounded-full flex justify-center items-center cursor-pointer ${
//           theme === "dark" ? "bg-[#f7f7f7] dark:bg-[#1A1A1A80]" : ""
//         } `}
//       >
//         <Moon size={16} />
//       </div>
//     </div>
//   );
// };

// export default ThemeSwitch;
