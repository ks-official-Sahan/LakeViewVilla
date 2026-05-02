/**
 * Server-only guards — imports NextAuth config (Prisma adapter).
 * Do not import this file from Client Components; use `./permissions` for `can` / `PERMISSIONS`.
 */

import { type Role } from "@prisma/client";
import { auth } from "./config";
import { hasMinRole } from "./permissions";

export { PERMISSIONS, can, hasMinRole, hasRole } from "./permissions";

/**
 * Server-side guard — Server Components, Route Handlers, Server Actions.
 */
export async function requireRole(minimumRole: Role) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("UNAUTHORIZED");
  }

  if (!hasMinRole(session.user.role, minimumRole)) {
    throw new Error("FORBIDDEN");
  }

  return session;
}
