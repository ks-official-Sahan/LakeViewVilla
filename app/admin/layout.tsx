import { Suspense, type ReactNode } from "react";
import { auth } from "@/lib/auth/config";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";

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
    <div className="flex min-h-svh bg-[var(--color-background)]">
      <Suspense fallback={null}>
        <AdminSidebar role={session.user.role} />
      </Suspense>
      <div className="flex flex-1 flex-col">
        <AdminHeader user={session.user} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
