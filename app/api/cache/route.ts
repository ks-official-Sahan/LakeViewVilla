import { NextResponse } from "next/server";

export const runtime = "edge";
export const revalidate = 300;

export async function GET() {
  const data = {
    timestamp: new Date().toISOString(),
    status: "healthy",
  };

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      "CDN-Cache-Control": "max-age=300",
      "Vercel-CDN-Cache-Control": "max-age=300",
    },
  });
}
