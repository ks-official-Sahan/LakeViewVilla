import { prisma } from "@/lib/db/prisma";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Lake View Villa Tangalle",
  description:
    "Discover travel tips, Tangalle guides, and stories from Lake View Villa. Your guide to Sri Lanka's southern coast.",
  openGraph: {
    title: "Blog — Lake View Villa Tangalle",
    description:
      "Discover travel tips, Tangalle guides, and stories from Lake View Villa.",
    url: "https://lakeviewvillatangalle.com/blog",
  },
};

export default async function BlogPage() {
  let posts: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    publishedAt: Date | null;
    featuredImage: { url: string; alt: string | null } | null;
    author: { name: string | null };
    tags: string[];
  }[] = [];

  try {
    posts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
        tags: true,
        featuredImage: { select: { url: true, alt: true } },
        author: { select: { name: true } },
      },
    });
  } catch {
    // DB not available
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:py-28">
      <ScrollReveal variant="fade-up">
        <div className="mb-12 text-center">
          <h1 className="font-[var(--font-display)] text-4xl font-bold tracking-tight text-[var(--color-foreground)] md:text-5xl">
            Stories & Guides
          </h1>
          <p className="mt-4 text-lg text-[var(--color-muted)]">
            Travel tips, Tangalle explorations, and villa life
          </p>
        </div>
      </ScrollReveal>

      {posts.length === 0 ? (
        <ScrollReveal variant="fade-in">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-16 text-center">
            <p className="text-lg font-medium text-[var(--color-foreground)]">
              Coming Soon
            </p>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              We&apos;re preparing stories and guides for you. Check back soon!
            </p>
          </div>
        </ScrollReveal>
      ) : (
        <ScrollReveal variant="fade-up" stagger={0.12}>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-shadow hover:shadow-lg"
              >
                {post.featuredImage && (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.featuredImage.url}
                      alt={post.featuredImage.alt ?? post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-5">
                  {post.tags.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-[var(--color-primary)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--color-primary)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <h2 className="text-lg font-semibold leading-snug text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 line-clamp-2 text-sm text-[var(--color-muted)]">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-2 text-xs text-[var(--color-muted)]">
                    {post.author.name && <span>{post.author.name}</span>}
                    {post.publishedAt && (
                      <>
                        <span>•</span>
                        <time dateTime={post.publishedAt.toISOString()}>
                          {post.publishedAt.toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </time>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      )}
    </section>
  );
}
