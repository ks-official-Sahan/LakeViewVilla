# LakeViewVilla — Complete Redesign & Platform Overhaul

> **Scope**: Full-stack redesign, admin dashboard, blog system, SEO optimization, CI/CD  
> **Current Stack**: Next.js 16, React 19, Tailwind v4, GSAP, Framer Motion, Lenis  
> **Target**: Premium villa showcase + CMS dashboard + Blog + AI content generation

---

## User Review Required

> [!IMPORTANT]
> **Database Selection**: Plan uses **Neon PostgreSQL** (primary) + **SQLite** (offline fallback) with **Prisma ORM**. MongoDB is also an option — confirm preference.

> [!IMPORTANT]
> **Auth Provider**: Plan uses **NextAuth.js v5** (Auth.js) with credentials + magic link. Alternatives: Clerk, Lucia. Confirm preference.

> [!IMPORTANT]
> **File Storage**: Plan uses **Cloudinary** (best free tier for images/video, built-in transforms, CDN). Alternative: UploadThing, AWS S3. Confirm preference.

> [!IMPORTANT]
> **AI Blog Generation**: Plan uses **OpenRouter** free models (e.g., `meta-llama/llama-3.1-8b-instruct:free`). Confirm if acceptable.

> [!WARNING]
> **Breaking Change**: The entire `data/` directory with hardcoded content will migrate to database-driven content. Static fallbacks will remain for offline/build scenarios.

---

## Open Questions

> [!IMPORTANT]
> 1. **Domain**: Will the admin dashboard live at `/admin` or a separate subdomain (e.g., `admin.lakeviewvillatangalle.com`)?
> 2. **Email Provider**: For auth magic links and notifications — Resend, SendGrid, or other?
> 3. **Redis Provider**: Upstash (serverless) vs self-hosted? Upstash recommended for Vercel.
> 4. **Existing Developer Page**: Keep `/developer` page as-is, redesign it, or remove?
> 5. **Gallery Categories**: The current gallery is flat. Confirm categories: `all | indoor | outdoor | kitchen | bedroom-1 | bedroom-2 | bathroom | with-guests | garden | lake-view | drone | dining`?
> 6. **Blog URL structure**: `/blog/[slug]` or `/journal/[slug]`?
> 7. **Localization**: English only, or plan for Sinhala/other languages?

---

## Proposed Architecture

```mermaid
graph TB
    subgraph "Public Site"
        A[Next.js 16 App Router] --> B[Premium Landing Pages]
        A --> C[Blog System]
        A --> D[Gallery + Media]
    end

    subgraph "Admin Dashboard"
        E[/admin routes] --> F[Auth Guard + RBAC]
        F --> G[Content Manager]
        F --> H[Media Manager]
        F --> I[Blog Editor]
        F --> J[Settings + Audit]
    end

    subgraph "Data Layer"
        K[Prisma ORM] --> L[(Neon PostgreSQL)]
        K --> M[(SQLite Fallback)]
        N[Cloudinary SDK] --> O[CDN Assets]
        P[Upstash Redis] --> Q[Cache Layer]
    end

    subgraph "AI Layer"
        R[OpenRouter API] --> S[Blog Generation]
        R --> T[SEO Metadata Generation]
    end

    A --> K
    E --> K
    A --> P
    G --> N
    I --> R
```

---

## Tech Stack Decisions

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Framework** | Next.js 16 (App Router) | Already in use, PPR/ISR/RSC support |
| **Database** | Neon PostgreSQL + Prisma | Serverless-native, branching, auto-scaling |
| **Fallback DB** | better-sqlite3 via Prisma | Offline reads, local dev, sync on reconnect |
| **Auth** | Auth.js v5 (NextAuth) | Built-in Next.js integration, RBAC via adapter |
| **File Storage** | Cloudinary | Free tier, transforms, video, CDN, AI tagging |
| **Cache** | Upstash Redis | Serverless Redis, Vercel-native, rate limiting |
| **Animations** | GSAP + Lenis + Framer Motion | Already in use, upgrade scroll animations |
| **State** | React Query (TanStack) | Server state, optimistic updates, cache |
| **Styling** | Tailwind v4 + CSS variables | Already in use, design token system |
| **Blog** | MDX + DB hybrid | Rich content + database metadata |
| **AI** | OpenRouter (free tier) | Blog generation, SEO metadata |
| **CI/CD** | GitHub Actions + Vercel | Automated deployments, checks |
| **Monitoring** | Vercel Analytics + Web Vitals | Already partially in place |

