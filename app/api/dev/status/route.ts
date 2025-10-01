import { NextResponse } from "next/server";
export const runtime = "edge";
const TARGETS = [
  { label: "Primary", url: "https://sahansachintha.com" },
  { label: "Alt", url: "https://sahan-ruddy.vercel.app" },
  { label: "Dev (villa)", url: "https://dev.lakeviewvillatangalle.com" },
  {
    label: "Developer (villa)",
    url: "https://developer.lakeviewvillatangalle.com",
  },
];

async function probe(url: string, timeoutMs = 2500) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  const start = Date.now();
  try {
    let r = await fetch(url, {
      method: "HEAD",
      signal: ctrl.signal,
      cache: "no-store",
    });
    if (!r.ok)
      r = await fetch(url, {
        method: "GET",
        headers: { Range: "bytes=0-0" },
        signal: ctrl.signal,
        cache: "no-store",
      });
    const latency = Date.now() - start;
    clearTimeout(t);
    return {
      ok: r.ok || (r.status >= 200 && r.status < 400),
      status: r.status,
      latency,
    };
  } catch {
    clearTimeout(t);
    return { ok: false, status: 0, latency: Infinity };
  }
}

export async function GET() {
  const results = await Promise.all(
    TARGETS.map(async (t) => ({ ...t, ...(await probe(t.url)) }))
  );
  const primary = results.find((r) => r.url.includes("sahansachintha.com"));
  let best = primary && primary.ok ? primary : null;
  if (!best) {
    const oks = results
      .filter((r) => r.ok)
      .sort((a, b) => a.latency - b.latency);
    best = oks[0] ?? results[0];
  }
  return NextResponse.json(
    { results, best, ts: Date.now() },
    {
      headers: {
        "cache-control": "public, s-maxage=30, stale-while-revalidate=600",
      },
    }
  );
}
