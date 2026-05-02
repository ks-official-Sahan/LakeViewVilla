import { getContentBlocks } from "@/lib/admin/content-actions";
import { ContentEditor } from "@/components/admin/content-editor";
import { getContentPage } from "@/lib/admin/content-pages";
import type { ContentBlock } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Page Content — LakeViewVilla Admin",
};

export default async function AdminContentSlugPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const page = getContentPage(params.slug);

  if (!page) {
    notFound();
  }

  let existingBlocks: ContentBlock[] = [];
  try {
    existingBlocks = await getContentBlocks(params.slug);
  } catch (error) {
    console.error("Failed to fetch blocks", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/content"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
            Editing {page.label}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Manage sections and content blocks for this page
          </p>
        </div>
      </div>

      <ContentEditor pageSlug={page.slug} sections={page.sections} initialBlocks={existingBlocks} />
    </div>
  );
}
