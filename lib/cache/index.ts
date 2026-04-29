import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// ─── Redis Client ─────────────────────────────────────────────────────────────

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn("[Cache] Upstash Redis not configured — caching disabled.");
    return null;
  }
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  return redis;
}

// ─── Cache Helpers ────────────────────────────────────────────────────────────

export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = getRedis();
  if (!client) return null;
  try {
    return await client.get<T>(key);
  } catch {
    return null;
  }
}

export async function cacheSet(
  key: string,
  value: unknown,
  ttlSeconds = 300,
): Promise<void> {
  const client = getRedis();
  if (!client) return;
  try {
    await client.set(key, value, { ex: ttlSeconds });
  } catch (error) {
    console.error("[Cache] Set failed:", error);
  }
}

export async function cacheDelete(key: string): Promise<void> {
  const client = getRedis();
  if (!client) return;
  try {
    await client.del(key);
  } catch (error) {
    console.error("[Cache] Delete failed:", error);
  }
}

export async function cacheInvalidatePattern(pattern: string): Promise<void> {
  const client = getRedis();
  if (!client) return;
  try {
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
    }
  } catch (error) {
    console.error("[Cache] Invalidate failed:", error);
  }
}

// ─── Rate Limiter ─────────────────────────────────────────────────────────────

let rateLimiter: Ratelimit | null = null;

export function getRateLimiter(): Ratelimit | null {
  if (rateLimiter) return rateLimiter;
  const client = getRedis();
  if (!client) return null;

  rateLimiter = new Ratelimit({
    redis: client,
    limiter: Ratelimit.slidingWindow(20, "60 s"), // 20 requests per 60s
    analytics: true,
    prefix: "lvv:ratelimit",
  });

  return rateLimiter;
}

/**
 * Rate limit by identifier (IP, user ID, etc.)
 * Returns { success: boolean, remaining: number }
 */
export async function rateLimit(
  identifier: string,
): Promise<{ success: boolean; remaining: number }> {
  const limiter = getRateLimiter();
  if (!limiter) return { success: true, remaining: 999 };

  try {
    const result = await limiter.limit(identifier);
    return { success: result.success, remaining: result.remaining };
  } catch {
    return { success: true, remaining: 999 };
  }
}
