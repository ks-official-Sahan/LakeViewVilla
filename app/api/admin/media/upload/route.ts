import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/db/prisma";
import { MediaType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { bumpMediaAndGalleryCache } from "@/lib/cache/tags";
import { uploadToCloudinary, validateFile, isCloudinaryConfigured } from "@/lib/admin/upload";
import { audit } from "@/lib/admin/audit";
import {
  defaultGalleryLocationCreate,
  legacyGallerySlugFields,
} from "@/lib/media/default-gallery-location";

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 40;
const RATE_LIMIT_WINDOW = 60 * 1000;

const MAX_FILE_SIZE = 20 * 1024 * 1024;

function extFromName(name: string): string {
  const m = name.match(/\.([a-zA-Z0-9]+)$/);
  return m ? m[1].toLowerCase() : "bin";
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireRole("EDITOR");

    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        {
          error:
            "Cloudinary is not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET.",
        },
        { status: 503 },
      );
    }

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

      const validation = validateFile(file.type, file.size);
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error ?? "Invalid file" }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const safeStem = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");

      const uploaded = await uploadToCloudinary(buffer, {
        folder: `lakeviewvilla/${category}`,
        publicId: `${Date.now()}_${i}_${safeStem || "upload"}`,
        resourceType: file.type.startsWith("video/")
          ? "video"
          : file.type === "application/pdf"
            ? "raw"
            : "image",
        tags: [category],
      });

      let mediaType: MediaType = MediaType.OTHER;
      if (uploaded.resourceType === "image") mediaType = MediaType.IMAGE;
      else if (uploaded.resourceType === "video") mediaType = MediaType.VIDEO;
      else if (uploaded.resourceType === "raw") mediaType = MediaType.PDF;

      const mediaAsset = await prisma.mediaAsset.create({
        data: {
          url: uploaded.url,
          publicId: uploaded.publicId,
          type: mediaType,
          category,
          title: file.name,
          width: uploaded.width,
          height: uploaded.height,
          sizeBytes: uploaded.sizeBytes,
          mimeType: file.type || `application/${extFromName(file.name)}`,
          uploadedById: session.user.id,
          ...legacyGallerySlugFields,
          locations: defaultGalleryLocationCreate,
        },
      });

      await audit({
        userId: session.user.id,
        action: "UPLOAD",
        entityType: "MediaAsset",
        entityId: mediaAsset.id,
        ipAddress: ip,
        userAgent: req.headers.get("user-agent") ?? undefined,
        newValue: { url: uploaded.url, category },
      });

      created.push(mediaAsset);
    }

    revalidatePath("/admin/media");
    revalidatePath("/gallery");
    bumpMediaAndGalleryCache();

    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: message }, { status: 401 });
    }
    if (message === "FORBIDDEN") {
      return NextResponse.json({ error: message }, { status: 403 });
    }
    console.error("Admin upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 },
    );
  }
}
