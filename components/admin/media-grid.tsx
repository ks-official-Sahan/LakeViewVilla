"use client";

import { useState, useCallback, useRef, useLayoutEffect, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import {
  Upload, Trash2, Search, Filter, Grid3X3, List, Edit2, X, Check, Copy, CheckSquare, Square,
} from "lucide-react";
import { updateMediaAsset, bulkUpdateMedia, updateMediaAssetLocations } from "@/lib/actions/media";
import { MEDIA_LOCATIONS, locationKey } from "@/lib/admin/media-locations";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { queryKeys } from "@/lib/cache/react-query";
import { toast } from "sonner";

interface MediaAsset {
  id: string;
  url: string;
  title: string | null;
  alt: string | null;
  tags: string[];
  featured: boolean;
  category: string;
  type: string;
  width: number | null;
  height: number | null;
  createdAt: string;
  locations?: {
    id: string;
    pageSlug: string;
    sectionSlug: string;
    isPrimary: boolean;
    order: number;
  }[];
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

async function fetchAdminMedia(): Promise<MediaAsset[]> {
  const res = await fetch("/api/admin/media", { credentials: "same-origin" });
  if (!res.ok) throw new Error("Failed to load media");
  return res.json();
}

export function MediaGrid({ initialAssets }: MediaGridProps) {
  const queryClient = useQueryClient();
  /** Marks SSR/props data as “just fetched” so TanStack Query does not treat it as infinitely stale (timestamp 0). */
  const serverSyncedAt = useRef(Date.now());

  const listFingerprint = useMemo(
    () => initialAssets.map((a) => a.id).join("|"),
    [initialAssets],
  );

  useLayoutEffect(() => {
    queryClient.setQueryData(queryKeys.adminMediaLibrary(), initialAssets);
    serverSyncedAt.current = Date.now();
  }, [listFingerprint, initialAssets, queryClient]);

  const { data, isFetching } = useQuery({
    queryKey: queryKeys.adminMediaLibrary(),
    queryFn: fetchAdminMedia,
    initialData: initialAssets,
    initialDataUpdatedAt: serverSyncedAt.current,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const assets = data ?? initialAssets;
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);
  const [saving, setSaving] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"delete" | "bulkDelete" | null>(null);
  const [bulkCategory, setBulkCategory] = useState("");
  const [placementKeys, setPlacementKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!editingAsset) return;
    const next = new Set(
      (editingAsset.locations ?? []).map((l) => locationKey(l.pageSlug, l.sectionSlug)),
    );
    if (next.size === 0) next.add(locationKey("gallery", "grid"));
    setPlacementKeys(next);
  }, [editingAsset?.id]);

  const togglePlacement = (pageSlug: string, sectionSlug: string) => {
    const key = locationKey(pageSlug, sectionSlug);
    setPlacementKeys((prev) => {
      const n = new Set(prev);
      if (n.has(key)) {
        if (n.size <= 1) return prev;
        n.delete(key);
      } else {
        n.add(key);
      }
      return n;
    });
  };

  const filtered = assets.filter((a) => {
    const q = search.toLowerCase();
    const tagList = a.tags ?? [];
    const locations = a.locations ?? [];
    const locHaystack = locations.map((l) => `${l.pageSlug}/${l.sectionSlug}`).join(" ");
    const matchesSearch =
      !search ||
      a.title?.toLowerCase().includes(q) ||
      a.alt?.toLowerCase().includes(q) ||
      tagList.some((t) => t.toLowerCase().includes(q)) ||
      locHaystack.toLowerCase().includes(q);
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
        credentials: "same-origin",
      });

      if (res.ok) {
        await queryClient.invalidateQueries({ queryKey: queryKeys.adminMediaLibrary() });
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  }, [queryClient]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".avif", ".gif", ".svg"],
      "video/*": [".mp4", ".webm"],
    },
    maxSize: 20 * 1024 * 1024,
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((a) => a.id)));
    }
  };

  const handleDelete = (id: string) => {
    const asset = assets.find((a) => a.id === id);
    setEditingAsset(asset ?? null);
    setConfirmAction("delete");
    setConfirmOpen(true);
  };

  const handleBulkDelete = () => {
    setConfirmAction("bulkDelete");
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    const ids =
      confirmAction === "delete"
        ? [editingAsset?.id].filter(Boolean) as string[]
        : Array.from(selectedIds);

    try {
      if (confirmAction === "bulkDelete") {
        await bulkUpdateMedia({ ids, action: "delete" });
        setSelectedIds(new Set());
        await queryClient.invalidateQueries({ queryKey: queryKeys.adminMediaLibrary() });
      } else if (editingAsset) {
        const res = await fetch(`/api/admin/media/${editingAsset.id}`, {
          method: "DELETE",
          credentials: "same-origin",
        });
        if (res.ok) {
          setEditingAsset(null);
          await queryClient.invalidateQueries({ queryKey: queryKeys.adminMediaLibrary() });
        }
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setConfirmOpen(false);
      setConfirmAction(null);
    }
  };

  const handleBulkRecategorize = async () => {
    if (!bulkCategory || selectedIds.size === 0) return;
    try {
      await bulkUpdateMedia({ ids: Array.from(selectedIds), action: "recategorize", category: bulkCategory });
      setSelectedIds(new Set());
      setBulkCategory("");
      await queryClient.invalidateQueries({ queryKey: queryKeys.adminMediaLibrary() });
    } catch (err) {
      console.error("Bulk recategorize failed:", err);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingAsset) return;

    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const alt = formData.get("alt") as string;
    const cat = formData.get("category") as string;
    const tags = (formData.get("tags") as string)
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const result = await updateMediaAsset({
      id: editingAsset.id,
      title: title || null,
      alt: alt || null,
      category: cat,
      tags,
      featured: editingAsset.featured,
    });

    if (!result.success || !result.data) {
      let msg = "Failed to update media asset";
      if (!result.success) {
        if ("error" in result && typeof result.error === "string") msg = result.error;
        else if ("errors" in result) msg = "Please fix validation errors and try again.";
      }
      toast.error(msg);
      setSaving(false);
      return;
    }

    const orderedKeys = MEDIA_LOCATIONS.map((l) =>
      locationKey(l.pageSlug, l.sectionSlug),
    ).filter((k) => placementKeys.has(k));

    if (orderedKeys.length === 0) {
      toast.error("Select at least one placement.");
      setSaving(false);
      return;
    }

    const locPayload = orderedKeys.map((k, i) => {
      const sep = k.indexOf(":");
      return {
        pageSlug: k.slice(0, sep),
        sectionSlug: k.slice(sep + 1),
        isPrimary: i === 0,
        order: i,
      };
    });

    const locResult = await updateMediaAssetLocations(editingAsset.id, locPayload);
    if (!locResult.success) {
      toast.error(
        "error" in locResult && typeof locResult.error === "string"
          ? locResult.error
          : "Failed to update placements",
      );
      setSaving(false);
      return;
    }

    setEditingAsset(null);
    await queryClient.invalidateQueries({ queryKey: queryKeys.adminMediaLibrary() });
    toast.success("Asset updated.");
    setSaving(false);
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="space-y-6">
      {isFetching ? (
        <p className="text-xs text-[var(--color-muted)]" aria-live="polite">
          Updating library…
        </p>
      ) : null}
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
          <p className="text-sm font-medium text-[var(--color-primary)]">Drop files here</p>
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

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 p-3">
          <button
            onClick={selectAll}
            className="flex items-center gap-2 text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)]"
          >
            {selectedIds.size === filtered.length ? (
              <>
                <CheckSquare className="h-4 w-4" /> Deselect All
              </>
            ) : (
              <>
                <Square className="h-4 w-4" /> Select All
              </>
            )}
          </button>
          <span className="text-xs text-[var(--color-muted)]">
            {selectedIds.size} selected
          </span>
          <div className="ml-auto flex items-center gap-2">
            <select
              value={bulkCategory}
              onChange={(e) => setBulkCategory(e.target.value)}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-1.5 text-sm outline-none focus:border-[var(--color-primary)]"
            >
              <option value="">Recategorize...</option>
              {CATEGORIES.filter((c) => c !== "all").map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}
                </option>
              ))}
            </select>
            <button
              onClick={handleBulkRecategorize}
              disabled={!bulkCategory}
              className="rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
            >
              Apply
            </button>
            <button
              onClick={handleBulkDelete}
              className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600"
            >
              Delete ({selectedIds.size})
            </button>
          </div>
        </div>
      )}

      {/* Grid / List */}
      {view === "grid" ? (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              className={`group relative overflow-hidden rounded-xl border bg-[var(--color-surface)] ${
                selectedIds.has(asset.id)
                  ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20"
                  : "border-[var(--color-border)]"
              }`}
            >
              {/* Checkbox */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleSelect(asset.id); }}
                className="absolute left-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded bg-black/50 text-white hover:bg-black/70"
                aria-label={`Select ${asset.title ?? "asset"}`}
              >
                {selectedIds.has(asset.id) ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Square className="h-3 w-3" />
                )}
              </button>

              <div
                className="relative aspect-square cursor-pointer"
                onClick={() => setEditingAsset(asset)}
              >
                <Image
                  src={asset.url}
                  alt={asset.alt ?? asset.title ?? "Media"}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/30 group-hover:opacity-100">
                  <Edit2 className="h-6 w-6 text-white drop-shadow-md" />
                </div>
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-medium text-[var(--color-foreground)]">
                  {asset.title ?? "Untitled"}
                </p>
                <p className="text-xs text-[var(--color-muted)]">
                  {asset.category}
                  {asset.locations?.length ? (
                    <span className="block truncate opacity-80">
                      {(asset.locations ?? [])
                        .map((l) => `${l.pageSlug}/${l.sectionSlug}`)
                        .join(" · ")}
                    </span>
                  ) : null}
                </p>
              </div>
              {/* Delete overlay */}
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(asset.id); }}
                className="absolute right-2 top-2 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
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
              className={`group flex items-center gap-4 rounded-xl border bg-[var(--color-surface)] p-3 cursor-pointer hover:border-[var(--color-primary)]/50 transition-colors ${
                selectedIds.has(asset.id) ? "border-[var(--color-primary)]" : "border-[var(--color-border)]"
              }`}
              onClick={() => setEditingAsset(asset)}
            >
              {/* Checkbox */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleSelect(asset.id); }}
                className="shrink-0 flex h-5 w-5 items-center justify-center rounded border border-[var(--color-border)] hover:border-[var(--color-primary)]"
                aria-label={`Select ${asset.title ?? "asset"}`}
              >
                {selectedIds.has(asset.id) ? (
                  <Check className="h-3 w-3 text-[var(--color-primary)]" />
                ) : null}
              </button>

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
                  {asset.locations?.length ? (
                    <span className="block truncate opacity-80">
                      {(asset.locations ?? [])
                        .map((l) => `${l.pageSlug}/${l.sectionSlug}`)
                        .join(" · ")}
                    </span>
                  ) : null}
                </p>
              </div>
              <div className="flex items-center">
                <button
                  onClick={(e) => { e.stopPropagation(); setEditingAsset(asset); }}
                  className="cursor-pointer rounded-lg p-2 text-[var(--color-muted)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Edit asset"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(asset.id); }}
                  className="cursor-pointer rounded-lg p-2 text-[var(--color-muted)] hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Delete ${asset.title ?? "asset"}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl max-h-[90vh] bg-[var(--color-background)] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
            {/* Image Preview Side */}
            <div className="w-full md:w-1/2 bg-[var(--color-surface)] p-6 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-[var(--color-border)]">
              <div className="relative w-full aspect-square max-h-[50vh] rounded-xl overflow-hidden border border-[var(--color-border)] shadow-inner">
                <Image
                  src={editingAsset.url}
                  alt={editingAsset.alt ?? "Preview"}
                  fill
                  className="object-contain bg-black/5"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="mt-4 w-full">
                <div className="flex items-center justify-between bg-[var(--color-background)] p-3 rounded-lg border border-[var(--color-border)]">
                  <p className="text-xs text-[var(--color-muted)] truncate max-w-[80%]">{editingAsset.url}</p>
                  <button
                    onClick={() => copyToClipboard(editingAsset.url)}
                    className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-primary)] bg-[var(--color-surface)] rounded-md transition-colors"
                    title="Copy URL"
                  >
                    {copiedUrl ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <div className="mt-2 text-xs text-[var(--color-muted)] flex justify-between">
                  <span>Type: {editingAsset.type}</span>
                  <span>{editingAsset.width}x{editingAsset.height}</span>
                </div>
                {editingAsset.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {editingAsset.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-[var(--color-primary)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--color-primary)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Form Side */}
            <div className="w-full md:w-1/2 p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[var(--color-foreground)]">Edit Asset</h3>
                <button
                  onClick={() => setEditingAsset(null)}
                  className="p-2 rounded-full hover:bg-[var(--color-surface)] text-[var(--color-muted)] transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-5">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-[var(--color-foreground)] mb-1">
                    Internal Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    defaultValue={editingAsset.title || ""}
                    placeholder="e.g., Master Bedroom Angle 1"
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label htmlFor="alt" className="block text-sm font-medium text-[var(--color-foreground)] mb-1">
                    Alt Text (SEO & Accessibility)
                  </label>
                  <textarea
                    id="alt"
                    name="alt"
                    defaultValue={editingAsset.alt || ""}
                    placeholder="e.g., View of the master bedroom featuring a king size bed and lagoon views"
                    rows={3}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-[var(--color-foreground)] mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    id="tags"
                    name="tags"
                    defaultValue={editingAsset.tags.join(", ")}
                    placeholder="e.g., hero, featured, bedroom"
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-[var(--color-foreground)] mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    defaultValue={editingAsset.category}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] appearance-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <fieldset className="space-y-2">
                  <legend className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
                    Page placements
                  </legend>
                  <p className="text-xs text-[var(--color-muted)] mb-2">
                    First checked slot (in list order) is treated as primary for legacy fields.
                  </p>
                  <div className="max-h-40 space-y-2 overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                    {MEDIA_LOCATIONS.map((loc) => {
                      const key = locationKey(loc.pageSlug, loc.sectionSlug);
                      const checked = placementKeys.has(key);
                      return (
                        <label
                          key={key}
                          className="flex cursor-pointer items-start gap-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => togglePlacement(loc.pageSlug, loc.sectionSlug)}
                            className="mt-0.5 rounded border-[var(--color-border)]"
                          />
                          <span>
                            <span className="font-medium text-[var(--color-foreground)]">
                              {loc.label}
                            </span>
                            {loc.hasLimit != null ? (
                              <span className="block text-[10px] text-[var(--color-muted)]">
                                Suggested max {loc.hasLimit}
                              </span>
                            ) : null}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--color-border)]">
                  <button
                    type="button"
                    onClick={() => handleDelete(editingAsset.id)}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                  >
                    Delete Asset
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingAsset(null)}
                    className="px-4 py-2 text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-surface)] rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 rounded-xl transition-colors disabled:opacity-70 flex items-center gap-2"
                  >
                    {saving && <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        title={confirmAction === "delete" ? "Delete Asset" : "Bulk Delete Assets"}
        description={
          confirmAction === "delete"
            ? "Are you sure you want to delete this asset permanently? This action cannot be undone."
            : `Are you sure you want to delete ${selectedIds.size} assets permanently? This action cannot be undone.`
        }
        confirmText="Delete"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => { setConfirmOpen(false); setConfirmAction(null); }}
      />
    </div>
  );
}
