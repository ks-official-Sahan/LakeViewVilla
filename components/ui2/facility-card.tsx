"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description: string;
  image: string;
  alt?: string;
  badge?: string;
  className?: string;
};

export function FacilityCard({
  title,
  description,
  image,
  alt = "",
  badge,
  className,
}: Props) {
  return (
    <article
      className={cn(
        // Card scaffold
        "group h-full rounded-2xl border bg-card text-foreground ring-1 ring-border/60 shadow-sm",
        // Subtle hover/press feedback (GPU-cheap)
        "transition-transform duration-200 hover:translate-y-[-2px] hover:shadow-md",
        className
      )}
    >
      {/* Media */}
      <div className="relative overflow-hidden rounded-t-2xl">
        <div className="relative aspect-[4/3]">
          <Image
            src={image}
            alt={alt || title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            priority={false}
          />
        </div>
        {/* Badge */}
        {badge ? (
          <span
            className="
              absolute left-3 top-3 inline-flex items-center justify-center
              rounded-full bg-background/80 px-2.5 py-1 text-sm
              ring-1 ring-border/70 backdrop-blur
            "
          >
            {badge}
          </span>
        ) : null}
        {/* Top gradient for legibility when needed */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/0 via-transparent to-background/0" />
      </div>

      {/* Content (forced equal heights via min-h + flex) */}
      <div className="flex h-full flex-col p-4 sm:p-5">
        <h3 className="text-lg sm:text-xl font-semibold tracking-tight">
          {title}
        </h3>
        <p
          className="
            mt-2 text-sm sm:text-[0.95rem] leading-6 text-foreground/70
            [text-wrap:pretty]
          "
        >
          {description}
        </p>
        {/* Spacer to push CTA/footers if you add them later */}
        <div className="mt-auto" />
      </div>
    </article>
  );
}
