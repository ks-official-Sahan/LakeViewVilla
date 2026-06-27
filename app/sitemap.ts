import { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lakeviewvillatangalle.com';

// ⚠️ DEPLOYMENT PIPELINE REQUIREMENT ⚠️
// To facilitate IndexNow protocols and maintain freshness for AI citations,
// the deployment pipeline must trigger a ping to the IndexNow API upon build completion:
// https://api.indexnow.org/indexnow?url=[URL]&key=[KEY]
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/stays`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/gallery`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/faq`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/visit`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/developer`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];
}