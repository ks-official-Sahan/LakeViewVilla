"use client";

import { useCallback, useState } from "react";
import { Upload, Link, X, Loader2, ImageIcon, FileVideo, File } from "lucide-react";
import Image from "next/image";

export interface UploadedFile {
  url: string;
  publicId?: string;
  type: "image" | "video" | "document";
  name: string;
  size: number;
}

interface MediaUploaderProps {
  onUpload: (files: UploadedFile[]) => void;
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  label?: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

function fileType(file: File): UploadedFile["type"] {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "document";
}

function FileIcon({ type }: { type: UploadedFile["type"] }) {
  if (type === "image") return <ImageIcon className="h-5 w-5 text-teal-500" />;
  if (type === "video") return <FileVideo className="h-5 w-5 text-purple-500" />;
  return <File className="h-5 w-5 text-blue-500" />;
}

export function MediaUploader({
  onUpload,
  accept = "image/*,video/mp4,video/webm,.pdf",
  maxSizeMB = 10,
  multiple = true,
  label = "Upload Media",
}: MediaUploaderProps) {
  const [dragging, setDragging] = useState(false);
  const [previews, setPreviews] = useState<Array<{ file: File; preview: string | null; progress: number; done: boolean; error?: string }>>([]);
  const [urlInput, setUrlInput] = useState("");
  const [urlLoading, setUrlLoading] = useState(false);

  const maxBytes = maxSizeMB * 1024 * 1024;

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const valid = Array.from(files).filter((f) => {
        if (f.size > maxBytes) return false;
        return true;
      });

      valid.forEach((file) => {
        const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
        const entry = { file, preview, progress: 0, done: false };

        setPreviews((prev) => [...prev, entry]);

        // Simulate upload (replace with real Cloudinary/upload call)
        const formData = new FormData();
        formData.append("file", file);

        fetch("/api/upload", { method: "POST", body: formData })
          .then(async (res) => {
            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            setPreviews((prev) =>
              prev.map((p) =>
                p.file === file ? { ...p, progress: 100, done: true } : p
              )
            );
            onUpload([
              {
                url: data.url,
                publicId: data.publicId,
                type: fileType(file),
                name: file.name,
                size: file.size,
              },
            ]);
          })
          .catch(() => {
            setPreviews((prev) =>
              prev.map((p) =>
                p.file === file ? { ...p, error: "Upload failed", done: true } : p
              )
            );
          });
      });
    },
    [maxBytes, onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleUrlFetch = async () => {
    if (!urlInput.trim()) return;
    setUrlLoading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput.trim() }),
      });
      if (!res.ok) throw new Error("URL fetch failed");
      const data = await res.json();
      onUpload([{ url: data.url, publicId: data.publicId, type: "image", name: urlInput, size: 0 }]);
      setUrlInput("");
    } catch {
      // silently ignore — in production show a toast
    } finally {
      setUrlLoading(false);
    }
  };

  const removePreview = (index: number) => {
    setPreviews((prev) => {
      const item = prev[index];
      if (item.preview) URL.revokeObjectURL(item.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label={label}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onKeyDown={(e) => e.key === "Enter" && document.getElementById("media-file-input")?.click()}
        className={`relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed transition-all ${
          dragging
            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
            : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-primary)]/5"
        }`}
        onClick={() => document.getElementById("media-file-input")?.click()}
      >
        <input
          id="media-file-input"
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => e.target.files && processFiles(e.target.files)}
        />
        <Upload className={`h-8 w-8 transition ${dragging ? "text-[var(--color-primary)]" : "text-[var(--color-muted)]"}`} />
        <div className="text-center">
          <p className="text-sm font-medium text-[var(--color-foreground)]">
            Drop files here or <span className="text-[var(--color-primary)]">browse</span>
          </p>
          <p className="mt-0.5 text-xs text-[var(--color-muted)]">
            Max {maxSizeMB}MB per file · {accept}
          </p>
        </div>
      </div>

      {/* URL Upload */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            type="url"
            placeholder="Paste image URL…"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUrlFetch()}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-2 pl-9 pr-4 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
        </div>
        <button
          onClick={handleUrlFetch}
          disabled={!urlInput.trim() || urlLoading}
          className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
        >
          {urlLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Fetch"}
        </button>
      </div>

      {/* Preview List */}
      {previews.length > 0 && (
        <ul className="space-y-2">
          {previews.map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2"
            >
              {item.preview ? (
                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image src={item.preview} alt={item.file.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--color-background)]">
                  <FileIcon type={fileType(item.file)} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--color-foreground)]">{item.file.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--color-muted)]">{formatBytes(item.file.size)}</span>
                  {item.error ? (
                    <span className="text-xs text-red-500">{item.error}</span>
                  ) : item.done ? (
                    <span className="text-xs text-emerald-500">Uploaded</span>
                  ) : (
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--color-border)]">
                      <div
                        className="h-full rounded-full bg-[var(--color-primary)] transition-all"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => removePreview(i)}
                aria-label="Remove file"
                className="flex-shrink-0 rounded-lg p-1 text-[var(--color-muted)] transition hover:bg-[var(--color-border)]/30 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
