import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

/**
 * Health check endpoint for deployment verification.
 * Returns 200 if the app and database are healthy.
 */
export async function GET() {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    checks: {
      app: "ok",
      database: "unknown",
    },
  };

  // Check database connectivity
  try {
    await prisma.$queryRaw`SELECT 1`;
    health.checks.database = "ok";
  } catch (error) {
    health.status = "error";
    health.checks.database = "error";
    return NextResponse.json(health, { status: 503 });
  }

  return NextResponse.json(health);
}
