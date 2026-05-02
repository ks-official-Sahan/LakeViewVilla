import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/config";
import { MediaGrid } from "@/components/admin/media-grid";

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
    const dbAssets = await prisma.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        url: true,
        title: true,
        alt: true,
        tags: true,
        featured: true,
        category: true,
        type: true,
        width: true,
        height: true,
        createdAt: true,
        locations: {
          orderBy: [{ order: "asc" }, { pageSlug: "asc" }],
          select: {
            id: true,
            pageSlug: true,
            sectionSlug: true,
            isPrimary: true,
            order: true,
          },
        },
      },
    });

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

      <MediaGrid initialAssets={assets} />
    </div>
  );
}
