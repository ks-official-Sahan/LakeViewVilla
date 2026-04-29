"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Upload, Trash2, Search, Filter, Grid3X3, List } from "lucide-react";

interface MediaAsset {
  id: string;
  url: string;
  title: string | null;
  alt: string | null;
  category: string;
  type: string;
  width: number | null;
  height: number | null;
  createdAt: string;
}

interface MediaGridProps {
  initialAssets: MediaAsset[];
}

const CATEGORIES = [
  "all",
  "indoor",
  "outdoor",
  "bedroom-1",
  "bedroom-2",
  "bedroom-3",
  "kitchen",
  "bathroom",
  "lake",
  "garden",
  "pool",
  "dining",
  "amenities",
];

export function MediaGrid({ initialAssets }: MediaGridProps) {
  const [assets, setAssets] = useState(initialAssets);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [uploading, setUploading] = useState(false);

  const filtered = assets.filter((a) => {
    const matchesSearch =
      !search ||
      a.title?.toLowerCase().includes(search.toLowerCase()) ||
      a.alt?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || a.category === category;
    return matchesSearch && matchesCategory;
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    try {
      const formData = new FormData();
      acceptedFiles.forEach((file) => formData.append("files", file));

      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const uploaded = await res.json();
        setAssets((prev) => [...uploaded, ...prev]);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".avif", ".gif", ".svg"],
      "video/*": [".mp4", ".webm"],
    },
    maxSize: 20 * 1024 * 1024, // 20 MB
  });

  async function handleDelete(id: string) {
    if (!confirm("Delete this asset permanently?")) return;

    const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    if (res.ok) {
      setAssets((prev) => prev.filter((a) => a.id !== id));
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload zone */}
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          isDragActive
            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
            : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-3 h-8 w-8 text-[var(--color-muted)]" />
        {uploading ? (
          <p className="text-sm text-[var(--color-muted)]">Uploading…</p>
        ) : isDragActive ? (
          <p className="text-sm font-medium text-[var(--color-primary)]">
            Drop files here
          </p>
        ) : (
          <div>
            <p className="text-sm font-medium text-[var(--color-foreground)]">
              Drag & drop images or videos
            </p>
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              JPG, PNG, WebP, AVIF, SVG, GIF, MP4, WebM — Max 20 MB
            </p>
          </div>
        )}
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            type="text"
            placeholder="Search media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] py-2 pl-9 pr-4 text-sm text-[var(--color-foreground)] outline-none focus:border-[var(--color-primary)]"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="appearance-none rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] py-2 pl-9 pr-8 text-sm text-[var(--color-foreground)] outline-none focus:border-[var(--color-primary)]"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="flex rounded-xl border border-[var(--color-border)]">
          <button
            onClick={() => setView("grid")}
            className={`cursor-pointer rounded-l-xl px-3 py-2 ${
              view === "grid"
                ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                : "text-[var(--color-muted)]"
            }`}
            aria-label="Grid view"
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`cursor-pointer rounded-r-xl px-3 py-2 ${
              view === "list"
                ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                : "text-[var(--color-muted)]"
            }`}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>

        <span className="text-xs text-[var(--color-muted)]">
          {filtered.length} asset{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Grid / List */}
      {view === "grid" ? (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              className="group relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
            >
              <div className="relative aspect-square">
                <Image
                  src={asset.url}
                  alt={asset.alt ?? asset.title ?? "Media"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                />
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-medium text-[var(--color-foreground)]">
                  {asset.title ?? "Untitled"}
                </p>
                <p className="text-xs text-[var(--color-muted)]">
                  {asset.category}
                </p>
              </div>
              {/* Delete overlay */}
              <button
                onClick={() => handleDelete(asset.id)}
                className="absolute right-2 top-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label={`Delete ${asset.title ?? "asset"}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              className="flex items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={asset.url}
                  alt={asset.alt ?? "Media"}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--color-foreground)]">
                  {asset.title ?? "Untitled"}
                </p>
                <p className="text-xs text-[var(--color-muted)]">
                  {asset.category} • {asset.type}
                </p>
              </div>
              <button
                onClick={() => handleDelete(asset.id)}
                className="cursor-pointer rounded-lg p-2 text-[var(--color-muted)] hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                aria-label={`Delete ${asset.title ?? "asset"}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
