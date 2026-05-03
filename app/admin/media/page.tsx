import { auth } from "@/lib/auth/config";
import { findManyMediaAssetsForAdmin } from "@/lib/admin/media-assets-admin-query";
import { AdminMediaClient } from "@/components/admin/admin-media-client";

export const metadata = {
  title: "Media Management — LakeViewVilla Admin",
};

export default async function AdminMediaPage() {
  await auth();
  let assets: {
    id: string;
    url: string;
    title: string | null;
    alt: string | null;
    tags: string[];
    featured: boolean;
    category: string;
    type: string;
    width: number | null;
    height: number | null;
    createdAt: string;
    locations: {
      id: string;
      pageSlug: string;
      sectionSlug: string;
      isPrimary: boolean;
      order: number;
    }[];
  }[] = [];

  try {
    const dbAssets = await findManyMediaAssetsForAdmin();
    assets = dbAssets.map((a) => ({
      ...a,
      createdAt: a.createdAt.toISOString(),
    }));
  } catch {
    // DB not available — show empty state
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
          Media Management
        </h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Upload, organize, and manage all media assets
        </p>
      </div>

      <AdminMediaClient initialAssets={assets} />
    </div>
  );
}
