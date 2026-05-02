import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { can } from "@/lib/auth/permissions";
import { DatabaseBackup } from "lucide-react";

export const metadata: Metadata = {
  title: "Backup & export | Admin",
};

export default async function AdminDataPage() {
  const session = await auth();
  if (!session?.user || !can(session.user.role, "importExport")) {
    redirect("/admin");
  }

  const exports = [
    {
      label: "Blog posts",
      description: "All posts with SEO fields, tags, and markdown content (JSON).",
      href: "/api/admin/export/blog",
      filename: "lvv-blog-export.json",
    },
    {
      label: "Site settings",
      description: "Key/value settings store (JSON).",
      href: "/api/admin/export/settings",
      filename: "lvv-settings-export.json",
    },
    {
      label: "Content blocks",
      description: "Structured page sections for the public site (JSON).",
      href: "/api/admin/export/content",
      filename: "lvv-content-blocks-export.json",
    },
  ] as const;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/15 text-[var(--color-primary)]">
          <DatabaseBackup className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">
            Backup & export
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Developer-only JSON downloads for disaster recovery and migrations. Imports are not
            automated — restore via database tooling or future guided import.
          </p>
        </div>
      </div>

      <ul className="space-y-4">
        {exports.map((item) => (
          <li
            key={item.href}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-[var(--color-foreground)]">{item.label}</h2>
                <p className="mt-1 text-sm text-[var(--color-muted)]">{item.description}</p>
              </div>
              <a
                href={item.href}
                download={item.filename}
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--color-primary-foreground)] transition-opacity hover:opacity-90"
              >
                Download JSON
              </a>
            </div>
          </li>
        ))}
      </ul>

      <p className="text-xs text-[var(--color-muted)]">
        <Link href="/admin" className="text-[var(--color-primary)] hover:underline">
          ← Back to dashboard
        </Link>
      </p>
    </div>
  );
}
