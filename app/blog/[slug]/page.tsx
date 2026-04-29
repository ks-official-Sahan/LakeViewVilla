import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { connection } from "next/server";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { generateBlogArticleSchema } from "@/lib/seo/structured-data";
import { markdownToHtml, estimateReadTime } from "@/lib/blog/markdown";
import { ArrowLeft, Clock, Calendar, User, Sparkles, ArrowRight } from "lucide-react";
import { ReadingProgress } from "./reading-progress";
import { ShareButtons } from "./share-buttons";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}



export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  await connection();
  const { slug } = await params;

  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug, status: "PUBLISHED" },
      select: {
        title: true,
        seoTitle: true,
        seoDescription: true,
        excerpt: true,
        ogImage: true,
        featuredImage: { select: { url: true } },
      },
    });

    if (!post) return { title: "Post Not Found — Lake View Villa" };

    const title = post.seoTitle ?? `${post.title} — Lake View Villa Tangalle`;
    const description = post.seoDescription ?? post.excerpt ?? undefined;
    const imageUrl = post.ogImage ?? post.featuredImage?.url ?? undefined;

    return {
      title,
      description,
      alternates: { canonical: `/blog/${slug}` },
      openGraph: {
        title: post.seoTitle ?? post.title,
        description,
        url: `https://lakeviewvillatangalle.com/blog/${slug}`,
        type: "article",
        images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: post.seoTitle ?? post.title,
        description,
        images: imageUrl ? [imageUrl] : undefined,
      },
    };
  } catch {
    return { title: "Blog — Lake View Villa" };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  await connection();
  const { slug } = await params;

  let post: Awaited<ReturnType<typeof fetchPost>> | null = null;
  let relatedPosts: RelatedPost[] = [];
  let contentHtml = "";

  try {
    post = await fetchPost(slug);
    if (!post) notFound();

    // Parse markdown content
    contentHtml = await markdownToHtml(post.content);

    // Fetch related posts (same tags, exclude current)
    relatedPosts = await fetchRelatedPosts(post.id, post.tags);
  } catch (err) {
    console.error(err);
    notFound();
  }

  if (!post) notFound();

  const readTime = estimateReadTime(post.content);
  const postUrl = `https://lakeviewvillatangalle.com/blog/${slug}`;

  return (
    <>
      {/* Reading progress bar */}
      <ReadingProgress />

      <main>
        {/* ── Cinematic Hero ───────────────────────────────────────────── */}
        <div className="relative overflow-hidden">
          {post.featuredImage ? (
            /* Hero with featured image */
            <div className="relative h-[50vh] min-h-[360px] md:h-[65vh]">
              <Image
                src={post.featuredImage.url}
                alt={post.featuredImage.alt ?? post.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              {/* Multi-layer scrim for text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-black/40 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-background)]/60 via-transparent to-transparent" />

              {/* Hero content */}
              <div className="absolute inset-x-0 bottom-0 px-4 pb-10 md:px-8">
                <div className="mx-auto max-w-4xl">
                  <PostHeroContent post={post} readTime={readTime} hasBg />
                </div>
              </div>
            </div>
          ) : (
            /* Hero without image — gradient background */
            <div className="relative py-24 md:py-32">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(184,147,63,0.07) 0%, transparent 70%)",
                }}
              />
              <div className="relative mx-auto max-w-4xl px-4 md:px-8">
                <PostHeroContent post={post} readTime={readTime} hasBg={false} />
              </div>
            </div>
          )}
        </div>

        {/* ── Article Body ─────────────────────────────────────────────── */}
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_280px]">

            {/* Main content column */}
            <article>
              {/* Back navigation */}
              <Link
                href="/blog"
                className="mb-10 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-muted)] transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Blog
              </Link>

              {/* Markdown content */}
              <div
                className="prose prose-lg dark:prose-invert max-w-none
                  prose-headings:font-[var(--font-display)] prose-headings:tracking-tight prose-headings:text-[var(--color-foreground)]
                  prose-p:text-[var(--color-muted)] prose-p:leading-relaxed
                  prose-a:text-[var(--color-primary)] prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-[var(--color-foreground)]
                  prose-blockquote:border-l-[var(--color-gold)] prose-blockquote:bg-[var(--color-surface)] prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:not-italic
                  prose-code:bg-[var(--color-surface)] prose-code:text-[var(--color-primary)] prose-code:rounded prose-code:px-1 prose-code:py-0.5
                  prose-pre:bg-[#1e1e1e] prose-pre:border prose-pre:border-[var(--color-border)]
                  prose-img:rounded-2xl prose-img:shadow-lg
                  prose-hr:border-[var(--color-border)]"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-12 flex flex-wrap gap-2 border-t border-[var(--color-border)] pt-8">
                  <span className="text-sm text-[var(--color-muted)] mr-2 self-center">Tagged:</span>
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-semibold text-[var(--color-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-foreground)] transition-colors cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share */}
              <div className="mt-8 border-t border-[var(--color-border)] pt-8">
                <ShareButtons url={postUrl} title={post.title} />
              </div>
            </article>

            {/* ── Sticky Sidebar ────────────────────────────────────────── */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {/* Author card */}
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)]">
                    Written by
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/15 text-base font-bold text-[var(--color-primary)]">
                      {(post.author.name ?? "LVV")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--color-foreground)]">
                        {post.author.name ?? "Lake View Villa"}
                      </p>
                      <p className="text-xs text-[var(--color-muted)]">LakeViewVilla Team</p>
                    </div>
                  </div>
                </div>

                {/* Article meta */}
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)]">
                    Article Info
                  </p>
                  {post.publishedAt && (
                    <div className="flex items-center gap-2.5 text-sm text-[var(--color-muted)]">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <time dateTime={post.publishedAt.toISOString()}>
                        {post.publishedAt.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5 text-sm text-[var(--color-muted)]">
                    <Clock className="h-4 w-4 shrink-0" />
                    <span>{readTime} minute read</span>
                  </div>
                  {post.generatedByAI && (
                    <div className="flex items-center gap-2.5 text-sm text-amber-600 dark:text-amber-400">
                      <Sparkles className="h-4 w-4 shrink-0" />
                      <span>AI-Assisted Content</span>
                    </div>
                  )}
                </div>

                {/* Share */}
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)]">
                    Share
                  </p>
                  <ShareButtons url={postUrl} title={post.title} compact />
                </div>
              </div>
            </aside>
          </div>

          {/* ── Related Posts ──────────────────────────────────────────── */}
          {relatedPosts.length > 0 && (
            <section className="mt-20 border-t border-[var(--color-border)] pt-16">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-xl font-bold text-[var(--color-foreground)]">
                  More Stories
                </h2>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:gap-2.5 transition-all"
                >
                  All posts <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {relatedPosts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/blog/${p.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:border-[var(--color-gold)]/30 hover:shadow-md hover:-translate-y-0.5"
                  >
                    {p.featuredImage && (
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <Image
                          src={p.featuredImage.url}
                          alt={p.featuredImage.alt ?? p.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <p className="text-xs text-[var(--color-muted)] mb-2">
                        {p.publishedAt?.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <h3 className="font-semibold leading-snug text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                        {p.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBlogArticleSchema(post, post.author.name || "Lake View Villa")
          ),
        }}
      />
    </>
  );
}

/* ─── Sub-components ────────────────────────────────────────────────────── */

function PostHeroContent({
  post,
  readTime,
  hasBg,
}: {
  post: Awaited<ReturnType<typeof fetchPost>>;
  readTime: number;
  hasBg: boolean;
}) {
  if (!post) return null;

  return (
    <div className={hasBg ? "text-white" : ""}>
      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                hasBg
                  ? "bg-white/15 text-white backdrop-blur-sm border border-white/20"
                  : "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
              }`}
            >
              {tag}
            </span>
          ))}
          {post.generatedByAI && (
            <span className="rounded-full bg-amber-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-300 border border-amber-500/30 backdrop-blur-sm">
              AI-Assisted
            </span>
          )}
        </div>
      )}

      <h1
        className={`font-[var(--font-display)] text-[clamp(1.75rem,4vw,3.25rem)] font-black tracking-tight leading-tight ${
          hasBg ? "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]" : "text-[var(--color-foreground)]"
        }`}
      >
        {post.title}
      </h1>

      {post.excerpt && (
        <p
          className={`mt-4 max-w-2xl text-base leading-relaxed ${
            hasBg ? "text-white/80" : "text-[var(--color-muted)]"
          }`}
        >
          {post.excerpt}
        </p>
      )}

      <div
        className={`mt-6 flex flex-wrap items-center gap-4 text-sm ${
          hasBg ? "text-white/70" : "text-[var(--color-muted)]"
        }`}
      >
        {post.author.name && (
          <span className="inline-flex items-center gap-1.5 font-medium">
            <User className="h-4 w-4" />
            {post.author.name}
          </span>
        )}
        {post.publishedAt && (
          <>
            <span className="opacity-50">·</span>
            <time
              dateTime={post.publishedAt.toISOString()}
              className="inline-flex items-center gap-1.5"
            >
              <Calendar className="h-4 w-4" />
              {post.publishedAt.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </>
        )}
        <span className="opacity-50">·</span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {readTime} min read
        </span>
      </div>
    </div>
  );
}

/* ─── Data fetching ─────────────────────────────────────────────────────── */

async function fetchPost(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      author: { select: { name: true } },
      featuredImage: { select: { url: true, alt: true } },
    },
  });
}

type RelatedPost = {
  id: string;
  title: string;
  slug: string;
  publishedAt: Date | null;
  featuredImage: { url: string; alt: string | null } | null;
};

async function fetchRelatedPosts(
  currentId: string,
  tags: string[]
): Promise<RelatedPost[]> {
  if (tags.length === 0) {
    return prisma.blogPost.findMany({
      where: { status: "PUBLISHED", id: { not: currentId } },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        publishedAt: true,
        featuredImage: { select: { url: true, alt: true } },
      },
    });
  }

  return prisma.blogPost.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: currentId },
      tags: { hasSome: tags },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      publishedAt: true,
      featuredImage: { select: { url: true, alt: true } },
    },
  });
}
