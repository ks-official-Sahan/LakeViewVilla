import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/db/prisma";
import { UsersClient } from "./users-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management | Admin",
};

export default async function UsersPage() {
  // Only DEVELOPER can access
  const session = await requireRole("DEVELOPER");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">
          User Management
        </h1>
        <p className="text-sm text-[var(--color-muted)]">
          Manage system users and their roles (Developer access only).
        </p>
      </div>

      <UsersClient initialUsers={users} currentUserId={session.user.id} />
    </div>
  );
}
