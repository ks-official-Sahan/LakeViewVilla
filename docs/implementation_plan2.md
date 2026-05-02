# LakeViewVilla — Complete Redesign & Platform Overhaul

> **Scope:** Full-stack redesign, admin dashboard, blog, CI/CD, SEO, performance, security
> **Stack:** Next.js 16 (App Router) · React 19 · Tailwind v4 · GSAP + Lenis · Prisma · Neon PostgreSQL · Cloudinary · NextAuth.js

---

## Current State Analysis

| Aspect | Current | Issues |
|--------|---------|--------|
| **Framework** | Next.js 16.2.4, React 19, Tailwind v4 | Good foundation, but no database/backend |
| **Auth** | None | No admin panel exists |
| **Database** | None | All content is hardcoded in `data/` files |
| **CMS/Dashboard** | None | No content management |
| **Blog** | None | Not implemented |
| **Animations** | Framer Motion + GSAP + Lenis | Fragmented, not optimized |
| **SEO** | Basic (JSON-LD, meta, sitemap) | Missing AEO/GEO/LLMO, schemas incomplete |
| **CI/CD** | None for this project | No GitHub Actions |
| **Design** | Functional but inconsistent | Light/dark theme exists but sections don't match premium standard |
| **Performance** | Good base (cacheComponents, reactCompiler) | Below-fold lazy loading works, but no ISR/PPR for dynamic content |

### File Structure (Current)
```
LakeViewVilla/
├── app/           → 6 routes (home, gallery, stays, visit, faq, developer, search)
├── components/    → 35+ components (sections, ui, ui2, layout, animations, webgl)
├── data/          → Hardcoded content (site.ts, property.ts, facilities.ts, values.ts)
├── lib/           → Utils, SEO helpers, analytics
├── config/        → Mantine theme only
├── hooks/         → 2 hooks (use-mobile, use-toast)
├── context/       → AudioContext only
└── public/        → Static assets
```

---

## User Review Required

> [!IMPORTANT]
> **Database Choice:** Plan uses **Neon PostgreSQL** (serverless, scales to zero) as primary DB with **SQLite** as offline fallback via Prisma multi-provider. Confirm this or suggest alternatives (PlanetScale, Supabase, MongoDB Atlas).

> [!IMPORTANT]
> **Auth Provider:** Plan uses **NextAuth.js v5** (Auth.js) with credentials + optional OAuth. Confirm or prefer Clerk/Supabase Auth.

> [!IMPORTANT]
> **File Storage:** Plan uses **Cloudinary** (free tier: 25GB, transformations, video support). Confirm or prefer Uploadthing/AWS S3.

> [!WARNING]
> **Scope Size:** This is a massive overhaul (~200+ files). I recommend executing in phases, deploying Phase 1-2 first, then layering 3-8. Confirm phased approach.

---

## Open Questions

> [!IMPORTANT]
> 1. **Domain for admin panel:** Should it be `/admin` route or a separate subdomain `admin.lakeviewvillatangalle.com`?
> 2. **AI Blog Generation:** OpenRouter free models have rate limits. Acceptable, or should we add a paid API key option?
> 3. **Roles:** You mentioned 3 roles (Developer > Admin > Editor/Manager). Should Developer have DB-level access or just UI superadmin?
> 4. **Backup DB sync frequency:** Real-time via triggers, or periodic (every 5min/hourly)?
> 5. **Blog URL structure:** `/blog/[slug]` or `/journal/[slug]` or custom?
> 6. **i18n:** Is multi-language support needed now or future consideration?

---

## Proposed Changes

### Phase 1: Architecture & Foundation Refactoring

#### Core Architecture

