import { NextRequest, NextResponse } from "next/server";
import { deleteMediaAsset } from "@/lib/actions/media";

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const result = await deleteMediaAsset(id);
    if (!result.success) {
      return NextResponse.json({ error: result.error ?? "Delete failed" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }
    if (message === "FORBIDDEN") {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }
    console.error("Admin media delete:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
