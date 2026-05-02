"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";

export type AuditRowSerialized = {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  timestamp: string;
  ipAddress: string | null;
  user: { name: string | null; email: string };
  oldValue: unknown;
  newValue: unknown;
};

function JsonBlock({ label, value }: { label: string; value: unknown }) {
  if (value === null || value === undefined) {
    return (
      <p className="text-xs text-[var(--color-muted)]">
        {label}: — none —
      </p>
    );
  }
  const text = JSON.stringify(value, null, 2);
  return (
    <div>
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-muted)]">
        {label}
      </p>
      <pre className="max-h-48 overflow-auto rounded-lg bg-[var(--color-background)] p-3 font-mono text-[11px] text-[var(--color-foreground)]">
        {text}
      </pre>
    </div>
  );
}

function AuditRow({
  log,
  actionColors,
}: {
  log: AuditRowSerialized;
  actionColors: Record<string, string>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr className="border-b border-[var(--color-border)]/50 last:border-b-0">
        <td className="w-8 px-2 py-2 align-top">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="rounded p-1 text-[var(--color-muted)] hover:bg-[var(--color-background)]"
            aria-expanded={open}
            aria-label={open ? "Collapse row" : "Expand row"}
          >
            {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </td>
        <td className="whitespace-nowrap px-2 py-3 text-xs text-[var(--color-muted)]">
          {new Date(log.timestamp).toLocaleString()}
        </td>
        <td className="px-2 py-3 text-sm text-[var(--color-foreground)]">
          {log.user.name ?? log.user.email}
        </td>
        <td className="px-2 py-3">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${actionColors[log.action] ?? "text-gray-600 bg-gray-50 dark:bg-gray-800/40"}`}
          >
            {log.action}
          </span>
        </td>
        <td className="px-2 py-3 text-sm text-[var(--color-muted)]">{log.entityType}</td>
        <td className="px-2 py-3 font-mono text-xs text-[var(--color-muted)]">
          {log.entityId ? (
            <Link
              href={adminHrefForEntity(log.entityType, log.entityId)}
              className="text-[var(--color-primary)] hover:underline"
            >
              {log.entityId.slice(0, 10)}…
            </Link>
          ) : (
            "—"
          )}
        </td>
        <td className="hidden px-2 py-3 text-xs text-[var(--color-muted)] lg:table-cell">
          {log.ipAddress ?? "—"}
        </td>
      </tr>
      {open ? (
        <tr className="border-b border-[var(--color-border)]/50 bg-[var(--color-background)]/80">
          <td colSpan={7} className="px-6 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <JsonBlock label="Previous value" value={log.oldValue} />
              <JsonBlock label="New value" value={log.newValue} />
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}

function adminHrefForEntity(entityType: string, entityId: string): string {
  switch (entityType) {
    case "BlogPost":
      return `/admin/blog/${entityId}`;
    case "MediaAsset":
      return `/admin/media`;
    case "User":
      return `/admin/users`;
    case "Setting":
      return `/admin/settings`;
    default:
      return `/admin/audit`;
  }
}

export function AuditLogView({
  logs,
  actionColors,
}: {
  logs: AuditRowSerialized[];
  actionColors: Record<string, string>;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            <th className="w-8 px-2 py-3" aria-hidden />
            <th className="px-2 py-3 font-medium text-[var(--color-muted)]">Time</th>
            <th className="px-2 py-3 font-medium text-[var(--color-muted)]">User</th>
            <th className="px-2 py-3 font-medium text-[var(--color-muted)]">Action</th>
            <th className="px-2 py-3 font-medium text-[var(--color-muted)]">Entity</th>
            <th className="px-2 py-3 font-medium text-[var(--color-muted)]">ID</th>
            <th className="hidden px-2 py-3 font-medium text-[var(--color-muted)] lg:table-cell">
              IP
            </th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <AuditRow key={log.id} log={log} actionColors={actionColors} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