---

## Proposed Changes

### Phase 1: Architecture & Infrastructure Foundation

> Foundation layer — database, auth, project restructure. **Must complete first.**

#### [NEW] `prisma/schema.prisma`
- User model (id, email, name, role: DEVELOPER|ADMIN|EDITOR, avatar, createdAt)
- Session, Account, VerificationToken models (Auth.js)
- Media model (id, url, publicId, type, category, tags[], alt, caption, width, height, size, uploadedBy, createdAt)
- Page model (id, slug, title, sections JSON, metadata JSON, status, updatedBy)
- BlogPost model (id, slug, title, excerpt, content, coverImage, author, tags[], category, status: DRAFT|PUBLISHED|ARCHIVED, seoMeta JSON, aiGenerated, publishedAt, createdAt)
- AuditLog model (id, userId, action, entity, entityId, changes JSON, ip, createdAt)
- SiteSettings model (id, key, value JSON, updatedBy, updatedAt)

#### [NEW] `lib/db/index.ts`
- Prisma client singleton with connection pooling
- Fallback SQLite logic: detect Neon availability, fallback to readonly SQLite
- Sync mechanism: queue writes when offline, replay on reconnect

#### [NEW] `lib/db/sync.ts`
- SQLite ↔ Neon sync engine
- Conflict resolution (Neon wins, SQLite is readonly fallback)
- Periodic sync via cron API route

#### [NEW] `lib/auth/index.ts`
- Auth.js v5 configuration
- PrismaAdapter for user storage
- Credentials provider (bcrypt hashed passwords)
- Session strategy: JWT (for edge middleware)
- Role-based access helpers: `requireRole('ADMIN')`

#### [NEW] `middleware.ts` (Next.js 16 proxy middleware)
- Auth session validation for `/admin/*` routes
- Redirect unauthenticated users to `/admin/login?callbackUrl=...`
- Rate limiting via Upstash Redis
- Security headers injection

#### [NEW] `lib/cache/index.ts`
- Upstash Redis client
- `cacheGet`, `cacheSet`, `cacheInvalidate` helpers
- React `cache()` directive wrappers for server components
- Tag-based invalidation for ISR

#### [MODIFY] `next.config.mjs`
- Add Prisma webpack config
- Configure ISR revalidation defaults
- Add `/admin` route group
- Enable PPR (Partial Prerendering) experimental flag
- Update CSP for Cloudinary, OpenRouter domains

#### [MODIFY] `package.json`
- Add: `@prisma/client`, `prisma`, `better-sqlite3`, `next-auth`, `@auth/prisma-adapter`
- Add: `cloudinary`, `@upstash/redis`, `@upstash/ratelimit`, `@tanstack/react-query`
- Add: `bcryptjs`, `zod`, `sonner` (toast), `react-dropzone`, `sharp`
- Add: `openai` (OpenRouter-compatible), `gray-matter`, `rehype-*`, `remark-*`

---

### Phase 2: Design System & Premium Theme Engine

> Complete visual identity overhaul with WCAG 2.2 AAA compliance.

#### [NEW] `lib/design-system/tokens.ts`
- Color palette: Lagoon Teal primary, Deep Ocean secondary, Sunset Gold accent
- Light/Dark theme token maps (HSL-based, 7:1+ contrast ratios)
- Spacing scale (4px base, golden ratio progression)
- Typography scale (1.333 ratio — "Perfect Fourth")
- Shadow elevation system (5 levels)
- Animation duration/easing tokens
- Breakpoint tokens with container queries

#### [MODIFY] `app/globals.css`
- Complete theme variable overhaul for WCAG 2.2 AAA
- New glass morphism variables (theme-aware, light mode fixed)
- Scroll-driven animation CSS (e.g., `animation-timeline: scroll()`)
- View transition API styles
- Container query utilities
- Print stylesheet improvements
- High contrast media query support
- Focus-visible ring system (2px solid, 2px offset, primary color)

#### [NEW] `components/ui/theme-switch.tsx`
- Animated theme toggle (sun/moon morph)
- System preference detection
- Smooth color-scheme transition (view transitions API)

