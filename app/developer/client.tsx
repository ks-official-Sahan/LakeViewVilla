"use client";

import useSWR from "swr";
import * as React from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Globe,
  MapPin,
  Calendar,
  Activity,
  Star,
  GitFork,
  Zap,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MagicCard } from "@/components/ui/magic-card";
import { Spotlight } from "@/components/ui/spotlight";
import { ErrorBoundary } from "@/components/error-boundary";
import FloatingAudioSwitch from "@/components/FloatingAudioSwitch";
import { AudioProvider } from "@/context/AudioContext";
import Particals from "@/components/ui2/Particles";

type GH = {
  user?: {
    login: string;
    name?: string;
    html_url: string;
    avatar_url: string;
    bio?: string;
    followers: number;
    following: number;
    public_repos: number;
    location?: string;
  };
  repos?: any[];
  pinned?: any[];
  events?: {
    id: string;
    type: string;
    repo: { name: string; url: string };
    created_at: string;
  }[];
  ts?: number;
  error?: boolean;
};

type Status = {
  results: {
    label: string;
    url: string;
    ok: boolean;
    status: number;
    latency: number;
  }[];
  best?: { url: string };
  ts?: number;
};

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function DeveloperClient({
  initial,
  statusInitial,
}: {
  initial: GH | null;
  statusInitial: Status | null;
}) {
  const prefersReducedMotion = useReducedMotion();

  // SWR tuned for stability + UX
  const { data: gh } = useSWR<GH>("/api/dev/github", fetcher, {
    fallbackData: initial ?? undefined,
    refreshInterval: 60_000,
    keepPreviousData: true,
    revalidateOnFocus: false,
    dedupingInterval: 30_000,
  });

  const { data: status } = useSWR<Status>("/api/dev/status", fetcher, {
    fallbackData: statusInitial ?? undefined,
    refreshInterval: 30_000,
    keepPreviousData: true,
    revalidateOnFocus: false,
    dedupingInterval: 15_000,
  });

  const user = gh?.user;
  const pinned = gh?.pinned ?? [];
  const repos = gh?.repos ?? [];
  const events = gh?.events ?? [];

  // Status selector (pick best latency; user can override)
  const [target, setTarget] = React.useState<string | null>(null);
  const best = React.useMemo(() => {
    if (target) return target;
    const ok = (status?.results || []).filter((r) => r.ok);
    if (!ok.length) return status?.best?.url || "https://sahansachintha.com";
    const fastest = ok.reduce((a, b) => (a.latency < b.latency ? a : b));
    return fastest.url;
  }, [status, target]);

  // BG parallax
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start", "end"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  const socials = [
    {
      name: "GitHub",
      icon: Github,
      href: user?.html_url || "https://github.com/ks-official-sahan",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://www.linkedin.com/in/sahan-sachintha",
    },
    { name: "Email", icon: Mail, href: "mailto:ks.official.sahan@gmail.com" },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: "https://wa.me/94768701148?text=Hello%20Sahan",
    },
  ];

  return (
    <ErrorBoundary>
      <AudioProvider>
        <Particals />
        <Particals />
        <div ref={ref} className="relative min-h-screen isolate">
          {/* Cinematic Aurora / Grid background */}
          <motion.div
            aria-hidden
            className="fixed inset-0 -z-10"
            style={prefersReducedMotion ? undefined : { y }}
          >
            <div className="absolute inset-0 animate-aurora bg-[radial-gradient(800px_400px_at_12%_10%,color-mix(in_oklab,theme(colors.primary.DEFAULT)_18%,transparent),transparent_60%),radial-gradient(900px_500px_at_80%_70%,color-mix(in_oklab,theme(colors.accent.DEFAULT)_14%,transparent),transparent_60%),linear-gradient(180deg,theme(colors.background),color-mix(in_oklab,theme(colors.background)_82%,black_18%))]" />
            <div className="absolute inset-0 opacity-[.08] bg-grid-small-[hsl(var(--border))]" />
            <Spotlight
              className="top-28 left-10 md:left-40"
              fill="rgba(56,189,248,0.35)"
            />
          </motion.div>

          {/* ===== HERO  (split, glass, cinematic) ===== */}
          <section
            className="safe-top pt-16 md:pt-24 pb-10 md:pb-14"
            aria-labelledby="hero-title"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-[420px,1fr] gap-8 items-stretch">
              {/* Portrait / vertical card */}
              <MagicCard className="relative bg-card/70 backdrop-blur-xl border border-border rounded-3xl p-5 overflow-hidden">
                <div className="absolute inset-x-0 -top-20 h-40 blur-2xl opacity-60 bg-gradient-to-r from-primary/40 via-accent/30 to-secondary/40" />
                <div className="relative flex flex-col items-center">
                  <Avatar className="h-32 w-32 ring-4 ring-primary/25 shadow-2xl">
                    <AvatarImage
                      src={user?.avatar_url}
                      alt={`${user?.name || "Sahan"} avatar`}
                    />
                    <AvatarFallback className="text-3xl font-bold">
                      SS
                    </AvatarFallback>
                  </Avatar>
                  <h1
                    id="hero-title"
                    className="mt-4 text-center text-4xl font-extrabold leading-tight"
                  >
                    <span className="text-gradient-primary">Hyper-Luxury</span>
                    <br />
                    Developer
                  </h1>
                  <p className="mt-3 text-center text-muted-foreground">
                    {user?.name || "Sahan Sachintha"} — Full-Stack Engineer
                  </p>

                  {/* Status selector (industrial-grade, accessible) */}
                  <div className="mt-6 w-full">
                    <label htmlFor="status" className="sr-only">
                      Prefer a live portfolio endpoint
                    </label>
                    <div
                      role="radiogroup"
                      aria-label="Choose live portfolio endpoint"
                      className="grid grid-cols-2 gap-2"
                    >
                      {(status?.results || []).map((r) => {
                        const active = (target || best) === r.url;
                        const ok = r.ok;
                        return (
                          <button
                            key={r.url}
                            role="radio"
                            aria-checked={active}
                            onClick={() => setTarget(r.url)}
                            title={`${r.url} • ${
                              ok ? `${Math.round(r.latency)}ms` : "Down"
                            }`}
                            className={`group rounded-xl border px-3 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                              active
                                ? "border-primary/50 bg-primary/10"
                                : "border-border bg-card/60 hover:bg-card/80"
                            } ${
                              ok ? "text-foreground" : "opacity-60 line-through"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`size-2 rounded-full ${
                                  ok ? "bg-emerald-500" : "bg-red-500"
                                }`}
                                aria-hidden
                              />
                              <span className="text-xs font-medium">
                                {r.label}
                              </span>
                              <span className="ml-auto text-xs opacity-70">
                                {ok
                                  ? `${Math.max(
                                      1,
                                      Math.min(9999, Math.round(r.latency))
                                    )}ms`
                                  : "Down"}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Smart default: fastest OK endpoint. You can override
                      above.
                    </p>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2 w-full">
                    <Badge variant="secondary" className="justify-center">
                      <MapPin className="mr-1.5 h-4 w-4" />{" "}
                      {user?.location || "Sri Lanka"}
                    </Badge>
                    <Badge variant="secondary" className="justify-center">
                      <Calendar className="mr-1.5 h-4 w-4" /> 5+ Years
                    </Badge>
                    <Badge variant="secondary" className="justify-center">
                      <Globe className="mr-1.5 h-4 w-4" /> Worldwide
                    </Badge>
                  </div>
                </div>
              </MagicCard>

              {/* Right column – value prop + CTAs */}
              <MagicCard className="relative bg-card/70 backdrop-blur-xl border border-border rounded-3xl overflow-hidden">
                <div className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(180deg,black,transparent)]">
                  <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[110%] rounded-full bg-gradient-to-r from-primary/25 via-accent/25 to-secondary/25 blur-2xl" />
                </div>

                <div className="relative p-8 md:p-10">
                  <p className="text-lg md:text-xl text-muted-foreground md:max-w-prose lg:max-w-full">
                    I design and engineer premium, **future-proof** products
                    with <strong>Next.js</strong>, <strong>TypeScript</strong>,{" "}
                    <strong>GSAP</strong>, <strong>Framer Motion</strong>,
                    realtime stacks, robust CI/CD, <strong>SEO</strong> and
                    meticulous attention to motion, a11y, and performance.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3 justify-center items-center">
                    <Button
                      size="lg"
                      className="shadow-lg"
                      asChild
                      data-magnetic
                    >
                      <Link
                        href={best}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="View portfolio"
                      >
                        <ShieldCheck className="mr-2 h-5 w-5" />
                        View Portfolio
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>

                    {socials.map((s) => (
                      <Button
                        key={s.name}
                        size="lg"
                        variant="outline"
                        asChild
                        data-magnetic
                      >
                        <Link
                          href={s.href}
                          target={s.name !== "Email" ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          aria-label={s.name}
                        >
                          <s.icon className="mr-2 h-5 w-5" />
                          {s.name}
                          {s.name !== "Email" && (
                            <ExternalLink className="ml-2 h-4 w-4" />
                          )}
                        </Link>
                      </Button>
                    ))}

                    <Button size="lg" variant="secondary" asChild>
                      <Link
                        href="/developer/cv"
                        aria-label="Open print-ready CV mode"
                      >
                        <Zap className="mr-2 h-5 w-5" /> CV Mode
                      </Link>
                    </Button>
                  </div>

                  {/* KPIs */}
                  <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Stat label="Followers" value={user?.followers} />
                    <Stat label="Public Repos" value={user?.public_repos} />
                    <Stat label="Following" value={user?.following} />
                    <Stat
                      label="Synced"
                      value={
                        gh?.ts ? new Date(gh.ts).toLocaleTimeString() : "—"
                      }
                    />
                  </div>
                </div>
              </MagicCard>
            </div>
          </section>

          {/* ===== Flagship Work ===== */}
          <Section
            title="Flagship Work"
            subtitle="Curated repositories that embody my standards"
            className="bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.06)_20%,transparent_60%)] dark:bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.18)_20%,transparent_60%)]"
          >
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {(pinned.length ? pinned : repos.slice(0, 6)).map((r: any) => (
                <RepoCard key={r.id} r={r} />
              ))}
              {!pinned.length && !repos.length && <SkeletonCard />}
            </div>
          </Section>

          {/* ===== Recent Activity ===== */}
          <Section title="Recent Activity" subtitle="Freshly updated codebases">
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {(gh?.repos || []).map((r: any) => (
                <RepoCard key={r.id} r={r} />
              ))}
              {!gh?.repos?.length && <SkeletonCard />}
            </div>
          </Section>

          {/* ===== Live GitHub Feed ===== */}
          <Section
            title="Live GitHub Feed"
            subtitle="Public events in near-realtime"
          >
            <div className="mt-8 space-y-4">
              {(events || []).slice(0, 10).map((e: any) => (
                <MagicCard
                  key={e.id}
                  className="p-4 flex items-center gap-3 bg-card/70 backdrop-blur-xl border border-border"
                >
                  <Activity className="h-4 w-4 text-primary" aria-hidden />
                  <div className="text-sm leading-relaxed">
                    <span className="font-medium">
                      {e.type.replace("Event", "")}
                    </span>{" "}
                    on{" "}
                    <a
                      href={e.repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 decoration-dotted"
                    >
                      {e.repo.name}
                    </a>{" "}
                    •{" "}
                    <span className="opacity-70">
                      {new Date(e.created_at).toLocaleString()}
                    </span>
                  </div>
                </MagicCard>
              ))}
              {!events?.length && (
                <div
                  className="h-10 rounded-xl bg-muted/40 animate-pulse"
                  aria-hidden
                />
              )}
            </div>
          </Section>

          {/* ===== CTA ===== */}
          <section className="py-16" aria-labelledby="cta">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <MagicCard className="p-8 md:p-10 text-center bg-card/80 backdrop-blur-xl border border-border shadow-2xl">
                <h2
                  id="cta"
                  className="text-3xl md:text-4xl font-extrabold text-shadow-ambient"
                >
                  Let’s build something premium
                </h2>
                <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                  Design-driven engineering for products that must feel
                  extraordinary—delivered with world-class performance.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-4">
                  <Button size="lg" className="shadow-lg" asChild>
                    <Link
                      href={
                        user?.html_url || "https://github.com/ks-official-sahan"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="mr-2 h-5 w-5" /> GitHub{" "}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="mailto:ks.official.sahan@gmail.com">
                      <Mail className="mr-2 h-5 w-5" /> Contact
                    </Link>
                  </Button>
                  <Button variant="secondary" size="lg" asChild>
                    <Link href={best} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 h-5 w-5" /> Portfolio{" "}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <Separator className="my-6" />
                <p className="text-sm text-muted-foreground">
                  Response within 24h • Mon–Fri • GMT+5:30
                </p>
              </MagicCard>
            </div>
          </section>

          {/* Floating audio switch preserved */}
          <FloatingAudioSwitch />
        </div>
      </AudioProvider>
    </ErrorBoundary>
  );
}

/* ---------------- small pieces ---------------- */

function Section({
  title,
  subtitle,
  className,
  children,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const id = title.replace(/\s+/g, "-").toLowerCase();
  return (
    <section className={`py-14 ${className || ""}`} aria-labelledby={id}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <h2
            id={id}
            className="text-3xl md:text-4xl font-extrabold tracking-tight"
          >
            {title}
          </h2>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  const display =
    typeof value === "number" ? value.toLocaleString() : String(value ?? "—");
  const pct =
    typeof value === "number"
      ? Math.max(6, Math.min(100, (value / 100) * 22))
      : 0;
  return (
    <MagicCard className="p-4 text-center bg-card/70 backdrop-blur-xl border border-border">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-extrabold">{display}</div>
      <Progress value={pct} className="mt-2 h-1" />
    </MagicCard>
  );
}

function RepoCard({ r }: { r: any }) {
  return (
    <MagicCard className="group p-5 h-full bg-card/70 backdrop-blur-xl border border-border rounded-2xl hover:border-primary/40 transition">
      <div className="flex items-start justify-between gap-3">
        <Link
          href={r.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline decoration-dotted underline-offset-4 group-hover:text-primary transition-colors"
        >
          {r.name}
        </Link>
        <span className="text-xs opacity-70">{r.language || "—"}</span>
      </div>
      <p className="text-sm opacity-80 mt-2 line-clamp-3">
        {r.description || "—"}
      </p>
      <div className="mt-3 flex items-center gap-4 text-xs opacity-80">
        <span className="inline-flex items-center gap-1">
          <Star className="h-3.5 w-3.5" /> {r.stargazers_count}
        </span>
        <span className="inline-flex items-center gap-1">
          <GitFork className="h-3.5 w-3.5" /> {r.forks_count}
        </span>
        <span className="ml-auto">
          Updated {new Date(r.updated_at).toLocaleDateString()}
        </span>
      </div>
    </MagicCard>
  );
}

function SkeletonCard() {
  return (
    <div className="h-36 rounded-2xl bg-muted/40 animate-pulse" aria-hidden />
  );
}

// "use client";

// import useSWR from "swr";
// import { useMemo, useRef } from "react";
// import {
//   motion,
//   useScroll,
//   useTransform,
//   useReducedMotion,
// } from "framer-motion";
// import Link from "next/link";
// import {
//   Github,
//   Linkedin,
//   Mail,
//   MessageCircle,
//   ExternalLink,
//   Star,
//   GitFork,
//   Globe,
//   MapPin,
//   Calendar,
//   Download,
//   Activity,
//   ShieldCheck,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { Separator } from "@/components/ui/separator";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { MagicCard } from "@/components/ui/magic-card";
// import { Spotlight } from "@/components/ui/spotlight";
// import { ErrorBoundary } from "@/components/error-boundary";
// import FloatingAudioSwitch from "@/components/FloatingAudioSwitch";
// import { AudioProvider } from "@/context/AudioContext";

// const fetcher = (u: string) => fetch(u).then((r) => r.json());

// type GH = {
//   user?: {
//     login: string;
//     name?: string;
//     html_url: string;
//     avatar_url: string;
//     bio?: string;
//     followers: number;
//     following: number;
//     public_repos: number;
//     location?: string;
//   };
//   repos?: any[];
//   pinned?: any[];
//   events?: {
//     id: string;
//     type: string;
//     repo: { name: string; url: string };
//     created_at: string;
//   }[];
//   ts?: number;
//   error?: boolean;
// };
// type Status = {
//   results: {
//     label: string;
//     url: string;
//     ok: boolean;
//     status: number;
//     latency: number;
//   }[];
//   best?: { url: string };
//   ts?: number;
// };

// export default function DeveloperClient({
//   initial,
//   statusInitial,
// }: {
//   initial: GH | null;
//   statusInitial: Status | null;
// }) {
//   const prefersReducedMotion = useReducedMotion();

//   const { data: gh } = useSWR<GH>("/api/dev/github", fetcher, {
//     fallbackData: initial ?? undefined,
//     refreshInterval: 60_000,
//     revalidateOnFocus: true,
//   });

//   const { data: status } = useSWR<Status>("/api/dev/status", fetcher, {
//     fallbackData: statusInitial ?? undefined,
//     refreshInterval: 30_000,
//     revalidateOnFocus: true,
//   });

//   const user = gh?.user;
//   const pinned = gh?.pinned ?? [];
//   const repos = gh?.repos ?? [];
//   const events = gh?.events ?? [];
//   const bestPortfolio = status?.best?.url || "https://sahansachintha.com";

//   const containerRef = useRef<HTMLDivElement>(null);
//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start start", "end start"],
//   });
//   const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

//   const socials = useMemo(
//     () => [
//       {
//         name: "GitHub",
//         icon: Github,
//         href: user?.html_url || "https://github.com/ks-official-sahan",
//       },
//       {
//         name: "LinkedIn",
//         icon: Linkedin,
//         href: "https://www.linkedin.com/in/sahan-sachintha",
//       },
//       { name: "Email", icon: Mail, href: "mailto:ks.official.sahan@gmail.com" },
//       {
//         name: "WhatsApp",
//         icon: MessageCircle,
//         href: "https://wa.me/94768701148?text=Hello%20Sahan",
//       },
//     ],
//     [user]
//   );

//   return (
//     <ErrorBoundary>
//       <AudioProvider>
//         <div ref={containerRef} className="relative min-h-screen isolate">
//           {/* Cinematic background */}
//           <motion.div
//             aria-hidden
//             className="fixed inset-0 -z-10 interactive-bg"
//             style={prefersReducedMotion ? undefined : { y: bgY }}
//           >
//             <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_20%_20%,color-mix(in_oklab,theme(colors.primary.DEFAULT)_18%,transparent),transparent_60%),radial-gradient(900px_480px_at_80%_70%,color-mix(in_oklab,theme(colors.accent.DEFAULT)_14%,transparent),transparent_60%),linear-gradient(180deg,theme(colors.background),color-mix(in_oklab,theme(colors.background)_80%,black_20%))]" />
//             <Spotlight
//               className="top-40 left-8 md:left-40"
//               fill="rgba(56,189,248,0.35)"
//             />
//           </motion.div>

//           {/* HERO */}
//           <section
//             className="pt-20 pb-12 md:pb-16"
//             aria-labelledby="dev-hero-title"
//           >
//             <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-[auto,1fr] gap-8 items-center">
//               <MagicCard className="mx-auto md:mx-0 p-3 bg-card/60 backdrop-blur-xl border border-border rounded-2xl">
//                 <Avatar className="h-28 w-28 md:h-36 md:w-36 ring-4 ring-primary/30 shadow-2xl">
//                   <AvatarImage
//                     src={user?.avatar_url}
//                     alt={`${user?.name || "Sahan"} avatar`}
//                   />
//                   <AvatarFallback className="text-3xl font-bold">
//                     {(user?.name || "SS").slice(0, 2).toUpperCase()}
//                   </AvatarFallback>
//                 </Avatar>
//               </MagicCard>

//               <div>
//                 <h1
//                   id="dev-hero-title"
//                   className="text-4xl md:text-6xl font-extrabold leading-tight text-shadow-deep"
//                 >
//                   Hyper-Luxury{" "}
//                   <span className="text-gradient-primary">Developer</span>
//                 </h1>
//                 <p className="mt-3 text-lg md:text-xl text-muted-foreground">
//                   {user?.name || "Sahan Sachintha"} — Full-Stack Engineer
//                   building premium, high-performance experiences with Next.js,
//                   TypeScript, GSAP & Framer Motion.
//                 </p>

//                 <div
//                   className="mt-5 flex flex-wrap gap-2"
//                   aria-label="Profile badges"
//                 >
//                   <Badge variant="secondary" className="px-3 py-1.5">
//                     <MapPin className="w-4 h-4 mr-1.5" />
//                     {user?.location || "Sri Lanka"}
//                   </Badge>
//                   <Badge variant="secondary" className="px-3 py-1.5">
//                     <Calendar className="w-4 h-4 mr-1.5" />
//                     5+ Years
//                   </Badge>
//                   <Badge variant="secondary" className="px-3 py-1.5">
//                     <Globe className="w-4 h-4 mr-1.5" />
//                     Worldwide
//                   </Badge>
//                 </div>

//                 <div className="mt-6 flex flex-wrap gap-3">
//                   <Button size="lg" className="shadow-lg" asChild>
//                     <Link
//                       href={bestPortfolio}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       aria-label="Open best portfolio (live)"
//                     >
//                       <ShieldCheck className="w-5 h-5 mr-2" />
//                       View Portfolio
//                       <ExternalLink className="ml-2 w-4 h-4" />
//                     </Link>
//                   </Button>

//                   {socials.map((s) => (
//                     <Button key={s.name} size="lg" variant="outline" asChild>
//                       <Link
//                         href={s.href}
//                         target={s.name !== "Email" ? "_blank" : undefined}
//                         rel="noopener noreferrer"
//                         aria-label={s.name}
//                       >
//                         <s.icon className="w-5 h-5 mr-2" />
//                         {s.name}
//                         {s.name !== "Email" && (
//                           <ExternalLink className="ml-2 w-4 h-4" />
//                         )}
//                       </Link>
//                     </Button>
//                   ))}

//                   <Button size="lg" variant="secondary" asChild>
//                     <Link
//                       href="/developer/cv"
//                       aria-label="Open print-ready CV mode"
//                     >
//                       <Download className="w-5 h-5 mr-2" />
//                       CV Mode
//                     </Link>
//                   </Button>
//                 </div>

//                 {/* Live status chips */}
//                 <div className="mt-4 flex flex-wrap gap-2" aria-live="polite">
//                   {(status?.results || []).map((r) => (
//                     <span
//                       key={r.url}
//                       className={`text-xs px-2.5 py-1 rounded-full border ${
//                         r.ok
//                           ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
//                           : "bg-red-500/10 border-red-500/30 text-red-500"
//                       }`}
//                       title={`${r.url} • ${r.ok ? "OK" : "Down"} • ${
//                         r.latency === Infinity ? "timeout" : `${r.latency}ms`
//                       }`}
//                     >
//                       {r.label}:{" "}
//                       {r.ok
//                         ? `${Math.max(
//                             1,
//                             Math.min(9999, Math.round(r.latency))
//                           )}ms`
//                         : "Down"}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* METRICS */}
//           <section className="py-6" aria-labelledby="dev-metrics">
//             <h2 id="dev-metrics" className="visually-hidden">
//               Developer metrics
//             </h2>
//             <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
//               <Stat label="Followers" value={user?.followers} />
//               <Stat label="Public Repos" value={user?.public_repos} />
//               <Stat label="Following" value={user?.following} />
//               <Stat
//                 label="Synced"
//                 value={gh?.ts ? new Date(gh.ts).toLocaleTimeString() : "—"}
//               />
//             </div>
//           </section>

//           {/* PINNED */}
//           <Section
//             title="Pinned Work"
//             subtitle="Flagship repositories that represent my craft"
//           >
//             <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
//               {(pinned.length ? pinned : repos.slice(0, 6)).map((r: any) => (
//                 <RepoCard key={r.id} r={r} />
//               ))}
//               {!pinned.length && repos.length === 0 && <SkeletonCard />}
//             </div>
//           </Section>

//           {/* RECENT */}
//           <Section
//             title="Recent Activity"
//             subtitle="Freshly updated codebases"
//             className="bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.06)_20%,transparent_60%)] dark:bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.18)_20%,transparent_60%)]"
//           >
//             <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
//               {(gh?.repos || []).map((r: any) => (
//                 <RepoCard key={r.id} r={r} />
//               ))}
//               {!gh?.repos?.length && <SkeletonCard />}
//             </div>
//           </Section>

//           {/* TIMELINE */}
//           <Section
//             title="Live GitHub Feed"
//             subtitle="Public events in near-realtime"
//           >
//             <div className="mt-8 space-y-4">
//               {(events || []).slice(0, 10).map((e: any) => (
//                 <MagicCard
//                   key={e.id}
//                   className="p-4 flex items-center gap-3 bg-card/60 backdrop-blur-xl border border-border"
//                 >
//                   <Activity className="w-4 h-4 text-primary" aria-hidden />
//                   <div className="text-sm leading-relaxed">
//                     <span className="font-medium">
//                       {e.type.replace("Event", "")}
//                     </span>{" "}
//                     on{" "}
//                     <a
//                       href={e.repo.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="underline underline-offset-4 decoration-dotted"
//                     >
//                       {e.repo.name}
//                     </a>{" "}
//                     •{" "}
//                     <span className="opacity-70">
//                       {new Date(e.created_at).toLocaleString()}
//                     </span>
//                   </div>
//                 </MagicCard>
//               ))}
//               {!events?.length && (
//                 <div
//                   className="h-10 rounded-md bg-muted/40 animate-pulse"
//                   aria-hidden
//                 />
//               )}
//             </div>
//           </Section>

//           {/* CTA */}
//           <section className="py-16" aria-labelledby="dev-cta">
//             <div className="max-w-4xl mx-auto px-4 sm:px-6">
//               <MagicCard className="p-8 text-center bg-card/70 backdrop-blur-xl border border-border shadow-2xl">
//                 <h2
//                   id="dev-cta"
//                   className="text-3xl md:text-4xl font-extrabold text-shadow-ambient"
//                 >
//                   Let’s build something premium
//                 </h2>
//                 <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
//                   Design-driven engineering for products that must feel
//                   extraordinary—delivered with world-class performance.
//                 </p>
//                 <div className="mt-6 flex flex-wrap justify-center gap-4">
//                   <Button size="lg" className="shadow-lg" asChild>
//                     <Link
//                       href={
//                         user?.html_url || "https://github.com/ks-official-sahan"
//                       }
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       <Github className="mr-2 h-5 w-5" /> GitHub{" "}
//                       <ExternalLink className="ml-2 h-4 w-4" />
//                     </Link>
//                   </Button>
//                   <Button variant="outline" size="lg" asChild>
//                     <Link href="mailto:ks.official.sahan@gmail.com">
//                       <Mail className="mr-2 h-5 w-5" /> Contact
//                     </Link>
//                   </Button>
//                   <Button variant="secondary" size="lg" asChild>
//                     <Link
//                       href={bestPortfolio}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       <Globe className="mr-2 h-5 w-5" /> Portfolio{" "}
//                       <ExternalLink className="ml-2 h-4 w-4" />
//                     </Link>
//                   </Button>
//                 </div>
//                 <Separator className="my-6" />
//                 <p className="text-sm text-muted-foreground">
//                   Response within 24h • Mon–Fri • GMT+5:30
//                 </p>
//               </MagicCard>
//             </div>
//           </section>

//           {/* Audio toggle (position unchanged per invariant) */}
//           <FloatingAudioSwitch />
//         </div>
//       </AudioProvider>
//     </ErrorBoundary>
//   );
// }

// /* ------- small pieces ------- */
// function Section({
//   title,
//   subtitle,
//   className,
//   children,
// }: {
//   title: string;
//   subtitle?: string;
//   className?: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <section
//       className={`py-14 ${className || ""}`}
//       aria-labelledby={title.replace(/\s+/g, "-").toLowerCase()}
//     >
//       <div className="max-w-6xl mx-auto px-4 sm:px-6">
//         <div className="text-center">
//           <h2
//             id={title.replace(/\s+/g, "-").toLowerCase()}
//             className="text-3xl md:text-4xl font-extrabold"
//           >
//             {title}
//           </h2>
//           {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
//         </div>
//         {children}
//       </div>
//     </section>
//   );
// }

// function Stat({ label, value }: { label: string; value: any }) {
//   const display =
//     typeof value === "number" ? value.toLocaleString() : String(value ?? "—");
//   const pct =
//     typeof value === "number"
//       ? Math.max(4, Math.min(100, (value / 100) * 20))
//       : 0;
//   return (
//     <MagicCard className="p-4 text-center bg-card/60 backdrop-blur-xl border border-border">
//       <div className="text-xs text-muted-foreground">{label}</div>
//       <div className="mt-1 text-2xl font-extrabold">{display}</div>
//       <Progress value={pct} className="mt-2 h-1" />
//     </MagicCard>
//   );
// }

// function RepoCard({ r }: { r: any }) {
//   return (
//     <MagicCard className="p-5 h-full bg-card/60 backdrop-blur-xl border border-border hover:border-primary/40 transition">
//       <div className="flex items-start justify-between gap-3">
//         <Link
//           href={r.html_url}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="font-semibold underline decoration-dotted underline-offset-4"
//         >
//           {r.name}
//         </Link>
//         <span className="text-xs opacity-70">{r.language || "—"}</span>
//       </div>
//       <p className="text-sm opacity-80 mt-2 line-clamp-3">
//         {r.description || "—"}
//       </p>
//       <div className="mt-3 flex items-center gap-4 text-xs opacity-80">
//         <span className="inline-flex items-center gap-1">
//           <Star className="w-3.5 h-3.5" />
//           {r.stargazers_count}
//         </span>
//         <span className="inline-flex items-center gap-1">
//           <GitFork className="w-3.5 h-3.5" />
//           {r.forks_count}
//         </span>
//         <span className="ml-auto">
//           Updated {new Date(r.updated_at).toLocaleDateString()}
//         </span>
//       </div>
//     </MagicCard>
//   );
// }

// function SkeletonCard() {
//   return (
//     <div className="h-36 rounded-xl bg-muted/40 animate-pulse" aria-hidden />
//   );
// }
