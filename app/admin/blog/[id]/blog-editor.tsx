"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBlogPost, updateBlogPost, publishBlogPost, enrichBlogPostSeo } from "@/lib/admin/actions";
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
}

interface BlogEditorProps {
  initialPost: InitialPost | null;
  isNew: boolean;
}

const MAX_HISTORY = 50;

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

export function BlogEditor({ initialPost, isNew }: BlogEditorProps) {
  const router = useRouter();
  const slugTouchedRef = useRef(false);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiTone, setAiTone] = useState("professional");
  const [aiLength, setAiLength] = useState<"short" | "medium" | "long">("medium");
  const [bodyTab, setBodyTab] = useState<"visual" | "markdown">("visual");
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // History for undo/redo
  const [history, setHistory] = useState<string[]>(
    initialPost
      ? [
          JSON.stringify({
            title: initialPost.title,
            slug: initialPost.slug,
            excerpt: initialPost.excerpt || "",
            content: initialPost.content,
            seoTitle: initialPost.seoTitle || "",
            seoDescription: initialPost.seoDescription || "",
            publishAt: initialPost.publishAt || "",
            featuredImageId: initialPost.featuredImageId ?? "",
            featuredImageUrl: initialPost.featuredImageUrl ?? "",
          }),
        ]
      : [],
  );
  const [historyIndex, setHistoryIndex] = useState(0);

  const [formData, setFormData] = useState({
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

  const pushHistory = (newData: typeof formData) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(JSON.stringify(newData));
      if (newHistory.length > MAX_HISTORY) newHistory.shift();
      return newHistory;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, MAX_HISTORY - 1));
  };

  const parseHistorySnapshot = (raw: string) => {
    const data = JSON.parse(raw) as Partial<typeof formData>;
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

  const undo = () => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setFormData(parseHistorySnapshot(history[newIndex]));
  };

  const redo = () => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setFormData(parseHistorySnapshot(history[newIndex]));
  };

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
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    const timer = setTimeout(() => {
      if (formData.title && formData.slug && formData.content) {
        void handleSaveRef.current(false, true);
      }
    }, 30000);
    setAutoSaveTimer(timer);
  }, [formData.title, formData.slug, formData.content, autoSaveTimer]);

  useEffect(() => {
    return () => {
      if (autoSaveTimer) clearTimeout(autoSaveTimer);
    };
  }, [autoSaveTimer]);

  const handleGenerateAI = async () => {
    if (!aiPrompt) {
      toast.error("Enter a prompt for the AI.");
      return;
    }
    setGenerating(true);
    const toastId = toast.loading("Generating draft…");
    try {
      const res = await fetch("/api/admin/blog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          tone: aiTone,
          length: aiLength,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to generate");

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

      const newData = {
        ...formData,
        content: newContent,
        title: newTitle || formData.title,
        excerpt: newExcerpt || formData.excerpt,
        slug: formData.slug.trim() ? formData.slug : slugFromTitle || formData.slug,
      };
      setFormData(newData);
      pushHistory(newData);
      if (newData.slug.trim()) slugTouchedRef.current = true;
      setBodyTab("visual");
      toast.success("Draft generated — save to persist, or refine in the editor.", { id: toastId });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Generation failed", { id: toastId });
    } finally {
      setGenerating(false);
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
              placeholder="Post Title..."
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              onBlur={handleTitleBlur}
              className="flex-1 text-3xl font-bold bg-transparent outline-none placeholder:text-[var(--color-muted)] text-[var(--color-foreground)]"
            />
            <div className="flex gap-2 ml-4">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className="p-2 rounded-lg hover:bg-[var(--color-background)] text-[var(--color-muted)] disabled:opacity-30"
                aria-label="Undo"
              >
                <Undo2 className="h-4 w-4" />
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
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
            Describe what you want to write about. OpenRouter returns structured JSON; the draft loads into the Visual editor (Markdown-compatible).
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
              onClick={() => handleSave(false)}
              disabled={saving}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" /> Save Draft
            </Button>
            <Button
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
          <h3 className="font-semibold text-[var(--color-foreground)]">SEO & Metadata</h3>

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
