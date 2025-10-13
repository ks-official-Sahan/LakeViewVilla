import Link from "next/link";
import Script from "next/script";
export const metadata = {
  title: "Lake View Villa — Airbnb listing",
  description:
    "Official Airbnb listing for Lake View Villa Tangalle. Click through to view booking availability and photos on Airbnb.",
  alternates: { canonical: "https://lakeviewvillatangalle.com/links/airbnb" },
};

export default function AirbnbLinkPage() {
  const url = "https://www.airbnb.com/l/CfK96vPd";
  return (
    <main className="prose mx-auto py-12 px-4">
      <h1>Lake View Villa — Airbnb listing</h1>
      <p>
        View our official Airbnb listing for availability, reviews and booking
        options.
      </p>

      <p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-md px-4 py-3 bg-red-600 text-white"
          data-cta="outbound-airbnb"
        >
          Open on Airbnb
        </a>
      </p>

      <p className="text-sm text-slate-600">
        If you prefer, message us directly for best rates and immediate
        confirmation.
      </p>

      <Link href="/" className="text-blue-600 underline mt-6 inline-block">
        ← Return to Lake View Villa
      </Link>

      <Script
        id="link-schema"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          url: "https://lakeviewvillatangalle.com/links/airbnb",
          name: "Lake View Villa — Airbnb listing",
          mainEntity: {
            "@type": "Thing",
            sameAs: url,
          },
        })}
      </Script>
    </main>
  );
}
