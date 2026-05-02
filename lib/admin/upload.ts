import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

/**
 * Configure Cloudinary from env on every call (no module-level init).
 * Ensures Turbopack HMR and serverless cold starts always see current env.
 */
export function ensureCloudinaryConfigured(): boolean {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    return true;
  }

  const rawUrl = process.env.CLOUDINARY_URL?.trim();
  if (rawUrl?.startsWith("cloudinary://")) {
    const rest = rawUrl.slice("cloudinary://".length);
    const at = rest.lastIndexOf("@");
    if (at > 0) {
      const credPart = rest.slice(0, at);
      const cloud = rest.slice(at + 1);
      const colonIdx = credPart.indexOf(":");
      if (colonIdx > 0) {
        const key = credPart.slice(0, colonIdx);
        const secret = credPart.slice(colonIdx + 1);
        if (cloud && key && secret) {
          cloudinary.config({
            cloud_name: cloud,
            api_key: key,
            api_secret: secret,
            secure: true,
          });
          return true;
        }
      }
    }
  }

  return false;
}

export function isCloudinaryConfigured(): boolean {
  return ensureCloudinaryConfigured();
}

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];
const ALLOWED_DOC_TYPES = ["application/pdf"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export type UploadResult = {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  sizeBytes: number;
  resourceType: "image" | "video" | "raw";
};

/**
 * Validate file before upload
 */
export function validateFile(
  mimeType: string,
  sizeBytes: number,
): { valid: boolean; error?: string } {
  const isImage = ALLOWED_IMAGE_TYPES.includes(mimeType);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(mimeType);
  const isDoc = ALLOWED_DOC_TYPES.includes(mimeType);

  if (!isImage && !isVideo && !isDoc) {
    return {
      valid: false,
      error: `File type "${mimeType}" is not allowed. Accepted: JPEG, PNG, WebP, AVIF, GIF, SVG, MP4, WebM, PDF.`,
    };
  }

  if (isImage && sizeBytes > MAX_IMAGE_SIZE) {
    return { valid: false, error: `Image exceeds ${MAX_IMAGE_SIZE / 1024 / 1024}MB limit.` };
  }

  if (isVideo && sizeBytes > MAX_VIDEO_SIZE) {
    return { valid: false, error: `Video exceeds ${MAX_VIDEO_SIZE / 1024 / 1024}MB limit.` };
  }

  return { valid: true };
}

/**
 * Upload a file buffer to Cloudinary.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  options: {
    folder?: string;
    publicId?: string;
    resourceType?: "image" | "video" | "raw" | "auto";
    tags?: string[];
  } = {},
): Promise<UploadResult> {
  if (!ensureCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, or CLOUDINARY_URL.",
    );
  }

  const { folder = "lakeviewvilla", publicId, resourceType = "auto", tags = [] } = options;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: resourceType,
        tags,
        quality: "auto:best",
        fetch_format: "auto",
        flags: "progressive",
        transformation: resourceType === "image"
          ? [{ quality: "auto:best", fetch_format: "auto" }]
          : undefined,
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
          return;
        }
        if (!result) {
          reject(new Error("Cloudinary returned no result"));
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width ?? 0,
          height: result.height ?? 0,
          format: result.format,
          sizeBytes: result.bytes,
          resourceType: result.resource_type as "image" | "video" | "raw",
        });
      },
    );

    uploadStream.end(buffer);
  });
}

/**
 * Upload from a URL (useful for external image import).
 */
export async function uploadFromUrl(
  url: string,
  options: {
    folder?: string;
    tags?: string[];
  } = {},
): Promise<UploadResult> {
  if (!ensureCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured.");
  }

  const { folder = "lakeviewvilla", tags = [] } = options;

  const result: UploadApiResponse = await cloudinary.uploader.upload(url, {
    folder,
    resource_type: "auto",
    tags,
    quality: "auto:best",
    fetch_format: "auto",
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width ?? 0,
    height: result.height ?? 0,
    format: result.format,
    sizeBytes: result.bytes,
    resourceType: result.resource_type as "image" | "video" | "raw",
  };
}

/**
 * Delete a file from Cloudinary by public ID.
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image",
): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result.result === "ok";
  } catch (error) {
    console.error("[Upload] Cloudinary delete failed:", error);
    return false;
  }
}

/**
 * Generate an optimized URL for a Cloudinary asset.
 */
export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
    crop?: string;
  } = {},
): string {
  const {
    width,
    height,
    quality = "auto:best",
    format = "auto",
    crop = "fill",
  } = options;

  return cloudinary.url(publicId, {
    width,
    height,
    quality,
    fetch_format: format,
    crop,
    secure: true,
  });
}
