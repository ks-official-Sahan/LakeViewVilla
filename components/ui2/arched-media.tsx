import Image from "next/image";
import { cn } from "@/lib/utils";

export function ArchedMedia({
  src = "/villa/with_guests_01.jpeg",
  alt = "Lake View Villa — garden and lake",
  className,
  priority,
}: {
  src?: string;
  alt?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[680px]",
        "md:max-w-[560px] lg:max-w-[600px] xl:max-w-[640px]",
        className
      )}
    >
      {/* Outer frame (soft card with glow) */}
      <div
        className={cn(
          "relative rounded-b-[28px] rounded-t-[56%] p-2 sm:p-3",
          "bg-white/80 dark:bg-slate-900/70",
          "shadow-[0_20px_60px_rgba(2,6,23,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]",
          "ring-1 ring-slate-200/80 dark:ring-white/10"
        )}
      >
        {/* Inner media window */}
        <div
          className={cn(
            "relative overflow-hidden",
            "rounded-b-[22px] rounded-t-[56%]",
            "aspect-[4/5] sm:aspect-[3/4]"
          )}
        >
          <Image
            fill
            src={src}
            alt={alt}
            sizes="(max-width: 640px) 96vw, (max-width: 1024px) 42vw, 520px"
            className="object-cover"
            priority={priority}
          />
          {/* Gentle vignette to match your reference */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10 dark:from-black/25 dark:via-transparent dark:to-black/30" />
        </div>
      </div>
    </div>
  );
}
