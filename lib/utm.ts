// "use client";

// export function captureUTM() {
//   if (typeof window === "undefined") return;
//   const u = new URL(window.location.href);
//   const keys = [
//     "utm_source",
//     "utm_medium",
//     "utm_campaign",
//     "utm_term",
//     "utm_content",
//     "gclid",
//     "fbclid",
//   ];
//   const bag: Record<string, string> = {};
//   keys.forEach((k) => {
//     const v = u.searchParams.get(k);
//     if (v) bag[k] = v;
//   });
//   if (Object.keys(bag).length)
//     localStorage.setItem(
//       "__lvv_utm",
//       JSON.stringify({ ...bag, ts: Date.now() })
//     );
// }

// export function getUTM(): Record<string, string> {
//   if (typeof window === "undefined") return {};
//   try {
//     return JSON.parse(localStorage.getItem("__lvv_utm") || "{}");
//   } catch {
//     return {};
//   }
// }

// export function withUTM(url: string) {
//   try {
//     const u = new URL(url);
//     const bag = getUTM();
//     Object.entries(bag).forEach(([k, v]) => {
//       if (!u.searchParams.has(k)) u.searchParams.set(k, v as string);
//     });
//     return u.toString();
//   } catch {
//     return url;
//   }
// }
