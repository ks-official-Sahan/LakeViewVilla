import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/rbac";

/**
 * List media assets for the admin library (EDITOR+).
 * Consumed by TanStack Query in `MediaGrid` for cache-invalidating refetches.
 */
export async function GET() {
  try {
    await requireRole("EDITOR");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await prisma.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        url: true,
        title: true,
        alt: true,
        tags: true,
        featured: true,
        category: true,
        type: true,
        width: true,
        height: true,
        createdAt: true,
        locations: {
          orderBy: [{ order: "asc" }, { pageSlug: "asc" }],
          select: {
            id: true,
            pageSlug: true,
            sectionSlug: true,
            isPrimary: true,
            order: true,
          },
        },
      },
    });

    const assets = rows.map((a) => ({
      ...a,
      createdAt: a.createdAt.toISOString(),
    }));

    return NextResponse.json(assets);
  } catch (e) {
    console.error("Admin media list error:", e);
    return NextResponse.json({ error: "Failed to load media" }, { status: 500 });
  }
}
