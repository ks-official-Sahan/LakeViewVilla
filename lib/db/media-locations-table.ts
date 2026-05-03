import { prisma } from "@/lib/db/prisma";

/**
 * True when `media_locations` exists (migrations applied).
 * Use before queries that `include`/`where` on `MediaAsset.locations` to avoid Prisma P2021 noise.
 */
export async function mediaLocationsTableExists(): Promise<boolean> {
  try {
    const rows = await prisma.$queryRaw<Array<{ exists: boolean }>>`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'media_locations'
      ) AS "exists"
    `;
    return Boolean(rows[0]?.exists);
  } catch {
    return false;
  }
}
