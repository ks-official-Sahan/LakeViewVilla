/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  id?: string;
  label?: string;
  error?: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  className?: string;
};

export function GuestsSelect({
  id,
  label = "Guests *",
  error,
  value,
  onChange,
  min = 1,
  max = 4,
  className,
}: Props) {
  const reactId = useId();
  const uid = id || `guests-${reactId}`;
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const items = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t) || listRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  // Move focus into list when opened
  useEffect(() => {
    if (open) setTimeout(() => listRef.current?.focus(), 0);
  }, [open]);

  const labelText = `${value} ${value === 1 ? "Guest" : "Guests"}`;
  const listId = `${uid}-listbox`;

  const openAndFocus = (first: boolean) => {
    setOpen(true);
    setActive(first ? items[0] : items[items.length - 1]);
  };

  const onButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      openAndFocus(true);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      openAndFocus(false);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((o) => !o);
    }
  };

  const onListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      btnRef.current?.focus();
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (active != null) {
        onChange(active);
        setOpen(false);
        btnRef.current?.focus();
      }
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const idx = active != null ? items.indexOf(active) : -1;
      let nextIdx = idx;
      if (e.key === "ArrowDown") nextIdx = Math.min(items.length - 1, idx + 1);
      if (e.key === "ArrowUp") nextIdx = Math.max(0, idx - 1);
      setActive(items[nextIdx] ?? items[0]);
    }
    if (e.key === "Home") {
      e.preventDefault();
      setActive(items[0]);
    }
    if (e.key === "End") {
      e.preventDefault();
      setActive(items[items.length - 1]);
    }
  };

  return (
    <div className={cn("relative", className)}>
      {label ? (
        <label
          htmlFor={uid}
          className="block text-sm font-medium text-white mb-2"
        >
          {label}
        </label>
      ) : null}

      {/* button (looks like an input) */}
      <button
        ref={btnRef}
        id={uid}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onKeyDown={onButtonKeyDown}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "w-full text-left rounded-xl bg-white/10 border border-white/20 text-white",
          "px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent",
          "inline-flex items-center justify-between gap-2"
        )}
      >
        <span>{labelText}</span>
        <svg
          className={cn(
            "h-4 w-4 shrink-0 transition-transform",
            open && "rotate-180"
          )}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M6 9l6 6 6-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* popover */}
      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listRef}
            id={listId}
            role="listbox"
            tabIndex={-1}
            aria-activedescendant={
              active != null ? `${uid}-opt-${active}` : undefined
            }
            onKeyDown={onListKeyDown}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className={cn(
              "absolute z-50 mt-2 w-full rounded-xl p-1",
              "bg-slate-900/95 text-white ring-1 ring-white/15 backdrop-blur-xl shadow-2xl"
            )}
          >
            {items.map((g) => {
              const selected = value === g;
              const hovered = active === g;
              return (
                <li
                  id={`${uid}-opt-${g}`}
                  key={g}
                  role="option"
                  aria-selected={selected}
                  onMouseEnter={() => setActive(g)}
                  onMouseLeave={() => setActive(null)}
                  onClick={() => {
                    onChange(g);
                    setOpen(false);
                    btnRef.current?.focus();
                  }}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 select-none",
                    selected
                      ? "bg-cyan-500/15 text-white ring-1 ring-cyan-400/30"
                      : hovered
                      ? "bg-white/10 text-white"
                      : "text-slate-200"
                  )}
                >
                  <span>
                    {g} {g === 1 ? "Guest" : "Guests"}
                  </span>
                  {selected ? (
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                  ) : null}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>

      {error ? <p className="mt-1 text-sm text-red-400">{error}</p> : null}
      {/* We keep a hidden input if you ever need HTML form post compatibility */}
      <input type="hidden" value={value} readOnly />
    </div>
  );
}
