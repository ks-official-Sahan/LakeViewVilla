"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Glass text input */
export const TextInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function TextInput({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      {...props}
      className={cn(
        // glass + focus + dark native picker
        "w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/55",
        "px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent",
        "[color-scheme:dark]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    />
  );
});

/** Glass textarea */
export const TextArea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function TextArea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      {...props}
      className={cn(
        "w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/55",
        "px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent",
        "resize-none [color-scheme:dark]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    />
  );
});

/** Glass select with custom chevron; keeps native popover for perf/a11y */
export const SelectField = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function SelectField({ className, children, ...props }, ref) {
  return (
    <div className="relative">
      <select
        ref={ref}
        {...props}
        className={cn(
          // hide native arrow, add padding for custom chevron
          "appearance-none w-full rounded-xl bg-white/10 border border-white/20 text-white",
          "px-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent",
          "[color-scheme:dark]", // <- makes the OS popover dark
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
      >
        {children}
      </select>

      {/* Chevron */}
      <svg
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/75"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M6 9l6 6 6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
});
