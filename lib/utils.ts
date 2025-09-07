import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function safeArray<T>(value: unknown, fallback: T[] = []): T[] {
  return Array.isArray(value) ? value : fallback
}

export function safeNumber(value: unknown, fallback = 0): number {
  const num = Number(value)
  return isNaN(num) ? fallback : num
}

export function safeString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback
}

export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  const cleanPhoneNumber = phoneNumber.replace(/[^\d]/g, "")
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`
}

export function buildWhatsAppLink({
  name,
  dates,
  guests,
  message,
  currentUrl,
  utm,
}: {
  name: string
  dates: string
  guests: number
  message: string
  currentUrl: string
  utm?: string
}): string {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP || "+94771234567"

  const formattedMessage = [name, dates, `${guests} guests`, message, currentUrl, utm || ""].filter(Boolean).join(" · ")

  const encodedMessage = encodeURIComponent(formattedMessage)
  return `https://wa.me/${phoneNumber.replace(/[^\d]/g, "")}?text=${encodedMessage}`
}
