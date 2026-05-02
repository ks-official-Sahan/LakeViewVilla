import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/config";
import { ADMIN_CONTENT_PAGES } from "@/lib/admin/content-pages";
import { FileText, Edit } from "lucide-react";

export const metadata = {
  title: "Content Management — LakeViewVilla Admin",
};

export default async function AdminContentPage() {
  await auth();
  let contentCounts: Record<string, number> = {};

  try {
    const blocks = await prisma.contentBlock.groupBy({
      by: ["pageSlug"],
      _count: { id: true },
    });
    contentCounts = Object.fromEntries(
      blocks.map((b) => [b.pageSlug, b._count.id])
    );
  } catch {
    // DB not available
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
          Content Management
        </h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Edit page content, sections, and text blocks
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ADMIN_CONTENT_PAGES.map((page) => (
          <a
            key={page.slug}
            href={`/admin/content/${page.slug}`}
            className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-shadow hover:shadow-md"
          >
            <div className="mb-4 flex items-center justify-between">
              <FileText className="h-6 w-6 text-[var(--color-primary)]" />
              <Edit className="h-4 w-4 text-[var(--color-muted)] opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <h3 className="text-base font-semibold text-[var(--color-foreground)]">
              {page.label}
            </h3>
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              {page.sections.length} sections
              {contentCounts[page.slug]
                ? ` • ${contentCounts[page.slug]} blocks`
                : ""}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
