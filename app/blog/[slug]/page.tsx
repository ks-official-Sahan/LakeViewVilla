import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { generateBlogArticleSchema } from "@/lib/seo/structured-data";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
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

    if (!post) return { title: "Not Found" };

    return {
      title: post.seoTitle ?? `${post.title} — Lake View Villa Tangalle`,
      description: post.seoDescription ?? post.excerpt ?? undefined,
      openGraph: {
        title: post.seoTitle ?? post.title,
        description: post.seoDescription ?? post.excerpt ?? undefined,
        images: post.ogImage
          ? [{ url: post.ogImage }]
          : post.featuredImage
            ? [{ url: post.featuredImage.url }]
            : undefined,
      },
    };
  } catch {
    return { title: "Blog — Lake View Villa" };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  let post;
  try {
    post = await prisma.blogPost.findUnique({
      where: { slug, status: "PUBLISHED" },
      include: {
        author: { select: { name: true } },
        featuredImage: { select: { url: true, alt: true } },
      },
    });
  } catch {
    notFound();
  }

  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-20 md:py-28">
      <ScrollReveal variant="fade-up">
        {/* Back link */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)]"
        >
          ← Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-10">
          {post.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--color-primary)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="font-[var(--font-display)] text-3xl font-bold leading-tight tracking-tight text-[var(--color-foreground)] md:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <div className="mt-4 flex items-center gap-3 text-sm text-[var(--color-muted)]">
            {post.author.name && <span>By {post.author.name}</span>}
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
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl">
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt ?? post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg prose-[var(--color-foreground)] dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </ScrollReveal>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBlogArticleSchema(post, post.author.name || "Lake View Villa")
          ),
        }}
      />
    </article>
  );
}
