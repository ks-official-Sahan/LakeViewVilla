"use client";

import { useState, type ReactNode } from "react";
import type { Role } from "@prisma/client";
import { Drawer } from "vaul";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";
import { AdminNavList } from "@/components/admin/admin-nav";
import { AdminToaster } from "@/components/admin/admin-toaster";

type SessionUser = {
  name: string | null;
  email: string;
  role: Role;
  image?: string | null;
};

interface AdminShellProps {
  role: Role;
  user: SessionUser;
  children: ReactNode;
}

export function AdminShell({ role, user, children }: AdminShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <Drawer.Root
        open={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
        direction="left"
        shouldScaleBackground={false}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-40 bg-black/50 md:hidden" />
          <Drawer.Content
            aria-describedby={undefined}
            className="fixed left-0 top-0 z-50 flex h-full w-[min(100vw,300px)] outline-none md:hidden"
          >
            <div className="flex h-full w-full flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl">
              <Drawer.Title className="sr-only">Admin navigation</Drawer.Title>
              <Drawer.Description className="sr-only">
                Primary navigation for the Lake View Villa admin panel.
              </Drawer.Description>
              <div className="flex h-16 items-center gap-3 border-b border-[var(--color-border)] px-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)] text-xs font-bold text-[var(--color-primary-foreground)]">
                  LV
                </div>
                <span className="truncate text-sm font-semibold text-[var(--color-foreground)]">
                  Admin Panel
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                <AdminNavList
                  role={role}
                  showGroupHeadings
                  showLabels
                  onNavigate={() => setMobileNavOpen(false)}
                />
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      <div className="flex min-h-svh bg-[var(--color-background)]">
        <AdminSidebar role={role} />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader user={user} onOpenMobileNav={() => setMobileNavOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</main>
          <AdminToaster />
        </div>
      </div>
    </>
  );
}
