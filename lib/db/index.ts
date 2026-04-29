/**
 * lib/db/index.ts — Re-export the Prisma client and add safe query helpers.
 */
export { prisma, prisma as db } from "./prisma";

/**
 * Check if the primary database (Neon) is reachable.
 */
export async function isDatabaseAvailable(): Promise<boolean> {
  const { prisma } = await import("./prisma");
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    console.warn("[DB] Primary database unreachable — operating in degraded mode.");
    return false;
  }
}

/**
 * Wraps a database call with error handling.
 * Returns null instead of throwing on connection failure.
 */
export async function safeQuery<T>(
  queryFn: () => Promise<T>,
): Promise<T | null> {
  try {
    return await queryFn();
  } catch (error) {
    console.error("[DB] Query failed:", error);
    return null;
  }
}
