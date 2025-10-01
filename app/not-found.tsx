import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center px-4">
      <div className="text-center max-w-xl">
        <div className="inline-flex items-center justify-center rounded-2xl bg-muted/50 p-5 mb-6">
          <span className="text-4xl font-extrabold tracking-tight">404</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Page not found</h1>
        <p className="text-muted-foreground mb-6">
          The page you’re looking for doesn’t exist or was moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild size="lg" className="px-6">
            <Link href="/">Return Home</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="px-6">
            <Link href="/gallery">View Gallery</Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="px-6">
            <Link href="/stays">See Stays</Link>
          </Button>
          {/* New: Developer shortcut */}
          <Button asChild size="lg" variant="secondary" className="px-6">
            <Link href="/developer">Developer</Link>
          </Button>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Or visit{" "}
          <Link href="/faq" className="underline underline-offset-4">
            FAQ
          </Link>{" "}
          •{" "}
          <Link href="/visit" className="underline underline-offset-4">
            How to visit
          </Link>
        </p>
      </div>
    </main>
  );
}
