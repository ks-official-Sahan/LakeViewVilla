import type { Metadata } from "next";
import type { ReactNode } from "react";

/** Dev-only login mirror — keep out of search indexes */
export const metadata: Metadata = {
  title: "Test login",
  robots: { index: false, follow: false },
};

export default function TestLoginLayout({ children }: { children: ReactNode }) {
  return children;
}
