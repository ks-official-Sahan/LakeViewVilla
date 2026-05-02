import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { can } from "@/lib/auth/permissions";

/** Gate `/api/admin/export/*` — Developer-only (`importExport` permission). */
export async function requireExportAccess(): Promise<Response | null> {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!can(session.user.role, "importExport")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}
