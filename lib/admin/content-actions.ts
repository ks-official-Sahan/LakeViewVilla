"use server";

import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/rbac";
import { audit } from "@/lib/admin/audit";
import { cacheInvalidatePattern } from "@/lib/cache";
import { auth } from "@/lib/auth/config";

export async function saveContentBlock(pageSlug: string, sectionSlug: string, data: any) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  await requireRole("EDITOR");

  const existing = await prisma.contentBlock.findFirst({
    where: { pageSlug, sectionSlug },
    orderBy: { version: "desc" },
  });

  const newVersion = existing ? existing.version + 1 : 1;

  const block = await prisma.contentBlock.create({
    data: {
      pageSlug,
      sectionSlug,
      data,
      version: newVersion,
      publishedAt: new Date(),
    },
  });

  await audit({
    userId: session.user.id,
    action: "UPDATE",
    entityType: "ContentBlock",
    entityId: block.id,
    newValue: { pageSlug, sectionSlug, version: newVersion },
  });

  await cacheInvalidatePattern(`content:${pageSlug}`);
  return block;
}

export async function getContentBlocks(pageSlug: string) {
  // Get latest version of each section
  const blocks = await prisma.contentBlock.findMany({
    where: { pageSlug },
    orderBy: { version: "desc" },
  });

  // Deduplicate to get only the latest version per section
  const latestBlocks = new Map();
  for (const block of blocks) {
    if (!latestBlocks.has(block.sectionSlug)) {
      latestBlocks.set(block.sectionSlug, block);
    }
  }

  return Array.from(latestBlocks.values());
}
