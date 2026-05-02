"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { DashboardSnapshot } from "@/lib/admin/dashboard-snapshot";
import {
  Image,
  PenLine,
  FileText,
  Activity,
  ExternalLink,
  Database,
  Cloud,
  Circle,
} from "lucide-react";

interface DashboardPanelProps {
  initial: DashboardSnapshot;
  userLabel: string;
  showAuditFeed: boolean;
}

function HealthDot({ ok }: { ok: boolean }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
      <Circle className={`h-2 w-2 fill-current ${ok ? "text-emerald-500" : "text-amber-500"}`} />
    </span>
  );
}

export function DashboardPanel({ initial, userLabel, showAuditFeed }: DashboardPanelProps) {
  const [data, setData] = useState(initial);

  useEffect(() => {
    const id = window.setInterval(async () => {
      try {
        const res = await fetch("/api/admin/dashboard/summary", { cache: "no-store" });
        if (!res.ok) return;
        const next = (await res.json()) as DashboardSnapshot;
        setData(next);
      } catch {
        /* ignore */
      }
    }, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const stats = [
    { label: "Media Assets", value: data.counts.media, icon: Image, color: "text-sky-500" },
    {
      label: "Blog — Published",
      value: data.counts.blogPublished,
      icon: PenLine,
      color: "text-emerald-500",
    },
    {
      label: "Blog — Drafts",
      value: data.counts.blogDraft,
      icon: PenLine,
      color: "text-amber-500",
    },
    {
      label: "Content Blocks",
      value: data.counts.contentBlocks,
      icon: FileText,
      color: "text-violet-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-foreground)]">Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Welcome back, {userLabel}</p>
      </div>

      {/* System health */}
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm">
        <span className="font-medium text-[var(--color-foreground)]">System</span>
        <span className="flex items-center gap-1.5 text-[var(--color-muted)]">
          <Database className="h-4 w-4" />
          DB
          <HealthDot ok={data.health.database} />
        </span>
        <span className="flex items-center gap-1.5 text-[var(--color-muted)]">
          <Cloud className="h-4 w-4" />
          Cloudinary
          <HealthDot ok={data.health.cloudinary} />
        </span>
        <span className="text-[var(--color-muted)]">
          Redis:{" "}
          <span className="text-[var(--color-foreground)]">
            {data.health.redis === "configured" ? "configured" : "off"}
          </span>
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="mb-4 text-lg font-semibold text-[var(--color-foreground)]">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/media"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-[var(--color-primary-foreground)] transition-opacity hover:opacity-90"
          >
            <Image className="h-4 w-4" />
            Upload Media
          </Link>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-surface)]"
          >
            <PenLine className="h-4 w-4" />
            New Blog Post
          </Link>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-surface)]"
          >
            <ExternalLink className="h-4 w-4" />
            View Site
          </Link>
        </div>
      </div>

      {showAuditFeed && data.logs.length > 0 && (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-[var(--color-primary)]" />
            <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
              Recent Activity
            </h2>
            <span className="ml-auto text-xs text-[var(--color-muted)]">Updates every 30s</span>
          </div>
          <div className="space-y-3">
            {data.logs.map((log) => (
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
                  dateTime={log.timestamp}
                >
                  {new Date(log.timestamp).toLocaleString(undefined, {
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
