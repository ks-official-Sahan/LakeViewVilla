"use client";

import { signOut } from "next-auth/react";
import type { Role } from "@prisma/client";
import { LogOut, Menu } from "lucide-react";

interface AdminHeaderProps {
  user: {
    name: string | null;
    email: string;
    role: Role;
    image?: string | null;
  };
  /** Opens the mobile navigation drawer (< md). */
  onOpenMobileNav?: () => void;
}

const ROLE_BADGE: Record<Role, { label: string; className: string }> = {
  DEVELOPER: {
    label: "Developer",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  MANAGER: {
    label: "Manager",
    className: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  },
  EDITOR: {
    label: "Editor",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
};

export function AdminHeader({ user, onOpenMobileNav }: AdminHeaderProps) {
  const badge = ROLE_BADGE[user.role];

  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 md:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        className="cursor-pointer rounded-lg p-2 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-background)] md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden md:block" aria-hidden />

      {/* User info */}
      <div className="flex items-center gap-4">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.className}`}
        >
          {badge.label}
        </span>

        <div className="hidden text-right text-sm md:block">
          <p className="font-medium text-[var(--color-foreground)]">
            {user.name ?? user.email}
          </p>
          <p className="text-xs text-[var(--color-muted)]">{user.email}</p>
        </div>

        {/* Avatar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-sm font-semibold text-[var(--color-primary)]">
          {(user.name ?? user.email).charAt(0).toUpperCase()}
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="cursor-pointer rounded-lg p-2 text-[var(--color-muted)] transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
          aria-label="Sign out"
        >
          <LogOut className="h-4.5 w-4.5" />
        </button>
      </div>
    </header>
  );
}