#### [MODIFY] `tailwind.config.ts`
- Extended design tokens from `tokens.ts`
- Container query plugin
- Typography plugin for prose styles
- Custom animation keyframes for premium effects

---

### Phase 3: Premium Frontend Redesign

> Scroll-driven storytelling, cinematic animations, premium UX.

#### [MODIFY] `components/sections/hero.tsx` → Complete Redesign
- Multi-layer parallax hero (3+ depth layers via GSAP ScrollTrigger)
- Ken Burns effect on background with smooth zoom
- Cinematic text reveal (word-by-word stagger animation)
- Particle/aurora effect overlay (Three.js or CSS)
- Scroll-down indicator with Lottie animation
- Video background option (managed from admin)
- `prefers-reduced-motion` full fallback

#### [NEW] `components/scroll/ScrollSequenceHero.tsx`
- Inspired by ValoremDistress HeroScrollSequence but improved:
  - GPU-composited layers only (transform + opacity)
  - Lenis smooth scroll integration (no scrollerProxy conflicts)
  - Progressive image loading for background layers
  - Responsive breakpoint-aware scroll distances
  - Will-change management (add on scroll start, remove on end)

#### [NEW] `components/scroll/HorizontalScrollSection.tsx`
- Improved horizontal scroll gallery (inspired by HomeServicesSection)
- Snap points for mobile touch
- Progress indicator
- Keyboard navigation support
- `IntersectionObserver`-based lazy loading

#### [NEW] `components/scroll/ParallaxSection.tsx`
- Reusable parallax wrapper with configurable depth
- CSS `animation-timeline: scroll()` with GSAP fallback
- Automatic GPU layer promotion
- Reduced motion: static positioning

#### [NEW] `components/scroll/RevealOnScroll.tsx`
- Configurable reveal animations (fade-up, slide-in, scale, clip-path reveal)
- Stagger support for child elements
- `once` mode (animate in, stay)
- Threshold-based triggering

#### [NEW] `components/scroll/SmoothScroll.tsx`
- Lenis provider with GSAP bridge
- Configurable lerp, duration, orientation
- Touch device detection (disable virtual scroll on mobile)
- `anchor` scroll support for navigation

#### [MODIFY] `components/sections/highlights.tsx`
- 3D tilt cards with magnetic cursor effect
- Staggered reveal with clip-path animations
- Theme-aware gradients and shadows
- Interactive icon animations on hover

#### [MODIFY] `components/sections/experiences-reel.tsx`
- Cinematic horizontal scroll with velocity-based parallax
- Image zoom on scroll progress
- Caption reveal with typewriter effect

#### [MODIFY] `components/sections/gallery-teaser.tsx`
- Masonry grid with scroll-triggered reveals
- Lightbox with gesture support (pinch-zoom, swipe)
- Category filter with animated transitions

#### [MODIFY] `components/sections/stays-teaser.tsx`
- Split-screen scroll storytelling
- Room detail cards with 3D perspective hover
- Booking CTA with micro-interaction feedback

#### [MODIFY] `components/sections/map-directions.tsx`
- Lazy-loaded Google Maps with custom styling
- Animated route visualization
- Nearby attractions with distance indicators

#### [MODIFY] `components/layout/navigation.tsx`
- Floating nav with backdrop blur
- Dynamic contrast (transparent → solid on scroll)
- Mobile: full-screen overlay with staggered menu items
- Active section indicator via IntersectionObserver
- Theme toggle integrated

#### [MODIFY] `components/layout/footer.tsx`
- Premium footer with wave SVG separator
- Newsletter signup (future-ready)
- Social links with hover animations
- Back-to-top with smooth scroll

#### [MODIFY] `app/gallery/page.tsx` + `gallery-client.tsx`
- Category-filtered masonry grid
- Lightbox with zoom, swipe, keyboard nav
- Image data from database (admin-managed)
- Lazy loading with blur placeholders
- Video support

#### [MODIFY] `app/stays/page.tsx` + `client.tsx`
- Room showcase with image carousel per room
- Amenity icons with tooltips
- Pricing display (admin-managed)
- Direct booking CTAs

#### [MODIFY] `app/visit/page.tsx` + `client.tsx`
- Interactive location section
- Nearby attractions carousel
- Getting here guide with transport options

---

### Phase 4: Admin Dashboard

> Full CMS with RBAC, media management, content editing.

