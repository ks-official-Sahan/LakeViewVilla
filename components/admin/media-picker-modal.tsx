"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type MediaRow = {
  id: string;
  url: string;
  title: string | null;
  alt: string | null;
  type: string;
};

interface MediaPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (asset: MediaRow) => void;
  /** When set, only assets with this type label (e.g. IMAGE) are shown. */
  filterType?: string;
  title?: string;
}

export function MediaPickerModal({
  open,
  onOpenChange,
  onSelect,
  filterType,
  title = "Choose media",
}: MediaPickerModalProps) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<MediaRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    void (async () => {
      try {
        const res = await fetch("/api/admin/media", { credentials: "same-origin" });
        if (!res.ok) throw new Error("Failed to load media");
        const data = (await res.json()) as MediaRow[];
        if (!cancelled) {
          const filtered = filterType
            ? data.filter((a) => a.type === filterType)
            : data;
          setItems(filtered);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Load failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, filterType]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <h2 className="text-lg font-semibold text-[var(--color-foreground)]">{title}</h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-2 text-[var(--color-muted)] hover:bg-[var(--color-background)]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
            </div>
          ) : error ? (
            <p className="text-center text-sm text-red-500">{error}</p>
          ) : items.length === 0 ? (
            <p className="text-center text-sm text-[var(--color-muted)]">
              No matching assets. Upload images in Media Library first.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {items.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => {
                    onSelect(asset);
                    onOpenChange(false);
                  }}
                  className="group flex flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-left transition hover:border-[var(--color-primary)]"
                >
                  <div className="relative aspect-square w-full">
                    <Image
                      src={asset.url}
                      alt={asset.alt ?? asset.title ?? ""}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                  </div>
                  <span className="truncate px-2 py-1.5 text-[10px] text-[var(--color-muted)]">
                    {asset.title ?? asset.id.slice(0, 8)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-[var(--color-border)] px-5 py-3">
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
