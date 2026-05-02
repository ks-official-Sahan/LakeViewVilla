import { prisma } from "@/lib/db/prisma";
import { can } from "@/lib/auth/permissions";
import type { Role } from "@prisma/client";
import { isCloudinaryConfigured } from "@/lib/admin/upload";

export type DashboardSnapshot = {
  counts: {
    media: number;
    blogPublished: number;
    blogDraft: number;
    contentBlocks: number;
  };
  logs: {
    id: string;
    action: string;
    entityType: string;
    timestamp: string;
    user: { name: string | null; email: string };
  }[];
  health: {
    database: boolean;
    cloudinary: boolean;
    redis: "configured" | "off";
  };
};

export async function getDashboardSnapshot(role: Role): Promise<DashboardSnapshot> {
  const [media, blogPublished, blogDraft, contentBlocks] = await Promise.all([
    prisma.mediaAsset.count().catch(() => 0),
    prisma.blogPost.count({ where: { status: "PUBLISHED" } }).catch(() => 0),
    prisma.blogPost.count({ where: { status: "DRAFT" } }).catch(() => 0),
    prisma.contentBlock.count().catch(() => 0),
  ]);

  const logs = can(role, "viewAuditLogs")
    ? await prisma.auditLog
        .findMany({
          take: 20,
          orderBy: { timestamp: "desc" },
          include: { user: { select: { name: true, email: true } } },
        })
        .catch(() => [])
    : [];

  return {
    counts: { media, blogPublished, blogDraft, contentBlocks },
    logs: logs.map((l) => ({
      id: l.id,
      action: l.action,
      entityType: l.entityType,
      timestamp: l.timestamp.toISOString(),
      user: { name: l.user.name, email: l.user.email },
    })),
    health: {
      database: true,
      cloudinary: isCloudinaryConfigured(),
      redis:
        process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
          ? "configured"
          : "off",
    },
  };
}
