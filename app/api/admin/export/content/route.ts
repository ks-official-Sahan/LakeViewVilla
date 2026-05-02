import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireExportAccess } from "@/lib/admin/require-export-access";

export async function GET() {
  const denied = await requireExportAccess();
  if (denied) return denied;

  try {
    const blocks = await prisma.contentBlock.findMany({
      orderBy: [{ pageSlug: "asc" }, { sectionSlug: "asc" }, { version: "desc" }],
    });

    const body = JSON.stringify(
      { exportedAt: new Date().toISOString(), contentBlocks: blocks },
      null,
      2,
    );
    return new NextResponse(body, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="lvv-content-blocks-export.json"`,
        "Cache-Control": "private, no-store, max-age=0",
      },
    });
  } catch (e) {
    console.error("export content:", e);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
