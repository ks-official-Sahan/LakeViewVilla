import Link from "next/link";
import Script from "next/script";
export const metadata = {
  title: "Lake View Villa — Instagram",
  description:
    "Our Instagram profile: photos and short videos from Lake View Villa.",
  alternates: {
    canonical: "https://lakeviewvillatangalle.com/links/instagram",
  },
};

export default function InstagramLinkPage() {
  const url = "https://www.instagram.com/lakeviewvillatangalle";
  return (
    <main className="prose mx-auto py-12 px-4">
      <h1>Lake View Villa — Instagram</h1>
      <p>Follow us for daily photos and guest moments.</p>

      <p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-md px-4 py-3 bg-pink-600 text-white"
          data-cta="outbound-instagram"
        >
          Open on Instagram
        </a>
      </p>

      <Link href="/" className="text-blue-600 underline mt-6 inline-block">
        ← Return to Lake View Villa
      </Link>

      <Script
        id="link-schema-ig"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          url: "https://lakeviewvillatangalle.com/links/instagram",
          name: "Lake View Villa — Instagram",
          mainEntity: { "@type": "Thing", sameAs: url },
        })}
      </Script>
    </main>
  );
}