```
LakeViewVilla/
├── app/
│   ├── (public)/              → Public-facing routes (grouped)
│   │   ├── page.tsx           → Home
│   │   ├── gallery/
│   │   ├── stays/
│   │   ├── visit/
│   │   ├── faq/
│   │   ├── blog/              → [NEW] Blog pages
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── search/
│   ├── (admin)/               → [NEW] Admin dashboard (protected)
│   │   ├── layout.tsx         → Auth guard + admin shell
│   │   ├── dashboard/
│   │   ├── content/
│   │   ├── media/
│   │   ├── blog/
│   │   ├── users/
│   │   ├── audit-logs/
│   │   └── settings/
│   ├── api/
│   │   ├── auth/[...nextauth]/ → [NEW] Auth API
│   │   ├── admin/             → [NEW] Admin APIs
│   │   ├── upload/            → [NEW] File upload API
│   │   ├── blog/              → [NEW] Blog CRUD API
│   │   └── revalidate/        → [NEW] ISR on-demand
│   ├── login/                 → [NEW] Login page
│   └── middleware.ts          → [NEW] Auth + proxy middleware
├── prisma/
│   ├── schema.prisma          → [NEW] Database schema
│   ├── seed.ts                → [NEW] Initial data seed
│   └── migrations/
├── lib/
│   ├── db.ts                  → [NEW] Prisma client singleton
│   ├── auth.ts                → [NEW] NextAuth config
│   ├── cloudinary.ts          → [NEW] Upload helpers
│   ├── cache.ts               → [NEW] Cache strategies (use cache)
│   ├── ai.ts                  → [NEW] OpenRouter integration
│   ├── seo/                   → Enhanced SEO utilities
│   ├── animations/            → [NEW] Shared animation configs
│   └── utils.ts               → Enhanced utilities
├── components/
│   ├── admin/                 → [NEW] Dashboard components
│   ├── blog/                  → [NEW] Blog components
│   ├── scroll/                → [NEW] Premium scroll animations
│   ├── sections/              → Redesigned sections
│   ├── ui/                    → Unified design system
│   └── layout/                → Enhanced layouts
└── .github/workflows/         → [NEW] CI/CD pipelines
```

---

#### [NEW] prisma/schema.prisma

Database schema with full RBAC, content management, media, blog, and audit logging:

```prisma
// Key models (abbreviated):
// User (id, email, passwordHash, role: DEVELOPER|ADMIN|EDITOR, sessions)
// Session, Account (NextAuth managed)
// Media (id, url, publicId, type, category, tags, metadata, order, userId)
// MediaCategory (indoor, outdoor, kitchen, bedroom-1, bedroom-2, bathroom, guests, etc.)
// PageContent (id, pageSlug, sectionKey, content JSON, order, mediaIds, seoMeta)
// BlogPost (id, title, slug, content, excerpt, coverImage, status, seoMeta, author, tags)
// BlogTag (id, name, slug)
// AuditLog (id, userId, action, entity, entityId, changes JSON, timestamp)
// SiteSettings (key-value for global config)
// BackupSync (id, lastSyncAt, status, direction)
```

#### [MODIFY] next.config.mjs
- Add Prisma webpack config
- Add middleware matcher for `/admin`
- Enable PPR (Partial Prerendering) for hybrid pages
- Add Cloudinary to remote patterns
- Add `serverExternalPackages: ['@prisma/client']`

#### [NEW] middleware.ts
- Auth guard for `/admin/*` routes
- Redirect unauthenticated to `/login?callbackUrl=...`
- Rate limiting headers
- Security headers enhancement

---

### Phase 2: Premium Design System & Scroll Animations

#### Design Philosophy
- **Color Palette:** Retain teal/cyan lagoon theme but elevate with richer HSL tokens
- **Typography:** Montserrat (display) + Inter (body) — already loaded, refine scale
- **Motion:** GSAP ScrollTrigger + Lenis smooth scroll + Framer Motion for micro-interactions
- **Effects:** Parallax layers, reveal masks, horizontal scroll sections, text split animations

#### [MODIFY] app/globals.css
- Refined HSL token system with WCAG AAA contrast ratios
- New animation keyframes (reveal, split-text, parallax)
- Enhanced glass effects with proper light/dark mode
- Container query utilities
- Print stylesheet improvements

