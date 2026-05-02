import { NextResponse } from "next/server";
import { findManyMediaAssetsForAdmin } from "@/lib/admin/media-assets-admin-query";
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
    const rows = await findManyMediaAssetsForAdmin();

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
