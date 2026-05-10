import { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lakeviewvillatangalle.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/stays`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/gallery`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/faq`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/visit`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/developer`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/watch/hero`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/links/airbnb`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/links/booking`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/links/instagram`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/links/facebook`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];
}