#### [NEW] components/scroll/ScrollReveal.tsx
Premium scroll-driven animation wrapper using GSAP ScrollTrigger:
- Fade-up, slide-in, scale, rotate, clip-path reveals
- Stagger support for lists
- `prefers-reduced-motion` respected
- GPU-accelerated (transform + opacity only)

#### [NEW] components/scroll/ParallaxSection.tsx
Multi-layer parallax with depth control, inspired by HeroScrollSequence but optimized:
- Uses `will-change: transform` sparingly
- Cleanup on unmount
- Mobile-aware (reduced parallax on touch devices)

#### [NEW] components/scroll/HorizontalScroll.tsx
Improved horizontal scroll section (inspired by HomeServicesSection):
- GSAP ScrollTrigger pinned horizontal scroll
- Snap points
- Progress indicator
- Touch/swipe support
- Keyboard navigation (a11y)

#### [NEW] components/scroll/TextSplitReveal.tsx
Character/word-level reveal animations for headings.

#### [NEW] components/scroll/SmoothScroll.tsx
Lenis provider with GSAP integration (centralized, replaces scattered init).

#### [MODIFY] components/sections/hero.tsx → Complete Redesign
- Cinematic scroll sequence with parallax layers
- Ken Burns on hero image (GPU-composited)
- Text reveal animation on load
- Scroll-triggered fade + logo morph (adapted from ValoremDistress pattern)
- Video background option (admin-configurable)

#### [MODIFY] components/sections/highlights.tsx → Redesign
- Staggered card reveals with 3D tilt
- Scroll-linked progress indicators
- Enhanced hover states with magnetic cursor effect

#### [MODIFY] All section components → Premium Redesign
Each section gets: scroll-driven entrance, consistent spacing, theme compatibility, mobile-first responsive, a11y audit pass.

---

### Phase 3: Admin Dashboard

#### [NEW] app/(admin)/layout.tsx
- Sidebar navigation (collapsible)
- Top bar with user avatar, notifications, quick actions
- Theme toggle (inherits from public site theme system)
- Breadcrumb navigation
- Protected by auth middleware

#### [NEW] app/(admin)/dashboard/page.tsx
- Overview cards (total media, blog posts, recent activity)
- Quick actions (upload media, new blog post)
- Recent audit log entries
- Site health metrics

#### [NEW] app/(admin)/content/page.tsx — Content Management
- Page-level content editor
- Section ordering (drag & drop)
- Live preview (side-by-side or overlay)
- SEO metadata editor per page/section
- Tags for pages/sections with limit warnings
- "Featured" and "New" tag support
- Undo/redo support with history stack

#### [NEW] app/(admin)/media/page.tsx — Media Library
- Grid/list view toggle
- Category filtering (all, indoor, outdoor, kitchen, bedroom-1, bedroom-2, bathroom, guests)
- Multi-file upload (drag & drop + file picker + URL upload)
- File type validation (images, videos, PDFs)
- Live upload preview with progress
- Zoomable image/video/PDF preview
- Order change (drag & drop)
- Tag management
- Cloudinary integration for transformations
- Bulk operations (delete, categorize, tag)
- URL-based upload (fetch from URL, preview, then upload)

#### [NEW] app/(admin)/blog/ — Blog Management
- Blog post CRUD with rich text editor
- AI generation (OpenRouter free model)
- Manual writing with autosave + persistence
- Undo/redo for accidental AI overwrites
- SEO metadata per post (auto-generated suggestions)
- Cover image upload
- Draft/Published/Scheduled status
- Tag management
- Preview before publish

#### [NEW] app/(admin)/users/page.tsx — User Management (RBAC)
- User list with role badges
- Create/edit/deactivate users
- Role assignment (Developer > Admin > Editor)
- Permission matrix display
- Session management

