import { type ReactNode } from "react";
import { auth } from "@/lib/auth/config";
import { AdminShell } from "@/components/admin/admin-shell";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await auth();

  // Unauthenticated: render children without admin shell.
  // The proxy already redirects non-login admin paths to /admin/login,
  // so only the login page reaches here without a session.
  if (!session?.user) {
    return <div className="admin-login-wrapper">{children}</div>;
  }

  return (
    <AdminShell role={session.user.role} user={session.user}>
      {children}
    </AdminShell>
  );
}
