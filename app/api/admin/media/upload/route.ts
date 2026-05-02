import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/db/prisma";
import { MediaType } from "@prisma/client";
import { revalidatePath } from "next/cache";

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 40;
const RATE_LIMIT_WINDOW = 60 * 1000;

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "application/pdf",
];

export async function POST(req: NextRequest) {
  try {
    const session = await requireRole("EDITOR");

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW;

    let rateData = rateLimitMap.get(ip) || { count: 0, lastReset: now };
    if (rateData.lastReset < windowStart) {
      rateData = { count: 0, lastReset: now };
    }

    const formData = await req.formData();
    const rawFiles = formData.getAll("files");
    const files = rawFiles.filter((f): f is File => typeof f !== "string" && f.size > 0);

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    if (rateData.count + files.length > RATE_LIMIT) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    rateData.count += files.length;
    rateLimitMap.set(ip, rateData);

    const category = (formData.get("category") as string) || "all";
    const created = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: `File "${file.name}" exceeds size limit` }, { status: 400 });
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ error: `Unsupported type for ${file.name}: ${file.type}` }, { status: 400 });
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "");
      const mockUrl = `/images/uploads/${Date.now()}-${i}-${safeName}`;

      let mediaType: MediaType = MediaType.OTHER;
      if (file.type.startsWith("image/")) mediaType = MediaType.IMAGE;
      else if (file.type.startsWith("video/")) mediaType = MediaType.VIDEO;
      else if (file.type === "application/pdf") mediaType = MediaType.PDF;

      const mediaAsset = await prisma.mediaAsset.create({
        data: {
          url: mockUrl,
          type: mediaType,
          category,
          title: file.name,
          sizeBytes: file.size,
          mimeType: file.type,
          uploadedById: session.user.id,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: "UPLOAD",
          entityType: "MediaAsset",
          entityId: mediaAsset.id,
          ipAddress: ip,
          userAgent: req.headers.get("user-agent") || undefined,
        },
      });

      created.push(mediaAsset);
    }

    revalidatePath("/admin/media");
    revalidatePath("/gallery");

    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "";
    if (message === "UNAUTHORIZED" || message === "FORBIDDEN") {
      return NextResponse.json({ error: message }, { status: 401 });
    }
    console.error("Admin upload error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
