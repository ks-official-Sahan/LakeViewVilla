import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { getDashboardSnapshot } from "@/lib/admin/dashboard-snapshot";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getDashboardSnapshot(session.user.role);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  } catch (e) {
    console.error("dashboard summary:", e);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
