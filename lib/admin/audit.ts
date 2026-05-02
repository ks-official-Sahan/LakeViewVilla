import { prisma } from "@/lib/db/prisma";
import type { Role } from "@prisma/client";
import { hasRole } from "@/lib/auth/helpers";

export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "DELETE_BULK"
  | "UPDATE_BULK"
  | "LOGIN"
  | "LOGOUT"
  | "UPLOAD"
  | "PUBLISH"
  | "UNPUBLISH"
  | "ARCHIVE"
  | "REORDER"
  | "UPDATE_ROLE";

export type AuditEntity =
  | "MediaAsset"
  | "ContentBlock"
  | "BlogPost"
  | "User"
  | "Setting";

interface AuditParams {
  userId: string;
  action: AuditAction;
  entityType: AuditEntity;
  entityId?: string;
  oldValue?: unknown;
  newValue?: unknown;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Record an audit log entry. Non-blocking — errors are swallowed.
 */
export async function audit(params: AuditParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId ?? null,
        oldValue: params.oldValue ? JSON.parse(JSON.stringify(params.oldValue)) : null,
        newValue: params.newValue ? JSON.parse(JSON.stringify(params.newValue)) : null,
        ipAddress: params.ipAddress ?? null,
        userAgent: params.userAgent ?? null,
      },
    });
  } catch (error) {
    console.error("[Audit] Failed to record:", error);
  }
}

/**
 * Ensure the calling user has the required role.
 * Throws if insufficient permissions.
 */
export function assertRole(userRole: Role, minimumRole: Role): void {
  if (!hasRole(userRole, minimumRole)) {
    throw new Error(`Forbidden: requires ${minimumRole} role or higher`);
  }
}
