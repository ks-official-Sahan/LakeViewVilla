## Keyword Registry — Last Updated: 2025-05-18

| Page       | Primary Keyword           | Secondary Keywords                         | Intent      | Updated    |
|------------|---------------------------|--------------------------------------------|-------------|------------|
| /          | private villa Tangalle    | Lake View Villa Tangalle, lagoon stay, Sri Lanka vacation rental | brand       | 2025-05-24 |
| /gallery   | Tangalle villa photos     | Lake View Villa Tangalle gallery, lagoon view images | commercial  | 2025-05-24 |
| /stays     | Tangalle accommodation    | private room Tangalle, Tangalle rental, best places to stay in Tangalle | transactional | 2025-05-24 |
| /visit     | things to do in Tangalle  | Tangalle attractions, Sri Lanka south coast | informational | 2025-05-24 |
| /faq       | Tangalle villa FAQ        | booking Tangalle, Lake View Villa directions | informational | 2025-05-24 |

## 2025-05-24 — Multi-Tiered Crawler Architecture & LLMO
**Learning:** Agentic AI crawlers (like Manus) and advanced search engine bots (Googlebot, Bingbot) need Full Render Access to understand visual hierarchy. Blocking `/_next/` universally starves them of CSS/JS, destroying structural indexing context.
**Action:** Implemented a multi-tiered `robots.ts` that explicitly allows `/_next/static/` for render-aware crawlers (Googlebot, GPTBot, ClaudeBot, PerplexityBot, Applebot, Manus), while keeping it blocked for general text scrapers to save bandwidth.
**Action:** Created `public/llms.txt` for entity-dense AI context to boost LLMO (Large Language Model Optimization).
