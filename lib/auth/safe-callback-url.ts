/**
 * Prevent open redirects after login — only same-origin admin paths are allowed.
 */

const DEFAULT_FALLBACK = "/admin";

function allowedAdminPath(pathname: string): boolean {
  if (pathname === "/admin") return true;
  if (pathname.startsWith("/admin/login")) return false;
  return pathname.startsWith("/admin/");
}

/** Reject control chars and characters that break URLs or enable tricks. */
function hasSuspiciousChars(s: string): boolean {
  return /[\x00-\x1f<>"]/.test(s);
}

/**
 * Returns a safe internal path for post-login navigation (must stay under `/admin`).
 */
export function sanitizeAdminCallbackUrl(
  raw: string | null | undefined,
  fallback: string = DEFAULT_FALLBACK,
): string {
  if (raw == null || typeof raw !== "string") return fallback;

  const trimmed = raw.trim();
  if (!trimmed.startsWith("/")) return fallback;
  if (trimmed.startsWith("//")) return fallback;
  if (hasSuspiciousChars(trimmed)) return fallback;
  if (trimmed.length > 2048) return fallback;

  try {
    const u = new URL(trimmed, "https://lvv.callback.invalid");
    if (!allowedAdminPath(u.pathname)) return fallback;
    return `${u.pathname}${u.search}${u.hash}`;
  } catch {
    return fallback;
  }
}
