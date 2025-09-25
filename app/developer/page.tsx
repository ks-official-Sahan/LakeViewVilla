import type { Metadata } from "next";
import SeoJsonLd from "@/components/SeoJsonLd";

export const revalidate = 3600; // cache 1h

export const metadata: Metadata = {
  title: "Developer – Sahan | Lake View Villa Tangalle",
  description: "Public developer profile, repositories, and contact links.",
};

async function getGitHub() {
  const u = await fetch("https://api.github.com/users/ks-official-Sahan", {
    next: { revalidate },
  })
    .then((r) => r.json())
    .catch(() => null);
  const repos = await fetch(
    "https://api.github.com/users/ks-official-Sahan/repos?per_page=12&sort=updated",
    { next: { revalidate } }
  )
    .then((r) => r.json())
    .catch(() => []);
  return { u, repos };
}

export default async function DeveloperPage() {
  const { u, repos } = await getGitHub();
  const base = "https://lakeviewvillatangalle.com";

  const graph = [
    {
      "@type": "Person",
      "@id": `${base}/developer#person`,
      name: u?.name || "Sahan",
      url: `${base}/developer`,
      sameAs: [u?.html_url].filter(Boolean),
      worksFor: { "@id": `${base}#org` },
    },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <SeoJsonLd breadcrumb={graph} />
      <h1 className="text-3xl font-semibold">Developer</h1>
      {u ? (
        <section className="mt-6">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={u.avatar_url}
              alt="GitHub avatar"
              className="h-16 w-16 rounded-full"
            />
            <div>
              <p className="font-medium">{u.name ?? u.login}</p>
              <a
                className="text-sm underline"
                href={u.html_url}
                rel="me noopener noreferrer"
                target="_blank"
              >
                GitHub Profile
              </a>
            </div>
          </div>
          <h2 className="mt-8 text-xl font-semibold">Recent Repositories</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {Array.isArray(repos) && repos.length > 0 ? (
              repos.map((r: any) => (
                <li key={r.id} className="rounded-xl border p-4">
                  <a
                    href={r.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline"
                  >
                    {r.name}
                  </a>
                  <p className="text-sm opacity-80 mt-1">
                    {r.description ?? "—"}
                  </p>
                  <p className="text-xs mt-2">
                    Updated: {new Date(r.updated_at).toLocaleDateString()}
                  </p>
                </li>
              ))
            ) : (
              <li>No repositories found.</li>
            )}
          </ul>
        </section>
      ) : (
        <p>Developer data unavailable right now.</p>
      )}
    </main>
  );
}
