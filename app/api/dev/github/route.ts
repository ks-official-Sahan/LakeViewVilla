  import { NextResponse } from "next/server";
  export const runtime = "edge";
  const USERNAME = "ks-official-Sahan";

  async function gh(path: string) {
    const headers: HeadersInit = {
      accept: "application/vnd.github+json",
      "user-agent": "lakeviewvilla-dev",
    };
    const token = process.env.GITHUB_TOKEN;
    if (token) headers.authorization = `Bearer ${token}`;
    const r = await fetch(`https://api.github.com${path}`, {
      headers,
      next: { revalidate: 60 },
    });
    if (!r.ok) throw new Error(`GitHub ${r.status}`);
    return r.json();
  }

  export async function GET() {
    try {
      const [user, repos, events] = await Promise.all([
        gh(`/users/${USERNAME}`),
        gh(`/users/${USERNAME}/repos?per_page=100&sort=updated`),
        gh(`/users/${USERNAME}/events/public?per_page=20`),
      ]);

      const slimRepos = (Array.isArray(repos) ? repos : []).map((r: any) => ({
        id: r.id,
        name: r.name,
        html_url: r.html_url,
        description: r.description,
        updated_at: r.updated_at,
        stargazers_count: r.stargazers_count,
        forks_count: r.forks_count,
        language: r.language,
        topics: r.topics,
      }));
      const pinnedTopic = slimRepos.filter((r) =>
        (r.topics || []).includes("pinned")
      );
      const byStars = [...slimRepos].sort(
        (a, b) => b.stargazers_count - a.stargazers_count
      );
      const pinned = (pinnedTopic.length ? pinnedTopic : byStars).slice(0, 6);

      return NextResponse.json(
        {
          user: {
            login: user.login,
            name: user.name || "Sahan",
            html_url: user.html_url,
            avatar_url: user.avatar_url,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            public_repos: user.public_repos,
            company: user.company,
            blog: user.blog,
            location: user.location,
          },
          pinned,
          repos: byStars.slice(0, 12),
          events: (Array.isArray(events) ? events : [])
            .map((e: any) => ({
              id: e.id,
              type: e.type,
              repo: {
                name: e.repo?.name,
                url: `https://github.com/${e.repo?.name}`,
              },
              created_at: e.created_at,
            }))
            .slice(0, 20),
          ts: Date.now(),
        },
        {
          headers: {
            "cache-control": "public, s-maxage=60, stale-while-revalidate=600",
          },
        }
      );
    } catch (e: any) {
      return NextResponse.json({
        error: true,
        message: e?.message || "GitHub error",
      });
    }
  }
