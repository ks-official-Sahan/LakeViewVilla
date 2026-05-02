/**
 * Client-safe RBAC helpers — no auth/config/prisma imports.
 * Use this from Client Components (e.g. sidebar nav visibility).
 */

import type { Role } from "@prisma/client";

const ROLE_HIERARCHY: Record<Role, number> = {
  EDITOR: 1,
  MANAGER: 2,
  DEVELOPER: 3,
};

export function hasMinRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/** Alias matching legacy helpers naming */
export function hasRole(userRole: Role, minimumRole: Role): boolean {
  return hasMinRole(userRole, minimumRole);
}

export const PERMISSIONS = {
  viewContent: ["EDITOR", "MANAGER", "DEVELOPER"] as Role[],
  editContent: ["EDITOR", "MANAGER", "DEVELOPER"] as Role[],
  deleteContent: ["MANAGER", "DEVELOPER"] as Role[],
  uploadMedia: ["EDITOR", "MANAGER", "DEVELOPER"] as Role[],
  deleteMedia: ["MANAGER", "DEVELOPER"] as Role[],
  writeBlog: ["EDITOR", "MANAGER", "DEVELOPER"] as Role[],
  publishBlog: ["MANAGER", "DEVELOPER"] as Role[],
  deleteBlog: ["MANAGER", "DEVELOPER"] as Role[],
  manageUsers: ["DEVELOPER"] as Role[],
  viewAuditLogs: ["DEVELOPER"] as Role[],
  manageSettings: ["DEVELOPER"] as Role[],
  importExport: ["DEVELOPER"] as Role[],
} as const;

export function can(userRole: Role, permission: keyof typeof PERMISSIONS): boolean {
  return (PERMISSIONS[permission] as readonly Role[]).includes(userRole);
}
