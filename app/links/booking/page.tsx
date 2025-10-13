import Link from "next/link";
import Script from "next/script";
export const metadata = {
  title: "Lake View Villa — Booking.com",
  description:
    "Find Lake View Villa on Booking.com — availability, policies and reviews.",
  alternates: { canonical: "https://lakeviewvillatangalle.com/links/booking" },
};

export default function BookingLinkPage() {
  const url = "https://www.booking.com/Pulse-81UlHU";
  return (
    <main className="prose mx-auto py-12 px-4">
      <h1>Lake View Villa — Booking.com</h1>
      <p>View availability and policies on Booking.com.</p>

      <p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-md px-4 py-3 bg-sky-600 text-white"
          data-cta="outbound-booking"
        >
          Open on Booking.com
        </a>
      </p>

      <Link href="/" className="text-blue-600 underline mt-6 inline-block">
        ← Return to Lake View Villa
      </Link>

      <Script
        id="link-schema-booking"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          url: "https://lakeviewvillatangalle.com/links/booking",
          name: "Lake View Villa — Booking.com",
          mainEntity: { "@type": "Thing", sameAs: url },
        })}
      </Script>
    </main>
  );
}
