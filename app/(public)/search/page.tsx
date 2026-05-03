import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search — Lake View Villa Tangalle",
  description: "Search Lake View Villa Tangalle content.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/search" },
};

export default function Page({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const q = searchParams?.q?.trim() ?? "";
  return (
    <main className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-4">Search</h1>
      <p className="text-slate-600 mb-6">Try: “stays”, “gallery”, “visit”.</p>
      <div className="rounded-xl border p-6 bg-white">
        <p className="text-sm text-slate-700">
          Query: <strong>{q || "—"}</strong>
        </p>
      </div>
    </main>
  );
}
