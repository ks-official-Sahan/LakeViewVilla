import Link from "next/link";
import Script from "next/script";
export const metadata = {
  title: "Lake View Villa — Facebook",
  description:
    "Lake View Villa on Facebook — posts, reviews and community updates.",
  alternates: { canonical: "https://lakeviewvillatangalle.com/links/facebook" },
};

export default function FacebookLinkPage() {
  const url = "https://www.facebook.com/share/17M3VXHKbZ/?mibextid=wwXIfr";
  return (
    <main className="prose mx-auto py-12 px-4">
      <h1>Lake View Villa — Facebook</h1>
      <p>Visit our Facebook page for reviews and event announcements.</p>

      <p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-md px-4 py-3 bg-blue-600 text-white"
          data-cta="outbound-facebook"
        >
          Open on Facebook
        </a>
      </p>

      <Link href="/" className="text-blue-600 underline mt-6 inline-block">
        ← Return to Lake View Villa
      </Link>

      <Script
        id="link-schema-fb"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          url: "https://lakeviewvillatangalle.com/links/facebook",
          name: "Lake View Villa — Facebook",
          mainEntity: { "@type": "Thing", sameAs: url },
        })}
      </Script>
    </main>
  );
}
