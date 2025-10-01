"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Content pulled/normalized from your PDF + GitHub profile
const PROFILE = `Software Engineering undergraduate (BSc Hons) with a proven record delivering production-grade web, mobile, and desktop apps. Strengths in Next.js, React Native, NestJS, Prisma, Docker, WebSockets, CI/CD, and scalable system design.`;

export default function CVPage() {
  return (
    <main className="safe-top min-h-screen bg-background text-foreground py-10 print:py-0">
      <div className="mx-auto max-w-5xl px-4 print:px-0">
        {/* Toolbar (hidden in print) */}
        <div className="no-print print:hidden mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Curriculum Vitae</h1>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/developer">Back to Developer</Link>
            </Button>
            <Button onClick={() => window.print()}>Print / Save PDF</Button>
          </div>
        </div>

        {/* CV Card */}
        <article className="rounded-3xl border border-border bg-card p-8 shadow-xl print:rounded-none print:border-0 print:shadow-none print:bg-white print:text-black">
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold leading-tight">
                Sahan Sachintha
              </h2>
              <p className="text-muted-foreground">
                Full-Stack Software Engineer
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Tangalle, Sri Lanka • Available Worldwide</p>
              <p>
                <a
                  className="underline underline-offset-4"
                  href="mailto:ks.official.sahan@gmail.com"
                >
                  ks.official.sahan@gmail.com
                </a>
              </p>
              <p>
                <a
                  className="underline underline-offset-4"
                  href="https://github.com/ks-official-sahan"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/ks-official-sahan
                </a>
              </p>
              <p>
                <a
                  className="underline underline-offset-4"
                  href="https://sahansachintha.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  sahansachintha.com
                </a>
              </p>
            </div>
          </header>

          <Separator className="my-6" />

          <section className="grid gap-8 md:grid-cols-3">
            {/* Left column */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h3 className="mb-2 text-lg font-semibold">Profile</h3>
                <p className="leading-relaxed text-muted-foreground">
                  {PROFILE}
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold">Experience</h3>
                <ul className="space-y-5">
                  <li>
                    <p className="font-medium">
                      Associate Software Engineer (Contract) — Quantum Cod
                    </p>
                    <p className="text-xs opacity-70">May 2024 – Sep 2024</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Built high-performance web apps (MERN + Prisma),
                      Dockerized environments, MVC; Java Swing/Windows Forms
                      systems; cross-team collaboration.
                    </p>
                  </li>
                  <li>
                    <p className="font-medium">
                      Software Engineer / Co-founder — ImagineCoreX
                    </p>
                    <p className="text-xs opacity-70">Sep 2023 – Aug 2025</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Led mobile (React Native, Expo, Supabase) and full-stack
                      (NextJS, NestJS, Prisma, Docker) projects; end-to-end
                      deployments & CI. Notables: Udocs, Wisebiz.io, Green
                      Roamer, PPA Web, Ceynapp.
                    </p>
                  </li>
                  <li>
                    <p className="font-medium">
                      Software Engineering Intern — KVFX Studios
                    </p>
                    <p className="text-xs opacity-70">Jul 2023 – Jan 2024</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Backend with PHP & Node/Express, PostgreSQL/MySQL, and
                      React UI contributions.
                    </p>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold">
                  Selected Projects
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <span className="font-medium">
                      Lake View Villa Platform
                    </span>{" "}
                    — immersive, accessible, high-performance site.
                  </li>
                  <li>
                    <span className="font-medium">Green Roamer</span> — realtime
                    sync, role-based dashboards, analytics.
                  </li>
                  <li>
                    <a
                      className="underline underline-offset-4"
                      target="_blank"
                      href="https://wisebiz.io"
                      rel="noreferrer"
                    >
                      Wisebiz.io
                    </a>{" "}
                    •{" "}
                    <a
                      className="underline underline-offset-4"
                      target="_blank"
                      href="https://greenroamer.vercel.app"
                      rel="noreferrer"
                    >
                      Green Roamer
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right column */}
            <aside className="space-y-8">
              <div>
                <h3 className="mb-2 text-lg font-semibold">Skills</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>React, Next.js, TypeScript, React Native</li>
                  <li>NestJS, Node.js, REST/WebSockets, Prisma</li>
                  <li>Supabase, PostgreSQL, MySQL, MongoDB</li>
                  <li>Docker, CI/CD (GitHub Actions)</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold">Education</h3>
                <p className="text-sm text-muted-foreground">
                  BEng (Hons) Software Engineering — IIC University (via Java
                  Institute), expected 2025
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold">Links</h3>
                <ul className="space-y-1 text-sm">
                  <li>
                    <a
                      className="underline underline-offset-4"
                      href="https://sahan-ruddy.vercel.app"
                      target="_blank"
                      rel="noreferrer"
                    >
                      sahan-ruddy.vercel.app
                    </a>
                  </li>
                  <li>
                    <a
                      className="underline underline-offset-4"
                      href="https://developer.lakeviewvillatangalle.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      developer.lakeviewvillatangalle.com
                    </a>
                  </li>
                </ul>
              </div>
            </aside>
          </section>
        </article>
      </div>
    </main>
  );
}
