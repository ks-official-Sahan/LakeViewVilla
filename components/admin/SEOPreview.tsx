"use client";

import { Globe, Twitter, Facebook } from "lucide-react";
import Image from "next/image";

interface SEOPreviewProps {
  title: string;
  description: string;
  slug?: string;
  imageUrl?: string;
  siteName?: string;
  siteUrl?: string;
}

const MAX_TITLE = 60;
const MAX_DESC = 160;

// ─── Google SERP Preview ────────────────────────────────────────────────────

function GooglePreview({
  title,
  description,
  slug,
  siteUrl,
}: Omit<SEOPreviewProps, "imageUrl" | "siteName">) {
  const displayUrl = siteUrl
    ? `${siteUrl.replace(/https?:\/\//, "")}/blog/${slug ?? ""}`
    : `lakeviewvillatangalle.com/blog/${slug ?? ""}`;

  const titleTrimmed = title.length > MAX_TITLE ? `${title.slice(0, MAX_TITLE)}…` : title;
  const descTrimmed =
    description.length > MAX_DESC ? `${description.slice(0, MAX_DESC)}…` : description;

  return (
    <div className="max-w-2xl rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      {/* Breadcrumb URL */}
      <p className="mb-1 flex items-center gap-1 text-xs text-gray-600">
        <Globe className="h-3 w-3 text-gray-400" />
        <span className="truncate">{displayUrl}</span>
      </p>
      {/* Title */}
      <h3
        className="line-clamp-2 text-lg font-medium text-blue-700 hover:underline"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        {titleTrimmed || <span className="text-gray-400 italic">Title not set</span>}
      </h3>
      {/* Description */}
      <p
        className="mt-1 line-clamp-2 text-sm text-gray-600"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        {descTrimmed || (
          <span className="italic text-gray-400">Meta description not set</span>
        )}
      </p>
      {/* Character counters */}
      <div className="mt-2 flex gap-4 text-xs">
        <span className={title.length > MAX_TITLE ? "text-red-500" : "text-gray-400"}>
          Title: {title.length}/{MAX_TITLE}
        </span>
        <span
          className={description.length > MAX_DESC ? "text-red-500" : "text-gray-400"}
        >
          Desc: {description.length}/{MAX_DESC}
        </span>
      </div>
    </div>
  );
}

// ─── Twitter/X Card Preview ─────────────────────────────────────────────────

function TwitterPreview({
  title,
  description,
  imageUrl,
  siteUrl,
}: Omit<SEOPreviewProps, "slug">) {
  const host = siteUrl?.replace(/https?:\/\//, "") ?? "lakeviewvillatangalle.com";

  return (
    <div className="max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {imageUrl ? (
        <div className="relative h-44 w-full bg-gray-100">
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        </div>
      ) : (
        <div className="flex h-44 w-full items-center justify-center bg-gradient-to-br from-teal-100 to-cyan-50">
          <Twitter className="h-10 w-10 text-teal-300" />
        </div>
      )}
      <div className="p-3">
        <p className="text-xs text-gray-500">{host}</p>
        <h4 className="mt-0.5 line-clamp-2 text-sm font-bold text-gray-900">
          {title || <span className="italic text-gray-400">No title</span>}
        </h4>
        <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">
          {description || <span className="italic">No description</span>}
        </p>
      </div>
    </div>
  );
}

// ─── Facebook OG Card Preview ───────────────────────────────────────────────

function FacebookPreview({
  title,
  description,
  imageUrl,
  siteUrl,
}: Omit<SEOPreviewProps, "slug">) {
  const host = siteUrl?.replace(/https?:\/\//, "").toUpperCase() ?? "LAKEVIEWVILLATANGALLE.COM";

  return (
    <div className="max-w-sm overflow-hidden rounded-lg border border-gray-300 bg-[#f0f2f5] shadow-sm">
      {imageUrl ? (
        <div className="relative h-44 w-full bg-gray-200">
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        </div>
      ) : (
        <div className="flex h-44 w-full items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-50">
          <Facebook className="h-10 w-10 text-blue-300" />
        </div>
      )}
      <div className="border-t border-gray-300 bg-[#f0f2f5] p-3">
        <p className="text-[11px] uppercase text-gray-500">{host}</p>
        <h4 className="mt-0.5 line-clamp-2 text-sm font-semibold text-gray-900">
          {title || <span className="italic text-gray-400">No title</span>}
        </h4>
        <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">
          {description || <span className="italic">No description</span>}
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function SEOPreview({
  title = "",
  description = "",
  slug = "",
  imageUrl,
  siteName = "Lake View Villa Tangalle",
  siteUrl = "https://lakeviewvillatangalle.com",
}: SEOPreviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--color-foreground)]">
          <Globe className="h-4 w-4" /> Google Search Preview
        </h4>
        <GooglePreview
          title={title}
          description={description}
          slug={slug}
          siteUrl={siteUrl}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--color-foreground)]">
            <Twitter className="h-4 w-4" /> Twitter / X Card
          </h4>
          <TwitterPreview
            title={title}
            description={description}
            imageUrl={imageUrl}
            siteUrl={siteUrl}
          />
        </div>
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--color-foreground)]">
            <Facebook className="h-4 w-4" /> Facebook OG Card
          </h4>
          <FacebookPreview
            title={title}
            description={description}
            imageUrl={imageUrl}
            siteUrl={siteUrl}
          />
        </div>
      </div>
    </div>
  );
}