#### [NEW] `app/admin/layout.tsx`
- Dashboard shell with collapsible sidebar
- Auth guard (server-side session check)
- Breadcrumb navigation
- Theme-compatible (dark/light)
- Responsive: sidebar → bottom nav on mobile

#### [NEW] `app/admin/login/page.tsx`
- Premium login page with animated background
- Email + password form with Zod validation
- "Remember me" + "Forgot password" flows
- CallbackUrl redirect after auth
- Rate limiting (5 attempts, then lockout)

#### [NEW] `app/admin/page.tsx` (Dashboard Home)
- Overview cards (total media, blog posts, recent activity)
- Quick actions (upload media, new blog post)
- Recent audit log entries
- Site health metrics

#### [NEW] `app/admin/media/page.tsx`
- Grid/list view toggle for all media
- Category tabs: All, Indoor, Outdoor, Kitchen, Bedroom 1, Bedroom 2, Bathroom, With Guests, Garden, Lake View, Drone, Dining
- Drag-and-drop upload zone (react-dropzone)
- URL upload with fetch + preview
- Multi-file upload with progress bars
- File type validation (images: jpg/png/webp/avif, videos: mp4/webm, docs: pdf)
- Live preview panel (zoomable images, video player, PDF viewer)
- Inline metadata editing (alt text, caption, tags, category)
- Drag-to-reorder within categories
- Tag management (assign to pages/sections with limit warnings)
- Bulk actions (delete, re-categorize, export)
- Confirmation dialogs for destructive actions

#### [NEW] `app/admin/pages/page.tsx`
- List of site pages with edit links
- Section ordering via drag-and-drop
- Live preview (iframe or side-by-side)
- Content block editor (title, description, images, CTAs)
- SEO metadata editor per page
- Publish/Draft toggle

#### [NEW] `app/admin/blog/page.tsx`
- Blog post list with status filters (Draft/Published/Archived)
- New post button → editor

#### [NEW] `app/admin/blog/[id]/page.tsx`
- Rich text editor (or MDX editor)
- AI generation panel (upload image + description → generate)
- Undo/Redo with history stack (50 states)
- Auto-save (debounced, every 30s)
- SEO preview card (Google/social)
- Cover image upload
- Tag/category management
- Publish scheduling

#### [NEW] `app/admin/users/page.tsx`
- User list with role badges
- Invite new user
- Role management (DEVELOPER > ADMIN > EDITOR)
- Activity log per user

#### [NEW] `app/admin/settings/page.tsx`
- Site configuration (name, description, contact info)
- SEO defaults
- API key management (masked display)
- Database sync status
- Backup triggers

#### [NEW] `app/admin/audit/page.tsx`
- Filterable audit log table
- Export to CSV
- Date range picker
- Action type filters

#### [NEW] `lib/admin/actions.ts`
- Server actions for all CRUD operations
- Zod schema validation
- Audit log recording
- Cache invalidation triggers
- Role-based permission checks

#### [NEW] `lib/admin/upload.ts`
- Cloudinary upload wrapper
- File validation (type, size limits)
- Auto-generate responsive variants
- Metadata extraction (EXIF, dimensions)
- Virus/malware scanning via Cloudinary

#### [NEW] `components/admin/` (shared dashboard components)
- `DataTable.tsx` — sortable, filterable, paginated table
- `MediaUploader.tsx` — drag-drop + URL upload
- `MediaPreview.tsx` — zoomable image/video/PDF viewer
- `SortableList.tsx` — drag-to-reorder
- `RichEditor.tsx` — blog content editor
- `SEOPreview.tsx` — Google/social preview cards
- `ConfirmDialog.tsx` — destructive action confirmations
- `QuickAdd.tsx` — minimal-click content creation
- `InlineHelp.tsx` — contextual help tooltips

---

### Phase 5: Blog System with AI Generation

#### [NEW] `app/blog/page.tsx`
- Blog listing with featured post hero
- Category/tag filters
- Infinite scroll or pagination
- Search with debounce
- SEO: BlogPosting schema per post

#### [NEW] `app/blog/[slug]/page.tsx`
- Full blog post with MDX rendering
- Table of contents (auto-generated from headings)
- Related posts sidebar
- Social share buttons
- Reading time estimate
- Author card
- Comments section (future-ready)
- Full SEO schemas (Article, BreadcrumbList, FAQ if applicable)