#### [NEW] app/(admin)/audit-logs/page.tsx
- Filterable audit trail
- User, action, entity, timestamp columns
- Export to CSV
- Stored in backup DB when available, falls back to main DB

#### [NEW] app/(admin)/settings/page.tsx
- Site configuration (name, contact, social links)
- SEO global settings
- Backup DB status & manual sync trigger
- Data import/export (CSV)
- Cache purge controls

#### Auth Flow
1. User navigates to any `/admin/*` route
2. Middleware checks session → no session → redirect to `/login?callbackUrl=/admin/...`
3. Login page with credentials form
4. On success → redirect to `callbackUrl` or `/admin/dashboard`
5. Logout → clear session → redirect to `/login`

---

### Phase 4: Blog System

#### [NEW] app/(public)/blog/page.tsx
- Blog listing with featured posts
- Category/tag filtering
- Search
- Pagination
- Schema.org Article markup per post

#### [NEW] app/(public)/blog/[slug]/page.tsx
- Full blog post with rich content
- Author card
- Related posts
- Social sharing
- Schema.org BlogPosting + BreadcrumbList
- Reading time estimate
- Table of contents (auto-generated)

#### AI Blog Generation Flow
1. User uploads image + writes short description
2. Clicks "Generate with AI"
3. System calls OpenRouter (free model) with structured prompt
4. Generated content appears in editor (user can edit)
5. Original manual content preserved in undo history
6. User reviews, adds SEO metadata, publishes

---

### Phase 5: Search Everywhere Optimization

#### [MODIFY] app/layout.tsx — Enhanced Global SEO
- Organization schema with full sameAs graph
- SiteNavigationElement schema
- WebSite schema with SearchAction
- llms.txt for AI crawlers

#### [NEW] public/llms.txt — AI Crawler Guide
#### [NEW] public/.well-known/ai-plugin.json — AI Discovery

#### [MODIFY] All page metadata
- E-E-A-T signals (author, dates, expertise markers)
- FAQ schema on relevant pages
- BreadcrumbList on all pages
- GEO-optimized content structure

#### Per-Page SEO Checklist
- Title tags (50-60 chars, keyword-front)
- Meta descriptions (150-160 chars)
- Open Graph with unique images per page
- Twitter cards
- Canonical URLs
- hreflang (future i18n ready)
- Schema.org (Article, FAQPage, LodgingBusiness, BlogPosting, BreadcrumbList)

---

### Phase 6: Performance & Caching

#### Rendering Strategy Map
| Route | Strategy | Rationale |
|-------|----------|-----------|
| `/` (Home) | SSG + ISR (60s) | Content changes via admin |
| `/gallery` | SSG + ISR (300s) | Media library changes |
| `/stays` | SSG + ISR (60s) | Pricing/availability |
| `/visit` | SSG | Rarely changes |
| `/faq` | SSG + ISR (300s) | FAQ updates |
| `/blog` | ISR (60s) | New posts |
| `/blog/[slug]` | ISR (300s) | Post edits |
| `/admin/*` | CSR (dynamic) | Always fresh |
| `/api/*` | Edge/Node | API routes |

#### Caching Layers
1. **React `use cache`** — Component-level caching (Next.js 16)
2. **ISR** — Page-level revalidation with on-demand triggers
3. **SWR** — Client-side data deduplication for admin
4. **Edge CDN** — Static assets with immutable headers (already configured)
5. **Prisma query caching** — Connection pooling + query deduplication

#### [NEW] lib/cache.ts
- `use cache` wrappers for data fetching
- Revalidation tag system
- On-demand revalidation API for admin actions

#### Core Web Vitals Targets
| Metric | Target | Strategy |
|--------|--------|----------|
| LCP | < 2.0s | Preload hero image, priority flag, optimized formats |
| INP | < 150ms | React Compiler, minimal hydration, `startTransition` |
| CLS | < 0.05 | Explicit dimensions, font-display:swap, skeleton screens |

---

### Phase 7: GitHub Actions CI/CD

