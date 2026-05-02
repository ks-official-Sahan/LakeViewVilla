import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireExportAccess } from "@/lib/admin/require-export-access";

export async function GET() {
  const denied = await requireExportAccess();
  if (denied) return denied;

  try {
    const rows = await prisma.setting.findMany({
      orderBy: { key: "asc" },
    });

    const body = JSON.stringify(
      { exportedAt: new Date().toISOString(), settings: rows },
      null,
      2,
    );
    return new NextResponse(body, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="lvv-settings-export.json"`,
        "Cache-Control": "private, no-store, max-age=0",
      },
    });
  } catch (e) {
    console.error("export settings:", e);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
