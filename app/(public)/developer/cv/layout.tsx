import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "CV — Sahan Sachintha | Developer",
  description:
    "Print-friendly curriculum vitae — full-stack engineer (Next.js, React Native, Prisma, Docker). Linked from Lake View Villa developer microsite.",
  alternates: { canonical: "/developer/cv" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "CV — Sahan Sachintha",
    description: "Full-stack software engineer — printable CV.",
    url: "https://lakeviewvillatangalle.com/developer/cv",
    type: "profile",
  },
};

export default function CVLayout({ children }: { children: ReactNode }) {
  return children;
}