#### [NEW] .github/workflows/ci.yml
```yaml
# Triggers: push to main, PRs
# Jobs:
# 1. Lint (ESLint + TypeScript check)
# 2. Unit Tests
# 3. Build verification
# 4. Lighthouse CI (performance budgets)
# 5. Bundle size check (vs main)
```

#### [NEW] .github/workflows/preview.yml
```yaml
# Triggers: PR opened/updated
# Jobs:
# 1. Build + Deploy preview to Vercel
# 2. Comment PR with preview URL
# 3. Run Lighthouse on preview
```

#### [NEW] .github/workflows/production.yml
```yaml
# Triggers: push to main (after merge), manual dispatch
# Jobs:
# 1. Full CI pipeline
# 2. Database migrations (if changed)
# 3. Deploy to Vercel production
# 4. Health check
# 5. Deployment summary
```

#### [NEW] .github/workflows/security.yml
```yaml
# Triggers: weekly schedule, PR
# Jobs:
# 1. npm audit
# 2. Dependency review
# 3. CodeQL analysis
```

---

### Phase 8: Security & Testing

#### Security Measures
- CSRF protection on all mutation APIs
- Rate limiting on auth endpoints
- Input validation with Zod on all API routes
- SQL injection prevention (Prisma parameterized)
- XSS prevention (React default + CSP headers already strong)
- Secure file upload (type checking, size limits, virus scan consideration)
- Password hashing with bcrypt (12 rounds)
- JWT session with httpOnly cookies
- Audit logging for all admin actions

#### Testing Strategy
- **Unit:** Vitest for utilities and data transformations
- **Integration:** API route testing with supertest patterns
- **E2E:** Playwright for critical flows (login, upload, blog CRUD)
- **Visual:** Playwright screenshot comparisons
- **a11y:** axe-core integration in CI

---

## Verification Plan

### Automated Tests
1. `npm run lint` — ESLint + TypeScript
2. `npm run test` — Vitest unit tests
3. `npx playwright test` — E2E flows
4. `npx next build` — Production build verification
5. Lighthouse CI — Performance budgets (LCP < 2.5s, CLS < 0.1, INP < 200ms)

### Manual Verification
1. Test all scroll animations on mobile (iOS Safari, Chrome Android)
2. Test admin dashboard RBAC (all 3 roles)
3. Test file upload flows (drag & drop, URL upload, multi-file)
4. Test blog AI generation + undo/redo
5. Test dark/light theme across all pages
6. Test `prefers-reduced-motion` behavior
7. WCAG AAA contrast validation with axe DevTools
8. Test offline fallback behavior (SQLite sync)

---

## Execution Order (Recommended)

```
Phase 1: Architecture & Foundation ──────── Week 1-2
Phase 2: Design System & Animations ─────── Week 2-3
Phase 3: Admin Dashboard ────────────────── Week 3-5
Phase 4: Blog System ────────────────────── Week 5-6
Phase 5: SEO Optimization ──────────────── Week 6-7
Phase 6: Performance & Caching ─────────── Week 7
Phase 7: CI/CD Pipelines ───────────────── Week 7-8
Phase 8: Security & Testing ────────────── Week 8
```

> [!TIP]
> Each phase is independently deployable. Phase 1-2 can ship as v2.0, Phase 3-4 as v2.1, etc.

---

## Dependencies to Install

```bash
# Database & Auth
npm i @prisma/client next-auth@beta @auth/prisma-adapter bcryptjs
npm i -D prisma @types/bcryptjs

# File Upload
npm i cloudinary next-cloudinary

# Blog & AI
npm i @tiptap/react @tiptap/starter-kit @tiptap/extension-image openai

# Admin UI
npm i @tanstack/react-table @tanstack/react-query react-dropzone sonner
npm i @dnd-kit/core @dnd-kit/sortable

# Testing
npm i -D vitest @vitejs/plugin-react playwright @axe-core/playwright
```
