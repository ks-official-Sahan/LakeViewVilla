import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/config";
import { notFound } from "next/navigation";
import { BlogEditor } from "./blog-editor";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Blog Editor — LakeViewVilla Admin",
};

/** For `<input type="datetime-local" />` — uses runtime local timezone. */
function toDatetimeLocalValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default async function AdminBlogEditorPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user) return null;

  const isNew = params.id === "new";
  let post = null;

  if (!isNew) {
    try {
      post = await prisma.blogPost.findUnique({
        where: { id: params.id },
        include: { featuredImage: { select: { id: true, url: true } } },
      });
      if (!post) notFound();
    } catch {
      notFound();
    }
  }

  const editorInitial =
    post && !isNew
      ? {
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          status: post.status,
          seoTitle: post.seoTitle,
          seoDescription: post.seoDescription,
          generatedByAI: post.generatedByAI,
          publishAt: post.publishedAt ? toDatetimeLocalValue(post.publishedAt) : "",
          featuredImageId: post.featuredImageId,
          featuredImageUrl: post.featuredImage?.url ?? null,
        }
      : null;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/blog"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
            {isNew ? "Create New Post" : "Edit Post"}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Write content using Markdown and AI generation
          </p>
        </div>
      </div>

      <BlogEditor initialPost={editorInitial} isNew={isNew} />
    </div>
  );
}
