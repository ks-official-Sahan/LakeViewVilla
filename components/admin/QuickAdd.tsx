"use client";

import { useState } from "react";
import { Plus, X, Image, FileText, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickAddProps {
  onAddMedia: () => void;
  onAddBlogPost: () => void;
  onAddPageContent: () => void;
}

export function QuickAdd({ onAddMedia, onAddBlogPost, onAddPageContent }: QuickAddProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        onClick={() => setOpen(!open)}
        className="rounded-full h-12 w-12 shadow-lg flex items-center justify-center"
        aria-label="Quick add"
      >
        {open ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
      </Button>

      {open && (
        <div className="absolute bottom-14 right-0 z-10 w-48 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-xl overflow-hidden">
          <button
            onClick={() => {
              onAddMedia();
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-surface)] transition-colors"
          >
            <Image className="h-4 w-4 text-[var(--color-primary)]" />
            Upload Media
          </button>
          <button
            onClick={() => {
              onAddBlogPost();
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-surface)] transition-colors border-t border-[var(--color-border)]"
          >
            <PenLine className="h-4 w-4 text-[var(--color-primary)]" />
            New Blog Post
          </button>
          <button
            onClick={() => {
              onAddPageContent();
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-surface)] transition-colors border-t border-[var(--color-border)]"
          >
            <FileText className="h-4 w-4 text-[var(--color-primary)]" />
            Page Content
          </button>
        </div>
      )}

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
