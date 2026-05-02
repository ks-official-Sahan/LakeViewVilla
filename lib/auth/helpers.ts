import { auth } from "./config";
import type { Role } from "@prisma/client";
import { hasMinRole } from "./permissions";

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
  return hasMinRole(userRole, minimumRole);
}
