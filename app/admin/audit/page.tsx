import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/rbac";
import { getAuditLogs } from "@/lib/admin/actions";
import { AuditLogView, type AuditRowSerialized } from "@/components/admin/audit-log-view";
import { Activity } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Audit Log — LakeViewVilla Admin",
};

const ACTION_COLORS: Record<string, string> = {
  CREATE: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-300",
  UPDATE: "text-sky-600 bg-sky-50 dark:bg-sky-900/20 dark:text-sky-300",
  UPDATE_SETTING: "text-violet-600 bg-violet-50 dark:bg-violet-900/20 dark:text-violet-300",
  UPDATE_LOCATIONS: "text-sky-600 bg-sky-50 dark:bg-sky-900/20 dark:text-sky-300",
  DELETE: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-300",
  LOGIN: "text-sky-600 bg-sky-50 dark:bg-sky-900/20 dark:text-sky-300",
  LOGOUT: "text-gray-600 bg-gray-50 dark:bg-gray-800/30 dark:text-gray-400",
  UPLOAD: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-200",
};

export default async function AdminAuditPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireRole("DEVELOPER");

  const sp = await props.searchParams;
  const q = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };

  const page = Math.max(1, Number.parseInt(q("page") ?? "1", 10) || 1);
  const entityType = q("entityType")?.trim() || undefined;
  const userId = q("userId")?.trim() || undefined;
  const action = q("action")?.trim() || undefined;
  const dateFrom = q("from")?.trim() || undefined;
  const dateTo = q("to")?.trim() || undefined;

  let result = {
    items: [] as AuditRowSerialized[],
    total: 0,
    page: 1,
    totalPages: 1,
  };

  let filterUsers: { id: string; email: string; name: string | null }[] = [];
  let entityTypes: string[] = [];
  let actions: string[] = [];

  try {
    const [logs, users, etGroup, actGroup] = await Promise.all([
      getAuditLogs({
        page,
        limit: 25,
        entityType,
        userId,
        action,
        dateFrom,
        dateTo,
      }),
      prisma.user.findMany({
        select: { id: true, email: true, name: true },
        orderBy: { email: "asc" },
      }),
      prisma.auditLog.groupBy({
        by: ["entityType"],
        orderBy: { entityType: "asc" },
        _count: true,
      }),
      prisma.auditLog.groupBy({
        by: ["action"],
        orderBy: { action: "asc" },
        _count: true,
      }),
    ]);

    filterUsers = users;
    entityTypes = etGroup.map((g) => g.entityType);
    actions = actGroup.map((g) => g.action);

    result = {
      items: logs.items.map((log) => ({
        id: log.id,
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        timestamp: log.timestamp.toISOString(),
        ipAddress: log.ipAddress,
        user: log.user,
        oldValue: log.oldValue,
        newValue: log.newValue,
      })),
      total: logs.total,
      page: logs.page,
      totalPages: logs.totalPages,
    };
  } catch {
    // DB unavailable
  }

  const buildHref = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = {
      page: String(overrides.page ?? page),
      entityType: overrides.entityType ?? entityType,
      userId: overrides.userId ?? userId,
      action: overrides.action ?? action,
      from: overrides.from ?? dateFrom,
      to: overrides.to ?? dateTo,
    };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const qs = params.toString();
    return qs ? `/admin/audit?${qs}` : "/admin/audit";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Activity className="h-6 w-6 text-[var(--color-primary)]" />
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">Audit Log</h1>
          <p className="text-sm text-[var(--color-muted)]">
            Filters, pagination, and JSON diff — Developer access only
          </p>
        </div>
      </div>

      <form
        method="GET"
        className="flex flex-wrap items-end gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
      >
        <input type="hidden" name="page" value="1" />
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--color-muted)]">
          Entity type
          <select
            name="entityType"
            defaultValue={entityType ?? ""}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)]"
          >
            <option value="">All</option>
            {entityTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--color-muted)]">
          Action
          <select
            name="action"
            defaultValue={action ?? ""}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)]"
          >
            <option value="">All</option>
            {actions.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--color-muted)]">
          User
          <select
            name="userId"
            defaultValue={userId ?? ""}
            className="max-w-[220px] rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)]"
          >
            <option value="">All</option>
            {filterUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.email}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--color-muted)]">
          From
          <input
            type="datetime-local"
            name="from"
            defaultValue={dateFrom?.slice(0, 16) ?? ""}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--color-muted)]">
          To
          <input
            type="datetime-local"
            name="to"
            defaultValue={dateTo?.slice(0, 16) ?? ""}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)]"
          />
        </label>
        <button
          type="submit"
          className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-primary-foreground)]"
        >
          Apply filters
        </button>
        <Link
          href="/admin/audit"
          className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)]"
        >
          Reset
        </Link>
      </form>

      {result.items.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
          <p className="text-sm text-[var(--color-muted)]">No activity matches these filters.</p>
        </div>
      ) : (
        <>
          <AuditLogView logs={result.items} actionColors={ACTION_COLORS} />
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--color-muted)]">
            <span>
              Page {result.page} of {result.totalPages} — {result.total} entries
            </span>
            <div className="flex gap-2">
              <Link
                href={buildHref({ page: String(Math.max(1, result.page - 1)) })}
                className={`rounded-lg border border-[var(--color-border)] px-3 py-1.5 ${result.page <= 1 ? "pointer-events-none opacity-40" : ""}`}
              >
                Previous
              </Link>
              <Link
                href={buildHref({
                  page: String(Math.min(result.totalPages, result.page + 1)),
                })}
                className={`rounded-lg border border-[var(--color-border)] px-3 py-1.5 ${result.page >= result.totalPages ? "pointer-events-none opacity-40" : ""}`}
              >
                Next
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
