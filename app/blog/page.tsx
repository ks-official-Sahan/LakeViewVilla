import { prisma } from "@/lib/db/prisma";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { estimateReadTime } from "@/lib/blog/markdown";
import { Clock, ArrowRight, Sparkles, Pen } from "lucide-react";
import { breadcrumbSchema } from "@/lib/seo";
import { serializeJsonLd } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Stories & Guides — Lake View Villa Tangalle",
  description:
    "Travel tips, Tangalle explorations, and villa stories. Your curated guide to Sri Lanka's southern coast from Lake View Villa.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Stories & Guides — Lake View Villa Tangalle",
    description: "Travel tips, Tangalle explorations, and stories from Lake View Villa.",
    url: "https://lakeviewvillatangalle.com/blog",
    type: "website",
  },
};

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  publishedAt: Date | null;
  generatedByAI: boolean;
  tags: string[];
  featuredImage: { url: string; alt: string | null } | null;
  author: { name: string | null };
};

export default async function BlogPage() {
  let posts: Post[] = [];

  try {
    posts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        publishedAt: true,
        generatedByAI: true,
        tags: true,
        featuredImage: { select: { url: true, alt: true } },
        author: { select: { name: true } },
      },
    });
  } catch {
    // DB not available — render empty state
  }

  const featuredPost = posts[0] ?? null;
  const restPosts = posts.slice(1);

  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "https://lakeviewvillatangalle.com" },
    { name: "Blog", url: "https://lakeviewvillatangalle.com/blog" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }}
      />

      <main className="min-h-screen bg-[var(--color-background)]">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden py-24 md:py-32">
          {/* Ambient background */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(184,147,63,0.08) 0%, transparent 70%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--color-border) 30%, var(--color-border) 70%, transparent)",
            }}
          />

          <div className="relative mx-auto max-w-6xl px-4 md:px-8 text-center">
            <p className="mb-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-gold)]">
              <Pen className="h-3.5 w-3.5" /> Lake View Villa Blog
            </p>
            <h1 className="font-[var(--font-display)] text-[clamp(2.5rem,6vw,5rem)] font-black tracking-tighter text-[var(--color-foreground)] leading-[1.05]">
              Stories &{" "}
              <span className="text-gradient-gold inline-block italic">Guides</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-[var(--color-muted)] font-medium">
              Travel tips, Tangalle explorations, and villa life. Your curated guide to
              Sri Lanka's breathtaking southern coast.
            </p>
            {posts.length > 0 && (
              <p className="mt-4 text-sm text-[var(--color-muted)]/70">
                {posts.length} {posts.length === 1 ? "story" : "stories"} published
              </p>
            )}
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 pb-28 md:px-8">
          {posts.length === 0 ? (
            /* ── Empty State ─────────────────────────────────────────────── */
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] py-24 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--color-gold)]/10">
                <Pen className="h-10 w-10 text-[var(--color-gold)]" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
                Stories coming soon
              </h2>
              <p className="mt-3 max-w-md text-[var(--color-muted)]">
                We&apos;re preparing travel guides and villa stories for you. Check back
                soon — or subscribe to hear first.
              </p>
              <Link
                href="/"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-[var(--color-primary-foreground)] transition-opacity hover:opacity-90"
              >
                Back to Home <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <>
              {/* ── Featured Post ────────────────────────────────────────── */}
              {featuredPost && (
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="group mb-12 flex flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm transition-all duration-500 hover:shadow-xl hover:border-[var(--color-gold)]/30 md:flex-row"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/9] shrink-0 overflow-hidden md:aspect-auto md:w-[52%]">
                    {featuredPost.featuredImage ? (
                      <>
                        <Image
                          src={featuredPost.featuredImage.url}
                          alt={featuredPost.featuredImage.alt ?? featuredPost.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 52vw"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--color-surface)]/20" />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-gold)]/10 flex items-center justify-center">
                        <Pen className="h-16 w-16 text-[var(--color-gold)]/30" />
                      </div>
                    )}
                    {/* Featured badge */}
                    <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-[var(--color-gold)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
                      <Sparkles className="h-3 w-3" /> Featured
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-center p-8 md:p-10 lg:p-12">
                    {featuredPost.tags.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {featuredPost.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-[var(--color-primary)]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-primary)]"
                          >
                            {tag}
                          </span>
                        ))}
                        {featuredPost.generatedByAI && (
                          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                            AI-Assisted
                          </span>
                        )}
                      </div>
                    )}

                    <h2 className="font-[var(--font-display)] text-2xl font-bold leading-tight text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors md:text-3xl lg:text-4xl">
                      {featuredPost.title}
                    </h2>

                    {featuredPost.excerpt && (
                      <p className="mt-4 line-clamp-3 text-base text-[var(--color-muted)] leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                    )}

                    <div className="mt-6 flex items-center gap-4 text-sm text-[var(--color-muted)]">
                      {featuredPost.author.name && (
                        <span className="font-medium text-[var(--color-foreground)]">
                          {featuredPost.author.name}
                        </span>
                      )}
                      {featuredPost.publishedAt && (
                        <>
                          <span>·</span>
                          <time dateTime={featuredPost.publishedAt.toISOString()}>
                            {featuredPost.publishedAt.toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </time>
                        </>
                      )}
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {estimateReadTime(featuredPost.content)} min read
                      </span>
                    </div>

                    <div className="mt-8 inline-flex items-center gap-2 self-start text-sm font-semibold text-[var(--color-primary)] transition-all duration-300 group-hover:gap-3">
                      Read article <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              )}

              {/* ── Post Grid ────────────────────────────────────────────── */}
              {restPosts.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {restPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}

function PostCard({ post }: { post: Post }) {
  const readTime = estimateReadTime(post.content);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm transition-all duration-300 hover:shadow-lg hover:border-[var(--color-gold)]/25 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-background)]">
        {post.featuredImage ? (
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alt ?? post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-gold)]/5">
            <Pen className="h-10 w-10 text-[var(--color-gold)]/20" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--color-primary)]/8 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-primary)]"
              >
                {tag}
              </span>
            ))}
            {post.generatedByAI && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                AI
              </span>
            )}
          </div>
        )}

        <h2 className="text-base font-bold leading-snug text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 flex-1">
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm text-[var(--color-muted)] leading-relaxed">
            {post.excerpt}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between text-xs text-[var(--color-muted)]">
          <div className="flex items-center gap-3">
            {post.author.name && (
              <span className="font-medium">{post.author.name}</span>
            )}
            {post.publishedAt && (
              <>
                <span>·</span>
                <time dateTime={post.publishedAt.toISOString()}>
                  {post.publishedAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </>
            )}
          </div>
          <span className="inline-flex items-center gap-1 shrink-0">
            <Clock className="h-3 w-3" />
            {readTime} min
          </span>
        </div>
      </div>
    </Link>
  );
}