#### [NEW] `lib/ai/blog-generator.ts`
- OpenRouter API integration
- Image description → blog post pipeline
- SEO metadata auto-generation
- Content safety filtering
- Rate limiting (prevent abuse)

#### [NEW] `lib/ai/seo-generator.ts`
- Auto-generate meta titles, descriptions
- Schema markup suggestions
- Keyword extraction
- Alt text generation for images

---

### Phase 6: Search Everywhere Optimization

#### [MODIFY] `app/layout.tsx`
- Enhanced JSON-LD graph (Organization, WebSite, LodgingBusiness)
- Dynamic `<head>` metadata based on page
- Preconnect/preload optimization

#### [NEW] `lib/seo/schemas.ts`
- Centralized schema generators for all types
- LodgingBusiness, FAQPage, BreadcrumbList, Article, BlogPosting
- ImageObject, VideoObject for media
- Review/AggregateRating support

#### [MODIFY] `public/robots.txt`
- AI crawler directives (GPTBot, Claude-Web, PerplexityBot)
- Sitemap reference
- Admin routes disallowed

#### [MODIFY] `public/llms.txt`
- Updated for AI engine optimization
- Structured content summary
- Key entities and facts

#### [NEW] `public/ai.txt`
- AI-specific crawling instructions
- Content licensing info

#### [MODIFY] `next-sitemap.config.js`
- Dynamic sitemap from database (blog posts, pages)
- Image sitemap
- Video sitemap
- Priority and changefreq optimization

#### [NEW] `public/site.webmanifest` (update)
- Enhanced PWA manifest
- Screenshots, shortcuts
- Share target

---

### Phase 7: Performance & Caching

#### [NEW] `lib/cache/react-query.ts`
- TanStack Query provider configuration
- Default stale times
- Prefetch helpers for SSR
- Optimistic update utilities

#### [MODIFY] Various pages — Rendering Strategy
- Home: ISR (60s) + PPR for dynamic sections
- Gallery: ISR (300s) with on-demand revalidation from admin
- Stays: ISR (300s)
- Blog listing: ISR (60s)
- Blog post: ISG (static generation) + on-demand revalidation
- Admin: Full CSR (no caching)
- Visit: SSG (static)
- FAQ: SSG (static)

#### Performance Targets
| Metric | Target |
|--------|--------|
| LCP | < 1.8s |
| INP | < 150ms |
| CLS | < 0.05 |
| FCP | < 1.2s |
| TTFB | < 200ms |
| Bundle (main) | < 150KB |

---

### Phase 8: CI/CD & GitHub Actions

#### [NEW] `.github/workflows/ci.yml`
- Trigger: push to `main`/`dev`, PRs to `main`
- Steps: lint, typecheck, unit tests, build
- Prisma generate step
- Next.js build cache
- Concurrency: cancel in-progress

#### [NEW] `.github/workflows/preview-deploy.yml`
- Trigger: PR to `main`
- Vercel preview deployment
- Lighthouse CI audit
- Bundle size check
- Comment results on PR

#### [NEW] `.github/workflows/prod-deploy.yml`
- Trigger: push tag `v*` on `main`
- Vercel production deployment
- Database migration (Prisma)
- Health check post-deploy
- Deployment summary

#### [NEW] `.github/workflows/security.yml`
- Weekly schedule + PR trigger
- `npm audit`
- CodeQL analysis
- Dependency review

---

## File Structure (Post-Refactor)

