"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBlogPost, updateBlogPost, publishBlogPost } from "@/lib/admin/actions";
import { Sparkles, Save, Send, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogEditorProps {
  initialPost: any;
  isNew: boolean;
  userId: string;
}

export function BlogEditor({ initialPost, isNew, userId }: BlogEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  
  const [formData, setFormData] = useState({
    title: initialPost?.title || "",
    slug: initialPost?.slug || "",
    excerpt: initialPost?.excerpt || "",
    content: initialPost?.content || "",
    status: initialPost?.status || "DRAFT",
    seoTitle: initialPost?.seoTitle || "",
    seoDescription: initialPost?.seoDescription || "",
  });

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
      
      // Basic extraction of frontmatter if AI included it
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
      
      setFormData(prev => ({
        ...prev,
        content: newContent,
        title: newTitle || prev.title,
        excerpt: newExcerpt || prev.excerpt,
        // auto-generate a slug if empty
        slug: prev.slug || (newTitle ? newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : ""),
      }));
      
    } catch (err: any) {
      alert(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async (publish = false) => {
    if (!formData.title || !formData.slug || !formData.content) {
      return alert("Title, Slug, and Content are required.");
    }
    
    setSaving(true);
    try {
      let postId = initialPost?.id;
      
      if (isNew && !postId) {
        const post = await createBlogPost({
          ...formData,
          generatedByAI: !!aiPrompt,
        });
        postId = post.id;
      } else {
        await updateBlogPost(postId, formData);
      }
      
      if (publish && formData.status !== "PUBLISHED") {
        await publishBlogPost(postId);
      }
      
      alert(`Post ${publish ? "published" : "saved"} successfully!`);
      if (isNew) {
        router.push(`/admin/blog/${postId}`);
      } else {
        router.refresh();
      }
      
    } catch (err: any) {
      alert(err.message || "Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Main Editor */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm space-y-6">
          <div>
            <input
              type="text"
              placeholder="Post Title..."
              value={formData.title}
              onChange={(e) => {
                const title = e.target.value;
                setFormData(prev => ({ 
                  ...prev, 
                  title,
                  // auto-update slug only if it's currently empty or strictly matches the previous title
                  slug: prev.slug && prev.slug !== prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') 
                    ? prev.slug 
                    : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                }));
              }}
              className="w-full text-3xl font-bold bg-transparent outline-none placeholder:text-[var(--color-muted)] text-[var(--color-foreground)]"
            />
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[var(--color-muted)]">lakeviewvillatangalle.com/blog/</span>
            <input
              type="text"
              placeholder="post-slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="flex-1 w-full p-4 bg-[var(--color-surface)] resize-none outline-none text-[var(--color-foreground)] font-mono text-sm leading-relaxed"
              spellCheck={false}
            />
          </div>
        </div>

        {/* AI Generation Tool */}
        <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-500" />
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
              className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 resize-none h-20"
            />
            <Button 
              onClick={handleGenerateAI}
              disabled={generating}
              className="bg-violet-600 hover:bg-violet-700 text-white h-20 px-6 rounded-xl shrink-0"
            >
              {generating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-semibold text-[var(--color-foreground)] mb-4">Publishing</h3>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-[var(--color-muted)]">Status</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                formData.status === "PUBLISHED" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              }`}>
                {formData.status}
              </span>
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
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-[var(--color-foreground)]">SEO & Metadata</h3>
          
          <div>
            <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">Excerpt (Short Summary)</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-2.5 text-sm outline-none focus:border-[var(--color-primary)] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">SEO Title</label>
            <input
              type="text"
              value={formData.seoTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
              placeholder="Defaults to Post Title"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-2.5 text-sm outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">SEO Description</label>
            <textarea
              value={formData.seoDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
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
