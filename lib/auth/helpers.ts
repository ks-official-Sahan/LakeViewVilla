import { auth } from "./config";
import type { Role } from "@prisma/client";

const ROLE_HIERARCHY: Record<Role, number> = {
  DEVELOPER: 3,
  MANAGER: 2,
  EDITOR: 1,
};

/**
 * Get the current authenticated session. Returns null if not authenticated.
 */
export async function getSession() {
  return auth();
}

/**
 * Require authentication. Throws if not authenticated.
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

/**
 * Check if a user has at least the given role level.
 */
export function hasRole(userRole: Role, minimumRole: Role): boolean {
  return (ROLE_HIERARCHY[userRole] ?? 0) >= (ROLE_HIERARCHY[minimumRole] ?? 0);
}
