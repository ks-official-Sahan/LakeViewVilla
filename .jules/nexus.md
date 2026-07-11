## Keyword Registry — Last Updated: 2025-05-30

| Page       | Primary Keyword           | Secondary Keywords                         | Intent      | Updated    |
|------------|---------------------------|--------------------------------------------|-------------|------------|
| /          | private villa Tangalle    | Lake View Villa Tangalle, lagoon stay, Sri Lanka vacation rental, private vacation rental for vacationers 2026, best private vacation rental 2026, Tangalle villa alternative | brand       | 2025-05-30 |
| /gallery   | Tangalle villa photos     | Lake View Villa Tangalle gallery, lagoon view images | commercial  | 2025-05-30 |
| /stays     | Tangalle accommodation    | private room Tangalle, Tangalle rental, best places to stay in Tangalle | transactional | 2025-05-30 |
| /visit     | things to do in Tangalle  | Tangalle attractions, Sri Lanka south coast | informational | 2025-05-30 |
| /faq       | Tangalle villa FAQ        | booking Tangalle, Lake View Villa directions | informational | 2025-05-30 |

## 2025-05-30 — Crawler Freshness & Agentic Access Optimization
**Learning:** Agentic AI crawlers and Googlebot need `/_next/static/` access to parse Next.js 16 CSS/JS for visual hierarchy interpretation, otherwise ranking/citation drops. Also, to ensure rapid ingestion by search engines, deployment pipelines should ping IndexNow immediately after build.
**Action:** Updated `app/robots.ts` with explicit `allow: ["/", "/_next/static/"]` for multi-tiered crawlers. Documented that IndexNow trigger must be pinged post-build.

## 2026-01-01 — VideoObject Schema Optimization
**Learning:** For any page containing video content, `VideoObject` indexing schema must be unconditionally injected to satisfy schema constraints for AI extraction. Name and descriptions must be semantic and keyword rich.
**Action:** Updated dynamic VideoObject schema generator in `experiences-reel.tsx` to strictly include keyword rich product-name appending (`- Lake View Villa Tangalle`).
