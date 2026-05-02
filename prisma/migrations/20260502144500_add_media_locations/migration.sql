-- CreateTable
CREATE TABLE "media_locations" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "pageSlug" TEXT NOT NULL,
    "sectionSlug" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "media_locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "media_locations_mediaId_pageSlug_sectionSlug_key" ON "media_locations"("mediaId", "pageSlug", "sectionSlug");

-- CreateIndex
CREATE INDEX "media_locations_pageSlug_sectionSlug_idx" ON "media_locations"("pageSlug", "sectionSlug");

-- AddForeignKey
ALTER TABLE "media_locations" ADD CONSTRAINT "media_locations_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill from legacy MediaAsset.pageSlug / sectionSlug (non-empty only)
INSERT INTO "media_locations" ("id", "mediaId", "pageSlug", "sectionSlug", "isPrimary", "order")
SELECT gen_random_uuid()::text,
       m."id",
       COALESCE(NULLIF(TRIM(m."pageSlug"), ''), 'gallery'),
       COALESCE(NULLIF(TRIM(m."sectionSlug"), ''), 'legacy'),
       true,
       0
FROM "media_assets" m
WHERE NULLIF(TRIM(COALESCE(m."pageSlug", '')), '') IS NOT NULL
   OR NULLIF(TRIM(COALESCE(m."sectionSlug", '')), '') IS NOT NULL;
