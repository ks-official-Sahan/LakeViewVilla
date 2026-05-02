"use client";

import { useEffect, useState } from "react";
import type { Role } from "@prisma/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AdminNavList } from "@/components/admin/admin-nav";

const SIDEBAR_COLLAPSED_KEY = "lvv-admin-sidebar-collapsed";

interface AdminSidebarProps {
  role: Role;
}

export function AdminSidebar({ role }: AdminSidebarProps) {
  const [isMd, setIsMd] = useState(false);
  const [isLg, setIsLg] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const qMd = window.matchMedia("(min-width: 768px)");
    const qLg = window.matchMedia("(min-width: 1024px)");
    const sync = () => {
      setIsMd(qMd.matches);
      setIsLg(qLg.matches);
    };
    sync();
    qMd.addEventListener("change", sync);
    qLg.addEventListener("change", sync);
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (stored === "1") setCollapsed(true);
    setHydrated(true);
    return () => {
      qMd.removeEventListener("change", sync);
      qLg.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!hydrated || !isLg) return;
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? "1" : "0");
  }, [collapsed, hydrated, isLg]);

  if (!isMd) return null;

  const wide = isLg && !collapsed;
  const showLabels = wide;
  const widthClass = wide ? "w-60" : "w-16";

  return (
    <aside
      className={`relative hidden shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface)] transition-[width] duration-300 md:flex md:flex-col ${widthClass}`}
    >
      <div className="flex h-16 items-center gap-3 border-b border-[var(--color-border)] px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)] text-xs font-bold text-[var(--color-primary-foreground)]">
          LV
        </div>
        {showLabels && (
          <span className="truncate text-sm font-semibold text-[var(--color-foreground)]">
            Admin Panel
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <AdminNavList
          role={role}
          showGroupHeadings={showLabels}
          showLabels={showLabels}
        />
      </div>

      {isLg && (
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="absolute -right-3 top-20 z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] shadow-sm transition-colors hover:text-[var(--color-foreground)]"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      )}
    </aside>
  );
}
