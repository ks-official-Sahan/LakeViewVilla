"use client";

import { useState } from "react";
import { HelpCircle, X } from "lucide-react";

interface HelpItem {
  label: string;
  description: string;
}

interface InlineHelpProps {
  items: HelpItem[];
  className?: string;
}

export function InlineHelp({ items, className = "" }: InlineHelpProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-full p-1 text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)] transition-colors"
        aria-label="Help"
      >
        <HelpCircle className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute z-20 right-0 top-8 w-72 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[var(--color-foreground)]">
              Help & Tips
            </h4>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-0.5 text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {items.map((item, i) => (
              <div
                key={i}
                className="rounded-lg border border-[var(--color-border)] p-2.5"
              >
                <p className="text-xs font-medium text-[var(--color-foreground)]">
                  {item.label}
                </p>
                <p className="mt-0.5 text-xs text-[var(--color-muted)] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[-1]"
            onClick={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
