import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sandbox",
  robots: { index: false, follow: false },
};

export default function FooPage() {
  return <h1>FOO</h1>;
}
