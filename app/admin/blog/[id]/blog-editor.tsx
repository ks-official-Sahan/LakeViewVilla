"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createBlogPost,
  updateBlogPost,
  publishBlogPost,
  enrichBlogPostSeo,
  suggestSeoFromDraft,
} from "@/lib/admin/actions";
import { normalizeBlogSlug } from "@/lib/utils/blog-slug";
import { toast } from "sonner";
import {
  Sparkles, Save, Send, Loader2, Undo2, Redo2, Clock,
  ImageIcon,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarkdownPreview } from "@/components/admin/markdown-preview";
import { MediaPickerModal } from "@/components/admin/media-picker-modal";
import { BlogTipTapEditor } from "@/components/admin/BlogTipTapEditor";
import { SEOPreview } from "@/components/admin/SEOPreview";
import Image from "next/image";

interface InitialPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: string;
  seoTitle: string | null;
  seoDescription: string | null;
  generatedByAI: boolean;
  publishAt?: string | null;
  featuredImageId?: string | null;
  featuredImageUrl?: string | null;
  /** ISO timestamp — local draft recovery compares against `savedAt`. */
  updatedAt?: string | null;
}

interface BlogEditorProps {
  initialPost: InitialPost | null;
  isNew: boolean;
}

type BlogEditorFormData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: string;
  seoTitle: string;
  seoDescription: string;
  publishAt: string;
  featuredImageId: string;
  featuredImageUrl: string;
};

const MAX_HISTORY = 50;

function draftStorageKey(isNew: boolean, postId?: string | null) {
  const id = isNew ? "new" : (postId ?? "new");
  return `lvv-blog-draft-v1:${id}`;
}

function snapshotFromPost(initialPost: InitialPost | null) {
  return JSON.stringify({
    title: initialPost?.title || "",
    slug: initialPost?.slug || "",
    excerpt: initialPost?.excerpt || "",
    content: initialPost?.content || "",
    status: initialPost?.status || "DRAFT",
    seoTitle: initialPost?.seoTitle || "",
    seoDescription: initialPost?.seoDescription || "",
    publishAt: initialPost?.publishAt || "",
    featuredImageId: initialPost?.featuredImageId ?? "",
    featuredImageUrl: initialPost?.featuredImageUrl ?? "",
  });
}

/** Parses legacy AI responses that wrapped YAML frontmatter inside `content`. */
function parseLegacyAiMarkdownBody(raw: string): {
  title?: string;
  excerpt?: string;
  body: string;
} {
  let body = raw.trim();
  let title: string | undefined;
  let excerpt: string | undefined;

  if (body.startsWith("---")) {
    const parts = body.split("---");
    if (parts.length >= 3) {
      const frontmatter = parts[1];
      body = parts.slice(2).join("---").trim();
      const quotedTitle = frontmatter.match(/title:\s*"([^"]+)"/);
      const singleTitle = frontmatter.match(/title:\s*'([^']+)'/);
      const bareTitle = frontmatter.match(/title:\s*([^\n]+)/);
      const quotedExcerpt = frontmatter.match(/excerpt:\s*"([^"]+)"/);
      const singleExcerpt = frontmatter.match(/excerpt:\s*'([^']+)'/);
      const bareExcerpt = frontmatter.match(/excerpt:\s*([^\n]+)/);

      if (quotedTitle) title = quotedTitle[1];
      else if (singleTitle) title = singleTitle[1];
      else if (bareTitle) title = bareTitle[1].trim();

      if (quotedExcerpt) excerpt = quotedExcerpt[1];
      else if (singleExcerpt) excerpt = singleExcerpt[1];
      else if (bareExcerpt) excerpt = bareExcerpt[1].trim().replace(/^["']|["']$/g, "");
    }
  }

  return { title, excerpt, body };
}

