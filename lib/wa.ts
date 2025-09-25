// "use client";
// import { withUTM, captureUTM } from "./utm";

// export function buildWhatsAppUrl(phone: string, message: string) {
//   const defaultNumber =
//     (typeof process !== "undefined" && process.env.NEXT_PUBLIC_WHATSAPP) ||
//     "+94717448391";

//   const num = (phone || defaultNumber).replace(/[^\d]/g, "");
//   const url = `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
//   captureUTM();
//   return withUTM(url);
// }
