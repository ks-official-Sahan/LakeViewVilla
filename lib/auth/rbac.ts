import { type Role } from "@prisma/client";
import { auth } from "./config";

/**
 * Role hierarchy: DEVELOPER > MANAGER > EDITOR
 * Higher roles inherit all permissions of lower roles.
 */
const ROLE_HIERARCHY: Record<Role, number> = {
  EDITOR: 1,
  MANAGER: 2,
  DEVELOPER: 3,
};

export function hasMinRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Server-side guard — call in Server Components or Server Actions.
 * Throws if user doesn't have the required role.
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

/**
 * Permission matrix for quick reference in components.
 */
export const PERMISSIONS = {
  // Content
  viewContent: ["EDITOR", "MANAGER", "DEVELOPER"] as Role[],
  editContent: ["EDITOR", "MANAGER", "DEVELOPER"] as Role[],
  deleteContent: ["MANAGER", "DEVELOPER"] as Role[],

  // Media
  uploadMedia: ["EDITOR", "MANAGER", "DEVELOPER"] as Role[],
  deleteMedia: ["MANAGER", "DEVELOPER"] as Role[],

  // Blog
  writeBlog: ["EDITOR", "MANAGER", "DEVELOPER"] as Role[],
  publishBlog: ["MANAGER", "DEVELOPER"] as Role[],
  deleteBlog: ["MANAGER", "DEVELOPER"] as Role[],

  // Users
  manageUsers: ["DEVELOPER"] as Role[],

  // Audit
  viewAuditLogs: ["DEVELOPER"] as Role[],

  // Settings
  manageSettings: ["DEVELOPER"] as Role[],

  // Import/Export
  importExport: ["DEVELOPER"] as Role[],
} as const;

export function can(userRole: Role, permission: keyof typeof PERMISSIONS): boolean {
  return (PERMISSIONS[permission] as readonly Role[]).includes(userRole);
}
