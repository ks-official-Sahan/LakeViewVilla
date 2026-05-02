"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@prisma/client";
import { can, PERMISSIONS } from "@/lib/auth/permissions";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Image,
  FileText,
  PenLine,
  Users,
  ClipboardList,
  Settings,
} from "lucide-react";

export type NavItemDef = {
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: keyof typeof PERMISSIONS;
};

export const ADMIN_NAV_GROUPS: { heading: string; items: NavItemDef[] }[] = [
  {
    heading: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    heading: "Content",
    items: [
      { label: "Media", href: "/admin/media", icon: Image },
      { label: "Pages", href: "/admin/content", icon: FileText },
      { label: "Blog", href: "/admin/blog", icon: PenLine },
    ],
  },
  {
    heading: "System",
    items: [
      { label: "Users", href: "/admin/users", icon: Users, permission: "manageUsers" },
      { label: "Audit Log", href: "/admin/audit", icon: ClipboardList, permission: "viewAuditLogs" },
      { label: "Settings", href: "/admin/settings", icon: Settings, permission: "manageSettings" },
    ],
  },
];

function filterItems(role: Role, items: NavItemDef[]): NavItemDef[] {
  return items.filter((item) => !item.permission || can(role, item.permission));
}

interface AdminNavListProps {
  role: Role;
  showGroupHeadings: boolean;
  showLabels: boolean;
  onNavigate?: () => void;
}

export function AdminNavList({
  role,
  showGroupHeadings,
  showLabels,
  onNavigate,
}: AdminNavListProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-4">
      {ADMIN_NAV_GROUPS.map((group) => {
        const items = filterItems(role, group.items);
        if (!items.length) return null;

        return (
          <div key={group.heading}>
            {showGroupHeadings && showLabels && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                {group.heading}
              </p>
            )}
            <nav className="space-y-1">
              {items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={!showLabels ? item.label : undefined}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-l-2 border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                        : "border-l-2 border-transparent text-[var(--color-muted)] hover:bg-[var(--color-background)] hover:text-[var(--color-foreground)]"
                    } ${showLabels ? "" : "justify-center px-2"}`}
                  >
                    <item.icon className="h-5 w-5 shrink-0" aria-hidden />
                    {showLabels && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>
        );
      })}
    </div>
  );
}
