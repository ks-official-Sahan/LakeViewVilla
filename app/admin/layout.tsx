import type { ReactNode } from "react";
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
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