```
LakeViewVilla/
├── .github/workflows/          # CI/CD pipelines
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── migrations/             # Migration history
│   └── seed.ts                 # Initial data seed
├── app/
│   ├── (public)/               # Route group: public pages
│   │   ├── page.tsx            # Home
│   │   ├── gallery/
│   │   ├── stays/
│   │   ├── visit/
│   │   ├── faq/
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── developer/
│   ├── admin/                  # Route group: dashboard
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── page.tsx            # Dashboard home
│   │   ├── media/page.tsx
│   │   ├── pages/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── users/page.tsx
│   │   ├── settings/page.tsx
│   │   └── audit/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   ├── upload/route.ts
│   │   ├── revalidate/route.ts
│   │   ├── ai/generate/route.ts
│   │   ├── sync/route.ts
│   │   └── export/route.ts
│   ├── layout.tsx
│   ├── globals.css
│   ├── error.tsx
│   └── not-found.tsx
├── components/
│   ├── scroll/                 # Scroll animation primitives
│   ├── sections/               # Page sections (redesigned)
│   ├── layout/                 # Nav, footer, sidebar
│   ├── ui/                     # Base UI components
│   ├── admin/                  # Dashboard components
│   ├── blog/                   # Blog-specific components
│   ├── theme/                  # Theme provider, toggle
│   └── seo/                    # SEO components
├── lib/
│   ├── db/                     # Prisma client, sync
│   ├── auth/                   # Auth.js config
│   ├── cache/                  # Redis, React Query
│   ├── ai/                     # OpenRouter integration
│   ├── seo/                    # Schema generators
│   ├── admin/                  # Server actions
│   ├── design-system/          # Tokens, utilities
│   └── utils.ts
├── data/                       # Static fallback data
├── config/                     # App configuration
├── hooks/                      # Custom React hooks
├── public/
│   ├── villa/optimized/        # Optimized villa images
│   ├── robots.txt
│   ├── llms.txt
│   ├── ai.txt
│   └── site.webmanifest
└── scripts/                    # Build/dev scripts
```

---

## RBAC Permission Matrix

| Action | DEVELOPER | ADMIN | EDITOR |
|--------|-----------|-------|--------|
| View dashboard | ✅ | ✅ | ✅ |
| Upload media | ✅ | ✅ | ✅ |
| Edit content | ✅ | ✅ | ✅ |
| Publish blog | ✅ | ✅ | ❌ (draft only) |
| Manage users | ✅ | ✅ | ❌ |
| View audit logs | ✅ | ✅ | ❌ |
| Change settings | ✅ | ✅ | ❌ |
| Database operations | ✅ | ❌ | ❌ |
| Delete users | ✅ | ❌ | ❌ |
| Access API keys | ✅ | ❌ | ❌ |

---

## Verification Plan

### Automated Tests
- `npm run lint` — ESLint passes
- `npx tsc --noEmit` — TypeScript strict mode passes
- `npm test` — Unit tests for auth, RBAC, API routes, utilities
- `npx prisma validate` — Schema validation
- Lighthouse CI — Performance scores > 90
- Bundle analyzer — Main bundle < 150KB

### Manual Verification
- Test auth flow: login → dashboard → logout → callbackUrl redirect
- Test media upload: drag-drop, URL upload, multi-file, category assignment
- Test blog: create, AI generate, edit, undo/redo, publish, view public
- Test responsive: 375px, 768px, 1024px, 1440px, 1920px
- Test themes: light/dark toggle, system preference
- Test scroll animations: smooth scroll, parallax, reveals
- Test `prefers-reduced-motion`: all animations disabled
- Test offline: SQLite fallback, readonly mode
- Test WCAG: contrast ratios 7:1+, keyboard navigation, screen reader

### Security Checks
- Auth: session expiry, CSRF protection, rate limiting
- Uploads: file type validation, size limits, malware scan
- API: input validation (Zod), SQL injection prevention (Prisma)
- Headers: CSP, HSTS, X-Frame-Options verified
- Secrets: no hardcoded credentials in codebase

---

## Execution Order & Agent Assignment

| Phase | Agent(s) | Priority | Est. Effort |
|-------|----------|----------|-------------|
| 1. Infrastructure | `backend-specialist`, `database-architect`, `security-auditor` | 🔴 Critical | High |
| 2. Design System | `frontend-specialist`, `performance-optimizer` | 🔴 Critical | Medium |
| 3. Frontend Redesign | `frontend-specialist`, `seo-specialist` | 🔴 Critical | Very High |
| 4. Admin Dashboard | `backend-specialist`, `frontend-specialist`, `security-auditor` | 🟠 High | Very High |
| 5. Blog System | `backend-specialist`, `frontend-specialist` | 🟡 Medium | High |
| 6. SEO Optimization | `seo-specialist`, `frontend-specialist` | 🟡 Medium | Medium |
| 7. Performance | `performance-optimizer`, `frontend-specialist` | 🟠 High | Medium |
| 8. CI/CD | `devops-engineer`, `security-auditor` | 🟡 Medium | Low |

> **Phases 1-2 are sequential (dependencies)**. Phases 3-6 can partially parallelize. Phase 7-8 are final polish.
