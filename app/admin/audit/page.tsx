import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/rbac";
import { Activity } from "lucide-react";

export const metadata = {
  title: "Audit Log — LakeViewVilla Admin",
};

export default async function AdminAuditPage() {
  await requireRole("DEVELOPER");

  let logs: {
    id: string;
    action: string;
    entityType: string;
    entityId: string | null;
    timestamp: Date;
    ipAddress: string | null;
    user: { name: string | null; email: string };
  }[] = [];

  try {
    logs = await prisma.auditLog.findMany({
      take: 100,
      orderBy: { timestamp: "desc" },
      select: {
        id: true,
        action: true,
        entityType: true,
        entityId: true,
        timestamp: true,
        ipAddress: true,
        user: { select: { name: true, email: true } },
      },
    });
  } catch {
    // DB not available
  }

  const ACTION_COLORS: Record<string, string> = {
    CREATE: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-300",
    UPDATE: "text-sky-600 bg-sky-50 dark:bg-sky-900/20 dark:text-sky-300",
    DELETE: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-300",
    LOGIN: "text-violet-600 bg-violet-50 dark:bg-violet-900/20 dark:text-violet-300",
    LOGOUT: "text-gray-600 bg-gray-50 dark:bg-gray-800/30 dark:text-gray-400",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Activity className="h-6 w-6 text-[var(--color-primary)]" />
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
            Audit Log
          </h1>
          <p className="text-sm text-[var(--color-muted)]">
            System activity trail — Developer access only
          </p>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
          <p className="text-sm text-[var(--color-muted)]">No activity recorded yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-4 py-3 font-medium text-[var(--color-muted)]">Time</th>
                <th className="px-4 py-3 font-medium text-[var(--color-muted)]">User</th>
                <th className="px-4 py-3 font-medium text-[var(--color-muted)]">Action</th>
                <th className="px-4 py-3 font-medium text-[var(--color-muted)]">Entity</th>
                <th className="px-4 py-3 font-medium text-[var(--color-muted)]">ID</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-[var(--color-border)]/50 last:border-b-0"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-[var(--color-muted)]">
                    {log.timestamp.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-foreground)]">
                    {log.user.name ?? log.user.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${ACTION_COLORS[log.action] ?? "text-gray-600 bg-gray-50"}`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">
                    {log.entityType}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--color-muted)]">
                    {log.entityId ? log.entityId.slice(0, 8) : "—"}
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
