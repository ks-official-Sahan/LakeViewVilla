import { Prisma } from "@prisma/client";

function walkForTimeout(e: unknown, seen: WeakSet<object>): boolean {
  if (!e || typeof e !== "object") return false;
  const ref = e as object;
  if (seen.has(ref)) return false;
  seen.add(ref);
  const o = e as Record<string, unknown>;
  if (o.code === "ETIMEDOUT") return true;
  if ("error" in o && o.error) return walkForTimeout(o.error, seen);
  if (Array.isArray(o.errors)) {
    for (const sub of o.errors) {
      if (walkForTimeout(sub, seen)) return true;
    }
  }
  return false;
}

/** Human-readable message for Prisma / Neon failures (avoids dumping raw ErrorEvent blobs). */
export function formatDbError(error: unknown): string {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.message;
  }
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return error.message;
  }
  const seen = new WeakSet<object>();
  if (walkForTimeout(error, seen)) {
    return "Database connection timed out. Check VPN/firewall, that your Neon project is active, and DATABASE_URL (pooler must be reachable on WSS).";
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  if (typeof error === "object" && error !== null) {
    const ev = error as { message?: unknown };
    if (typeof ev.message === "string" && ev.message.length > 0) {
      return ev.message;
    }
  }
  return "Database error";
}
