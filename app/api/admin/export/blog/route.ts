import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireExportAccess } from "@/lib/admin/require-export-access";

export async function GET() {
  const denied = await requireExportAccess();
  if (denied) return denied;

  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        excerpt: true,
        status: true,
        generatedByAI: true,
        seoTitle: true,
        seoDescription: true,
        seoKeywords: true,
        ogImage: true,
        schema: true,
        tags: true,
        featuredImageId: true,
        authorId: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const body = JSON.stringify({ exportedAt: new Date().toISOString(), posts }, null, 2);
    return new NextResponse(body, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="lvv-blog-export.json"`,
        "Cache-Control": "private, no-store, max-age=0",
      },
    });
  } catch (e) {
    console.error("export blog:", e);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
