"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBlogPost, updateBlogPost, publishBlogPost } from "@/lib/admin/actions";
import {
  Sparkles, Save, Send, Image as ImageIcon, Loader2, Undo2, Redo2, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
}

interface BlogEditorProps {
  initialPost: InitialPost | null;
  isNew: boolean;
  userId: string;
}

const MAX_HISTORY = 50;

export function BlogEditor({ initialPost, isNew, userId }: BlogEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // History for undo/redo
  const [history, setHistory] = useState<string[]>(
    initialPost ? [JSON.stringify({
      title: initialPost.title,
      slug: initialPost.slug,
      excerpt: initialPost.excerpt || "",
      content: initialPost.content,
      seoTitle: initialPost.seoTitle || "",
      seoDescription: initialPost.seoDescription || "",
      publishAt: initialPost.publishAt || "",
    })] : []
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

  const undo = () => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    const data = JSON.parse(history[newIndex]);
    setFormData(data);
  };

  const redo = () => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    const data = JSON.parse(history[newIndex]);
    setFormData(data);
  };

  // Auto-save (debounced 30s)
  const debouncedSave = useCallback(() => {
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    const timer = setTimeout(() => {
      if (formData.title && formData.slug && formData.content) {
        handleSave(false, true);
      }
    }, 30000);
    setAutoSaveTimer(timer);
  }, [formData, autoSaveTimer]);

  useEffect(() => {
    return () => {
      if (autoSaveTimer) clearTimeout(autoSaveTimer);
    };
  }, [autoSaveTimer]);

  const handleGenerateAI = async () => {
    if (!aiPrompt) return alert("Please enter a prompt for the AI.");
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/blog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to generate");

      let newContent = data.content;
      let newTitle = formData.title;
      let newExcerpt = formData.excerpt;

      if (newContent.startsWith("---")) {
        const parts = newContent.split("---");
        if (parts.length >= 3) {
          const frontmatter = parts[1];
          newContent = parts.slice(2).join("---").trim();

          const titleMatch = frontmatter.match(/title:\s*"([^"]+)"/);
          const excerptMatch = frontmatter.match(/excerpt:\s*"([^"]+)"/);

          if (titleMatch) newTitle = titleMatch[1];
          if (excerptMatch) newExcerpt = excerptMatch[1];
        }
      }

      const newData = {
        ...formData,
        content: newContent,
        title: newTitle || formData.title,
        excerpt: newExcerpt || formData.excerpt,
        slug: formData.slug || (newTitle
          ? newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
          : ""),
      };
      setFormData(newData);
      pushHistory(newData);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async (publish = false, isAutoSave = false) => {
    if (!formData.title || !formData.slug || !formData.content) {
      if (!isAutoSave) alert("Title, Slug, and Content are required.");
      return;
    }

    setSaving(true);
    try {
      let postId: string | undefined = initialPost?.id;

      if (isNew && !postId) {
        const post = await createBlogPost({
          ...formData,
          generatedByAI: !!aiPrompt,
        });
        postId = post.id;
      } else if (postId) {
        await updateBlogPost(postId, formData);
      }

      if (publish && formData.status !== "PUBLISHED" && postId) {
        await publishBlogPost(postId, formData.publishAt || undefined);
      }

      if (!isAutoSave) {
        alert(`Post ${publish ? "published" : "saved"} successfully!`);
      }
      setLastSaved(new Date());

      if (isNew && postId) {
        router.push(`/admin/blog/${postId}`);
      } else {
        router.refresh();
      }
    } catch (err: any) {
      if (!isAutoSave) alert(err.message || "Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);

    // Auto-slug from title
    if (field === "title" && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      }));
    }

    pushHistory(newData);
    debouncedSave();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Main Editor */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="Post Title..."
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
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
              onChange={(e) => handleChange("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              className="flex-1 bg-transparent outline-none text-[var(--color-primary)] font-mono"
            />
          </div>

          <div className="h-[500px] border border-[var(--color-border)] rounded-xl overflow-hidden flex flex-col">
            <div className="bg-[var(--color-background)] border-b border-[var(--color-border)] p-2 flex items-center gap-2">
              <span className="text-xs font-medium text-[var(--color-muted)] px-2">Markdown Editor</span>
              <div className="ml-auto flex gap-1">
                {/* Format buttons could go here */}
              </div>
            </div>
            <textarea
              placeholder="Write your post content here (Markdown supported)..."
              value={formData.content}
              onChange={(e) => handleChange("content", e.target.value)}
              className="flex-1 w-full p-4 bg-[var(--color-surface)] resize-none outline-none text-[var(--color-foreground)] font-mono text-sm leading-relaxed"
              spellCheck={false}
            />
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
            Describe what you want to write about, and the AI will generate a complete, SEO-optimized draft in Markdown format.
          </p>
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
        </div>
      </div>
    </div>
  );
}
