import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/db/prisma";
import { mediaLocationsTableExists } from "@/lib/db/media-locations-table";
import { MediaType } from "@prisma/client";
import {
  defaultGalleryLocationCreate,
  legacyGallerySlugFields,
} from "@/lib/media/default-gallery-location";

// Very basic in-memory rate limiter for uploads to prevent abuse
// (In production, replace with Redis/Upstash)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 20; // 20 uploads
const RATE_LIMIT_WINDOW = 60 * 1000; // per minute

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];

export async function POST(req: NextRequest) {
  try {
    // 1. Auth & RBAC Check
    const session = await requireRole("EDITOR");

    // 2. Rate Limiting Check
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW;

    let rateData = rateLimitMap.get(ip) || { count: 0, lastReset: now };
    if (rateData.lastReset < windowStart) {
      rateData = { count: 0, lastReset: now };
    }
    
    if (rateData.count >= RATE_LIMIT) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    
    rateData.count++;
    rateLimitMap.set(ip, rateData);

    // 3. Form Data Extraction
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "all";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 4. File Upload Security Validation (Phase 7)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    // 5. Upload Processing
    // In a real app, you would upload to Cloudinary or S3 here.
    // For this boilerplate, we'll simulate the upload and just create the DB record.
    await file.arrayBuffer(); // validate readable stream (real pipeline would upload bytes)
    // const base64 = Buffer.from(buffer).toString('base64');
    // const uploadResult = await cloudinary.uploader.upload(`data:${file.type};base64,${base64}`);

    // Mock successful upload URL
    const mockUrl = `/images/uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
    let mediaType: MediaType = MediaType.OTHER;
    if (file.type.startsWith("image/")) mediaType = MediaType.IMAGE;
    else if (file.type === "application/pdf") mediaType = MediaType.PDF;

    // 6. DB Record Creation
    const hasJoin = await mediaLocationsTableExists();
    const mediaAsset = await prisma.mediaAsset.create({
      data: {
        url: mockUrl,
        type: mediaType,
        category,
        title: file.name,
        sizeBytes: file.size,
        mimeType: file.type,
        uploadedById: session.user.id,
        ...legacyGallerySlugFields,
        ...(hasJoin ? { locations: defaultGalleryLocationCreate } : {}),
      },
    });

    // 7. Audit Logging
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

    return NextResponse.json({ success: true, data: mediaAsset }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "";
    if (message === "UNAUTHORIZED" || message === "FORBIDDEN") {
      return NextResponse.json({ error: message }, { status: 401 });
    }
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