async function consumeBlogGenerateSse(res: Response): Promise<{
  title: string;
  excerpt: string;
  content: string;
  model?: string;
}> {
  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let sep: number;
    while ((sep = buffer.indexOf("\n\n")) !== -1) {
      const block = buffer.slice(0, sep);
      buffer = buffer.slice(sep + 2);

      for (const line of block.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const raw = trimmed.slice(5).trim();
        if (raw === "[DONE]") continue;

        try {
          const j = JSON.parse(raw) as Record<string, unknown>;
          if (j.type === "error") {
            throw new Error(String(j.message ?? "Generation failed"));
          }
          if (j.type === "done") {
            const title = typeof j.title === "string" ? j.title.trim() : "";
            const excerpt = typeof j.excerpt === "string" ? j.excerpt.trim() : "";
            const content = typeof j.content === "string" ? j.content.trim() : "";
            if (!title || !content) throw new Error("Incomplete AI payload");
            return {
              title,
              excerpt,
              content,
              ...(typeof j.model === "string" ? { model: j.model } : {}),
            };
          }
        } catch (e) {
          if (e instanceof SyntaxError) continue;
          throw e;
        }
      }
    }
  }

  throw new Error("Stream ended without a complete draft");
}

export function BlogEditor({ initialPost, isNew }: BlogEditorProps) {
  const router = useRouter();
  const slugTouchedRef = useRef(false);
  const storageKey = draftStorageKey(isNew, initialPost?.id);
  const serverSnapRef = useRef(snapshotFromPost(initialPost));
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [suggestSeoBusy, setSuggestSeoBusy] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiImageNotes, setAiImageNotes] = useState("");
  const [aiTone, setAiTone] = useState("professional");
  const [aiLength, setAiLength] = useState<"short" | "medium" | "long">("medium");
  const [bodyTab, setBodyTab] = useState<"visual" | "markdown">("visual");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [recoverDraft, setRecoverDraft] = useState<BlogEditorFormData | null>(null);

  const [hist, setHist] = useState(() => ({
    snapshots: [snapshotFromPost(initialPost)],
    index: 0,
  }));

  const [formData, setFormData] = useState<BlogEditorFormData>({
    title: initialPost?.title || "",
    slug: initialPost?.slug || "",
    excerpt: initialPost?.excerpt || "",
    content: initialPost?.content || "",
    status: initialPost?.status || "DRAFT",
    seoTitle: initialPost?.seoTitle || "",
    seoDescription: initialPost?.seoDescription || "",
    publishAt: initialPost?.publishAt || "",
    featuredImageId: initialPost?.featuredImageId ?? "",
    featuredImageUrl: initialPost?.featuredImageUrl ?? "",
  });

  const clearLocalDraft = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  const parseHistorySnapshot = (raw: string): BlogEditorFormData => {
    const data = JSON.parse(raw) as Partial<BlogEditorFormData>;
    return {
      title: data.title ?? "",
      slug: data.slug ?? "",
      excerpt: data.excerpt ?? "",
      content: data.content ?? "",
      status: data.status ?? "DRAFT",
      seoTitle: data.seoTitle ?? "",
      seoDescription: data.seoDescription ?? "",
      publishAt: data.publishAt ?? "",
      featuredImageId: data.featuredImageId ?? "",
      featuredImageUrl: data.featuredImageUrl ?? "",
    };
  };

  const pushHistory = useCallback((newData: BlogEditorFormData) => {
    const snap = JSON.stringify(newData);
    setHist((h) => {
      const cut = h.snapshots.slice(0, h.index + 1);
      let snapshots = [...cut, snap];
      let index = snapshots.length - 1;
      if (snapshots.length > MAX_HISTORY) {
        const overflow = snapshots.length - MAX_HISTORY;
        snapshots = snapshots.slice(overflow);
        index = snapshots.length - 1;
      }
      return { snapshots, index };
    });
  }, []);

  const undo = () => {
    setHist((h) => {
      if (h.index <= 0) return h;
      const idx = h.index - 1;
      const nextForm = parseHistorySnapshot(h.snapshots[idx]);
      setFormData(nextForm);
      return { ...h, index: idx };
    });
  };

  const redo = () => {
    setHist((h) => {
      if (h.index >= h.snapshots.length - 1) return h;
      const idx = h.index + 1;
      const nextForm = parseHistorySnapshot(h.snapshots[idx]);
      setFormData(nextForm);
      return { ...h, index: idx };
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        payload?: BlogEditorFormData;
      };
      if (!parsed.payload) return;
      const candidate = JSON.stringify(parsed.payload);
      if (candidate === serverSnapRef.current) return;
      setRecoverDraft(parsed.payload);
    } catch {
      /* ignore corrupt draft */
    }
  }, [storageKey]);

  const handleSaveRef = useRef<(publish?: boolean, isAutoSave?: boolean) => Promise<void>>(
    async () => {},
  );

  const handleSave = async (publish = false, isAutoSave = false) => {
    if (!formData.title || !formData.slug || !formData.content) {
      if (!isAutoSave) toast.error("Title, slug, and content are required.");
      return;
    }

    setSaving(true);
    try {
      let postId: string | undefined = initialPost?.id;

      if (isNew && !postId) {
        const post = await createBlogPost({
          ...formData,
          featuredImageId: formData.featuredImageId || undefined,
          generatedByAI: !!aiPrompt,
        });
        postId = post.id;
      } else if (postId) {
        await updateBlogPost(postId, {
          ...formData,
          featuredImageId: formData.featuredImageId,
        });
      }

      const needsSeo =
        !formData.excerpt?.trim() ||
        !formData.seoTitle?.trim() ||
        !formData.seoDescription?.trim();

      if (postId && needsSeo) {
        void enrichBlogPostSeo(postId)
          .then((updated) => {
            setFormData((prev) => ({
              ...prev,
              excerpt:
                updated.excerpt?.trim() ? (updated.excerpt ?? prev.excerpt) : prev.excerpt,
              seoTitle:
                updated.seoTitle?.trim() ? (updated.seoTitle ?? prev.seoTitle) : prev.seoTitle,
              seoDescription:
                updated.seoDescription?.trim()
                  ? (updated.seoDescription ?? prev.seoDescription)
                  : prev.seoDescription,
            }));
          })
          .catch(() => {
            if (!isAutoSave) {
              toast.error("Could not auto-fill SEO fields. You can edit them manually.");
            }
          });
      }

      if (publish && formData.status !== "PUBLISHED" && postId) {
        await publishBlogPost(postId, formData.publishAt || undefined);
      }

      if (!isAutoSave) {
        toast.success(publish ? "Post published." : "Post saved.");
      }
      setLastSaved(new Date());
      clearLocalDraft();
      setRecoverDraft(null);

      if (isNew && postId) {
        router.push(`/admin/blog/${postId}`);
      } else {
        router.refresh();
      }
    } catch (err: unknown) {
      if (!isAutoSave) {
        toast.error(err instanceof Error ? err.message : "Failed to save post");
      }
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    handleSaveRef.current = handleSave;
  });

  // Auto-save (debounced 30s)
  const debouncedSave = useCallback(() => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      if (formData.title && formData.slug && formData.content) {
        void handleSaveRef.current(false, true);
      }
    }, 30000);
  }, [formData.title, formData.slug, formData.content]);

  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = window.setTimeout(() => {
      const meaningful =
        formData.title.trim().length > 0 || formData.content.trim().length > 40;
      if (!meaningful) return;
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            savedAt: new Date().toISOString(),
            serverBaseline: initialPost?.updatedAt ?? null,
            payload: formData,
          }),
        );
      } catch {
        /* quota */
      }
    }, 2000);
    return () => window.clearTimeout(t);
  }, [formData, storageKey, initialPost?.updatedAt]);

  const mergeAiPayload = (
    data: { title?: string; excerpt?: string; content?: string },
  ): BlogEditorFormData => {
    let newContent = "";
    let newTitle = formData.title;
    let newExcerpt = formData.excerpt;

    if (
      typeof data.title === "string" &&
      typeof data.content === "string" &&
      data.content.trim()
    ) {
      newTitle = data.title.trim() || newTitle;
      newExcerpt =
        typeof data.excerpt === "string" && data.excerpt.trim()
          ? data.excerpt.trim()
          : newExcerpt;
      newContent = data.content.trim();
    } else if (typeof data.content === "string" && data.content.trim()) {
      const legacy = parseLegacyAiMarkdownBody(data.content);
      newContent = legacy.body;
      if (legacy.title) newTitle = legacy.title;
      if (legacy.excerpt) newExcerpt = legacy.excerpt;
    } else {
      throw new Error("Unexpected AI response shape");
    }

    const slugFromTitle = newTitle ? normalizeBlogSlug(newTitle) : "";

    return {
      ...formData,
      content: newContent,
      title: newTitle || formData.title,
      excerpt: newExcerpt || formData.excerpt,
      slug: formData.slug.trim() ? formData.slug : slugFromTitle || formData.slug,
    };
  };

  const handleGenerateAI = async () => {
    if (!aiPrompt) {
      toast.error("Enter a prompt for the AI.");
      return;
    }
    setGenerating(true);
    const toastId = toast.loading("Streaming draft from OpenRouter…");
    const genBody = JSON.stringify({
      prompt: aiPrompt,
      tone: aiTone,
      length: aiLength,
      imageDescription: aiImageNotes,
      featuredImageUrl: formData.featuredImageUrl,
    });

    try {
      let merged: BlogEditorFormData;

      const streamRes = await fetch("/api/admin/blog/generate/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        credentials: "same-origin",
        body: genBody,
      });

      const ct = streamRes.headers.get("content-type") ?? "";

      if (streamRes.ok && ct.includes("text/event-stream")) {
        const payload = await consumeBlogGenerateSse(streamRes);
        merged = mergeAiPayload(payload);
      } else {
        if (!streamRes.ok && ct.includes("application/json")) {
          const errJson = (await streamRes.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(errJson.error || `Generation failed (${streamRes.status})`);
        }

        const res = await fetch("/api/admin/blog/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: genBody,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to generate");
        merged = mergeAiPayload(data);
      }

      setFormData(merged);
      pushHistory(merged);
      if (merged.slug.trim()) slugTouchedRef.current = true;
      setBodyTab("visual");
      toast.success("Draft generated — save to persist, or refine in the editor.", {
        id: toastId,
      });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Generation failed", { id: toastId });
    } finally {
      setGenerating(false);
    }
  };

  const handleSuggestSeo = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Add a title and body before suggesting SEO.");
      return;
    }
    setSuggestSeoBusy(true);
    try {
      const seo = await suggestSeoFromDraft({
        title: formData.title,
        content: formData.content,
      });
      const merged: BlogEditorFormData = {
        ...formData,
        seoTitle: seo.seoTitle,
        seoDescription: seo.seoDescription,
        excerpt: formData.excerpt?.trim()
          ? formData.excerpt
          : seo.excerptHint.slice(0, 500),
      };
      setFormData(merged);
      pushHistory(merged);
      toast.success("SEO fields updated — review before publishing.");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Could not suggest SEO");
    } finally {
      setSuggestSeoBusy(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    const nextValue =
      field === "slug"
        ? normalizeBlogSlug(value)
        : value;

    const newData = { ...formData, [field]: nextValue };
    setFormData(newData);

    if (field === "slug") {
      slugTouchedRef.current = true;
    }

    pushHistory(newData);
    debouncedSave();
  };

  const handleTitleBlur = () => {
    if (!slugTouchedRef.current && formData.title.trim()) {
      setFormData((prev) => ({
        ...prev,
        slug: normalizeBlogSlug(prev.title),
      }));
    }
  };

  return (
    <>
      {recoverDraft && (
        <div
          role="status"
          className="rounded-xl border border-amber-300/80 bg-amber-500/10 px-4 py-3 text-sm text-[var(--color-foreground)]"
        >
          <p className="font-medium">Local draft found</p>
          <p className="mt-1 text-[var(--color-muted)]">
            A recovered autosave differs from the last server version. Restore it or discard to continue.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              onClick={() => {
                const restored = recoverDraft;
                setFormData(restored);
                setHist({
                  snapshots: [JSON.stringify(restored)],
                  index: 0,
                });
                setRecoverDraft(null);
                toast.success("Local draft restored — undo is available if needed.");
              }}
            >
              Restore draft
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                clearLocalDraft();
                setRecoverDraft(null);
              }}
            >
              Discard
            </Button>
          </div>
        </div>
      )}
      <MediaPickerModal
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        filterType="IMAGE"
        title="Featured image"
        onSelect={(asset) => {
          const newData = {
            ...formData,
            featuredImageId: asset.id,
            featuredImageUrl: asset.url,
          };
          setFormData(newData);
          pushHistory(newData);
        }}
      />
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {/* Main Editor */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <input
              type="text"
              data-testid="blog-editor-title"
              placeholder="Post Title..."
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              onBlur={handleTitleBlur}
              className="flex-1 text-3xl font-bold bg-transparent outline-none placeholder:text-[var(--color-muted)] text-[var(--color-foreground)]"
            />
            <div className="flex gap-2 ml-4">
              <button
                type="button"
                onClick={undo}
                disabled={hist.snapshots.length === 0 || hist.index <= 0}
                className="p-2 rounded-lg hover:bg-[var(--color-background)] text-[var(--color-muted)] disabled:opacity-30"
                aria-label="Undo"
              >
                <Undo2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={redo}
                disabled={
                  hist.snapshots.length === 0 ||
                  hist.index >= hist.snapshots.length - 1
                }
                className="p-2 rounded-lg hover:bg-[var(--color-background)] text-[var(--color-muted)] disabled:opacity-30"
                aria-label="Redo"
              >
                <Redo2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-[var(--color-muted)]">lakeviewvillatangalle.com/blog/</span>
            <input
              type="text"
              data-testid="blog-editor-slug"
              placeholder="post-slug"
              value={formData.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              className="flex-1 bg-transparent outline-none text-[var(--color-primary)] font-mono"
            />
          </div>

          <div className="flex min-h-[520px] flex-col overflow-hidden rounded-xl border border-[var(--color-border)] lg:grid lg:min-h-[560px] lg:grid-cols-2 lg:divide-x lg:divide-[var(--color-border)]">
            <div className="flex min-h-[260px] flex-1 flex-col border-b border-[var(--color-border)] lg:min-h-0 lg:border-b-0">
              <div className="flex flex-wrap items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2">
                <span className="text-xs font-medium text-[var(--color-muted)]">Body</span>
                <div className="ml-auto flex rounded-lg border border-[var(--color-border)] p-0.5">
                  <button
                    type="button"
                    onClick={() => setBodyTab("visual")}
                    className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                      bodyTab === "visual"
                        ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                        : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                    }`}
                  >
                    Visual
                  </button>
                  <button
                    type="button"
                    onClick={() => setBodyTab("markdown")}
                    className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                      bodyTab === "markdown"
                        ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                        : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                    }`}
                  >
                    Markdown
                  </button>
                </div>
              </div>
              {bodyTab === "visual" ? (
                <BlogTipTapEditor
                  markdown={formData.content}
                  onMarkdownChange={(md) => handleChange("content", md)}
                  placeholder="Write your post — headings, lists, links, and images."
                />
              ) : (
                <textarea
                  data-testid="blog-editor-markdown"
                  placeholder="Write or paste Markdown…"
                  value={formData.content}
                  onChange={(e) => handleChange("content", e.target.value)}
                  className="min-h-[420px] w-full flex-1 resize-none bg-[var(--color-surface)] p-4 font-mono text-sm leading-relaxed text-[var(--color-foreground)] outline-none"
                  spellCheck={false}
                />
              )}
            </div>
            <div className="flex min-h-[260px] flex-1 flex-col bg-[var(--color-background)] lg:min-h-0">
              <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-3 py-2">
                <span className="px-1 text-xs font-medium text-[var(--color-muted)]">Live preview</span>
              </div>
              <div className="custom-scrollbar min-h-0 flex-1 overflow-auto p-4">
                <MarkdownPreview markdown={formData.content} />
              </div>
            </div>
          </div>

          {lastSaved && (
            <p className="text-xs text-[var(--color-muted)] text-right">
              Auto-saved at {lastSaved.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* AI Generation Tool */}
        <div className="rounded-2xl border border-[var(--color-gold)]/20 bg-gradient-to-br from-[var(--color-gold)]/5 to-amber-500/5 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[var(--color-gold)]" />
            <h3 className="font-semibold text-[var(--color-foreground)]">AI Assistant</h3>
          </div>
          <p className="text-sm text-[var(--color-muted)]">
            Describe what you want to write about. The assistant streams from OpenRouter (SSE), then parses JSON into the Visual editor. Optional notes below fold in your featured image context.
          </p>
          <div className="flex flex-wrap gap-3">
            <label className="flex flex-col gap-1 text-xs font-medium text-[var(--color-muted)]">
              Tone
              <select
                value={aiTone}
                onChange={(e) => setAiTone(e.target.value)}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-foreground)]"
              >
                <option value="professional">Professional</option>
                <option value="warm">Warm & inviting</option>
                <option value="playful">Playful</option>
                <option value="minimal">Minimal</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-[var(--color-muted)]">
              Length
              <select
                value={aiLength}
                onChange={(e) => setAiLength(e.target.value as "short" | "medium" | "long")}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-foreground)]"
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </label>
          </div>
          <label className="flex flex-col gap-1 text-xs font-medium text-[var(--color-muted)]">
            Featured image / hero scene (optional)
            <textarea
              placeholder="Short visual notes for the model (e.g. infinity pool at sunset, coconut palms)…"
              value={aiImageNotes}
              onChange={(e) => setAiImageNotes(e.target.value)}
              className="min-h-[52px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm text-[var(--color-foreground)] outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]"
            />
          </label>
          <div className="flex gap-3">
            <textarea
              placeholder="E.g., Write a 500-word post about the top 5 beaches near Tangalle..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] resize-none h-20"
            />
            <Button
              onClick={handleGenerateAI}
              disabled={generating}
              className="bg-[var(--color-gold)] hover:bg-[var(--color-gold)]/90 text-white h-20 px-6 rounded-xl shrink-0"
            >
              {generating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <div className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-[var(--color-primary)]" />
            <h3 className="font-semibold text-[var(--color-foreground)]">Featured image</h3>
          </div>
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]">
            {formData.featuredImageUrl ? (
              <Image
                src={formData.featuredImageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 400px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-[var(--color-muted)]">
                No image selected
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setMediaPickerOpen(true)}>
              Choose from library
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!formData.featuredImageId}
              onClick={() => {
                const newData = { ...formData, featuredImageId: "", featuredImageUrl: "" };
                setFormData(newData);
                pushHistory(newData);
              }}
              className="text-red-600 hover:bg-red-500/10"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>

        {/* Publishing */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-[var(--color-foreground)]">Publishing</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-muted)]">Status</span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              formData.status === "PUBLISHED" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
            }`}>
              {formData.status}
            </span>
          </div>

          {/* Publish Scheduling */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">
              <Clock className="inline h-3 w-3 mr-1" /> Schedule Publish (Optional)
            </label>
            <input
              type="datetime-local"
              value={formData.publishAt}
              onChange={(e) => handleChange("publishAt", e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-2 text-sm outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="flex flex-col gap-3">
            <Button
              data-testid="blog-editor-save"
              onClick={() => handleSave(false)}
              disabled={saving}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" /> Save Draft
            </Button>
            <Button
              data-testid="blog-editor-publish"
              onClick={() => handleSave(true)}
              disabled={saving || formData.status === "PUBLISHED"}
              className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90"
            >
              <Send className="h-4 w-4" /> {formData.status === "PUBLISHED" ? "Update Post" : "Publish Now"}
            </Button>
          </div>
        </div>

        {/* SEO & Metadata */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold text-[var(--color-foreground)]">SEO & Metadata</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={suggestSeoBusy || !formData.title.trim() || !formData.content.trim()}
              onClick={() => void handleSuggestSeo()}
            >
              {suggestSeoBusy ? (
                <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="mr-1 h-3.5 w-3.5 text-[var(--color-gold)]" />
              )}
              Suggest from content
            </Button>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">Excerpt (Short Summary)</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => handleChange("excerpt", e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-2.5 text-sm outline-none focus:border-[var(--color-primary)] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">SEO Title</label>
            <input
              type="text"
              value={formData.seoTitle}
              onChange={(e) => handleChange("seoTitle", e.target.value)}
              placeholder="Defaults to Post Title"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-2.5 text-sm outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">SEO Description</label>
            <textarea
              value={formData.seoDescription}
              onChange={(e) => handleChange("seoDescription", e.target.value)}
              placeholder="Defaults to Excerpt"
              rows={2}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-2.5 text-sm outline-none focus:border-[var(--color-primary)] resize-none"
            />
          </div>

          <div className="border-t border-[var(--color-border)] pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              SERP & social preview
            </p>
            <SEOPreview
              title={
                formData.seoTitle?.trim() ||
                formData.title?.trim() ||
                "Untitled post"
              }
              description={
                formData.seoDescription?.trim() ||
                formData.excerpt?.trim() ||
                ""
              }
              slug={formData.slug}
              imageUrl={formData.featuredImageUrl || undefined}
            />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
