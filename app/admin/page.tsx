import { auth } from "@/lib/auth/config";
import { can } from "@/lib/auth/permissions";
import { getDashboardSnapshot } from "@/lib/admin/dashboard-snapshot";
import { DashboardPanel } from "@/components/admin/dashboard-panel";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  const initial = await getDashboardSnapshot(session.user.role);

  return (
    <DashboardPanel
      initial={initial}
      userLabel={session.user.name ?? session.user.email}
      showAuditFeed={can(session.user.role, "viewAuditLogs")}
    />
  );
}
