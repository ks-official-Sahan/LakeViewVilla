import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/config";
import { can } from "@/lib/auth/rbac";
import { Plus, PenLine, Eye, Trash2 } from "lucide-react";

export const metadata = {
  title: "Blog Management — LakeViewVilla Admin",
};

export default async function AdminBlogPage() {
  const session = await auth();
  if (!session?.user) return null;

  let posts: {
    id: string;
    title: string;
    slug: string;
    status: string;
    generatedByAI: boolean;
    publishedAt: Date | null;
    updatedAt: Date;
    author: { name: string | null; email: string };
  }[] = [];

  try {
    posts = await prisma.blogPost.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        generatedByAI: true,
        publishedAt: true,
        updatedAt: true,
        author: { select: { name: true, email: true } },
      },
    });
  } catch {
    // DB not available
  }

  const STATUS_BADGE: Record<string, string> = {
    DRAFT: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    PUBLISHED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    ARCHIVED: "bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
            Blog Posts
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Create, edit, and manage blog content
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-[var(--color-primary-foreground)] transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
          <PenLine className="mx-auto mb-3 h-10 w-10 text-[var(--color-muted)]" />
          <h3 className="text-base font-semibold text-[var(--color-foreground)]">
            No posts yet
          </h3>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Create your first blog post or generate one with AI.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-4 py-3 font-medium text-[var(--color-muted)]">Title</th>
                <th className="px-4 py-3 font-medium text-[var(--color-muted)]">Status</th>
                <th className="px-4 py-3 font-medium text-[var(--color-muted)]">Author</th>
                <th className="px-4 py-3 font-medium text-[var(--color-muted)]">Updated</th>
                <th className="px-4 py-3 font-medium text-[var(--color-muted)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-[var(--color-border)]/50 last:border-b-0"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[var(--color-foreground)]">
                        {post.title}
                      </span>
                      {post.generatedByAI && (
                        <span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                          AI
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_BADGE[post.status]}`}
                    >
                      {post.status.toLowerCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">
                    {post.author.name ?? post.author.email}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">
                    {post.updatedAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="rounded-lg p-1.5 text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                        aria-label={`Edit ${post.title}`}
                      >
                        <PenLine className="h-4 w-4" />
                      </Link>
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg p-1.5 text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                        aria-label={`Preview ${post.title}`}
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                      {can(session.user.role, "deleteBlog") && (
                        <button
                          className="cursor-pointer rounded-lg p-1.5 text-[var(--color-muted)] hover:text-red-600"
                          aria-label={`Delete ${post.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
