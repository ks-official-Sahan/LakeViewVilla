import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeArray<T>(value: unknown, fallback: T[] = []): T[] {
  return Array.isArray(value) ? value : fallback;
}
export function safeNumber(value: unknown, fallback = 0): number {
  const num = Number(value);
  return isNaN(num) ? fallback : num;
}
export function safeString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

/**
 * buildWhatsAppUrl
 * Overload:
 *  - buildWhatsAppUrl(message) -> uses NEXT_PUBLIC_WHATSAPP or fallback
 *  - buildWhatsAppUrl(phoneNumber, message)
 */
export function buildWhatsAppUrl(a: string, b?: string): string {
  const defaultNumber =
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_WHATSAPP) ||
    "+94717448391";

  const phone = (b ? a : defaultNumber).replace(/[^\d]/g, "");
  const msg = encodeURIComponent(b ?? a);
  return `https://wa.me/${phone}?text=${msg}`;
}

/** Opinionated link builder for composed details */
export function buildWhatsAppLink({
  name,
  dates,
  guests,
  message,
  currentUrl,
  utm,
}: {
  name: string;
  dates: string;
  guests: number;
  message: string;
  currentUrl: string;
  utm?: string;
}): string {
  const phoneNumber =
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_WHATSAPP) ||
    "+94717448391";
  const formatted = [
    name,
    dates,
    `${guests} guests`,
    message,
    currentUrl,
    utm || "",
  ]
    .filter(Boolean)
    .join(" · ");
  return buildWhatsAppUrl(phoneNumber, formatted);
}
