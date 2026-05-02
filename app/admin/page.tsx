import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { can } from "@/lib/auth/permissions";
import { Image, PenLine, FileText, Activity } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  const [mediaCount, blogCount, contentCount] = await Promise.all([
    prisma.mediaAsset.count().catch(() => 0),
    prisma.blogPost.count().catch(() => 0),
    prisma.contentBlock.count().catch(() => 0),
  ]);

  const recentLogs = can(session.user.role, "viewAuditLogs")
    ? await prisma.auditLog
        .findMany({
          take: 5,
          orderBy: { timestamp: "desc" },
          include: { user: { select: { name: true, email: true } } },
        })
        .catch(() => [])
    : [];

  const stats = [
    { label: "Media Assets", value: mediaCount, icon: Image, color: "text-sky-500" },
    { label: "Blog Posts", value: blogCount, icon: PenLine, color: "text-emerald-500" },
    { label: "Content Blocks", value: contentCount, icon: FileText, color: "text-amber-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Welcome back, {session.user.name ?? session.user.email}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-muted)]">{stat.label}</p>
                <p className="mt-1 text-3xl font-bold text-[var(--color-foreground)]">
                  {stat.value}
                </p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color} opacity-60`} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="mb-4 text-lg font-semibold text-[var(--color-foreground)]">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/admin/media"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-[var(--color-primary-foreground)] transition-opacity hover:opacity-90"
          >
            <Image className="h-4 w-4" />
            Upload Media
          </a>
          <a
            href="/admin/blog"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-surface)]"
          >
            <PenLine className="h-4 w-4" />
            New Blog Post
          </a>
        </div>
      </div>

      {/* Recent Activity (DEVELOPER only) */}
      {recentLogs.length > 0 && (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-[var(--color-primary)]" />
            <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
              Recent Activity
            </h2>
          </div>
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between rounded-xl border border-[var(--color-border)]/50 bg-[var(--color-background)] px-4 py-3 text-sm"
              >
                <div>
                  <span className="font-medium text-[var(--color-foreground)]">
                    {log.user.name ?? log.user.email}
                  </span>
                  <span className="text-[var(--color-muted)]">
                    {" "}
                    {log.action.toLowerCase()} {log.entityType.toLowerCase()}
                  </span>
                </div>
                <time
                  className="text-xs text-[var(--color-muted)]"
                  dateTime={log.timestamp.toISOString()}
                >
                  {log.timestamp.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
