"use client";

import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HERO_CONTENT, SITE_CONFIG } from "@/data/content";
import { buildWhatsAppUrl } from "@/lib/utils";
import { trackContact } from "@/lib/analytics";

type Props = { nextSectionId: string };

const BLUR = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/...";

export function PinnedHero({ nextSectionId }: Props) {
  const rootRef = useRef<HTMLElement | null>(null);

  const handleGallery = () => {
    const el = document.getElementById("gallery");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleWhatsApp = () => {
    const url = buildWhatsAppUrl(
      SITE_CONFIG.whatsappNumber,
      "Hi! I'm interested in booking Lake View Villa Tangalle. Could you please share availability and rates?"
    );
    trackContact("whatsapp", url, "Chat on WhatsApp");
    setTimeout(() => window.open(url, "_blank", "noopener,noreferrer"), 80);
  };

  return (
    <section
      ref={(el) => (rootRef.current = el)}
      id="home"
      className="relative h-[100svh] overflow-hidden touch-pan-y"
      aria-label="Lake View Villa hero section"
    >
      {/* Background image (LCP) + scrim */}
      <div className="absolute inset-0 -z-10">
        <picture>
          {/* AVIF first */}
          <source
            srcSet="/villa/optimized/villa_img_02.webp"
            type="image/avif"
          />
          {/* then WebP */}
          <source
            srcSet="/villa/optimized/villa_img_02.webp"
            type="image/webp"
          />
          {/* fallback — prefer an optimized JPEG/PNG if you have it */}
          <img
            src="/villa/optimized/villa_img_02.webp"
            alt="Lake View Villa Tangalle — aerial view over the lagoon and villa"
            className="w-full h-full object-cover contrast-125 blur-sm transform-gpu will-change-transform"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable={false}
          />
        </picture>

        {/* Scrim */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.68)_0%,rgba(0,0,0,.35)_40%,rgba(0,0,0,.15)_70%,rgba(0,0,0,0)_100%)] dark:bg-[linear-gradient(180deg,rgba(0,0,0,.78)_0%,rgba(0,0,0,.42)_45%,rgba(0,0,0,.18)_75%,rgba(0,0,0,0)_100%)]" />
      </div>

      {/* Noscript fallback for crawlers / non-JS LCP (good for SEO) */}
      <noscript>
        <img
          src="/villa/optimized/villa_img_02.webp"
          alt="Lake View Villa Tangalle — aerial view over the lagoon and villa"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            objectFit: "cover",
          }}
          className="contrast-125 blur-sm"
        />
      </noscript>

      {/* Content (lightweight CSS entrance animation) */}
      <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
        <div className="w-full max-w-5xl mx-auto py-12">
          <h1
            className="font-bold text-shadow-deep mb-4 font-display leading-tight opacity-0 translate-y-6 animate-hero-in"
            // keep it semantic and server-rendered — text content is from HERO_CONTENT
          >
            <span className="block text-shadow-deep">
              <p className="text-[clamp(1.6rem,7vw,4.75rem)]">
                {HERO_CONTENT.titleParts[0]}
              </p>
              <p className="text-[clamp(1.2rem,6vw,3.5rem)]">
                {HERO_CONTENT.titleParts[1]}
              </p>
            </span>
          </h1>

          <p className="mx-auto font-medium text-shadow-deep text-white/95 text-[clamp(0.95rem,3.6vw,1.375rem)] max-w-[68ch] mb-7 opacity-0 translate-y-4 animate-hero-in delay-100">
            <span>{HERO_CONTENT.tagline}</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center opacity-0 translate-y-2 animate-hero-in delay-200">
            <Button
              size="lg"
              className="glass-strong text-shadow-deep text-white border-white/40 hover:border-white/60 px-5 py-3 md:px-8 md:py-5 md:text-lg font-semibold"
              onClick={handleGallery}
              aria-label="View photo gallery of Lake View Villa"
            >
              View Gallery
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-2 text-shadow-deep hover:border-cyan-400/70 hover:text-cyan-100 bg-cyan-500/30 backdrop-blur-2xl text-white border-cyan-300/80 px-5 py-3 md:px-8 md:py-5 md:text-lg hover:glass font-semibold"
              onClick={handleWhatsApp}
              aria-label="Contact us via WhatsApp to book your stay"
            >
              {HERO_CONTENT.ctas[1]}
            </Button>
          </div>
        </div>

        {/* Scroll hint (user-initiated only) */}
        <button
          type="button"
          onClick={() => {
            const endEl = document.getElementById(nextSectionId);
            if (endEl)
              endEl.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="pointer-events-auto absolute bottom-[max(env(safe-area-inset-bottom),1rem)] left-1/2 -translate-x-1/2 text-white/90"
          aria-label="Scroll to next section"
        >
          <div className="flex flex-col items-center px-3 py-1.5">
            <span className="text-xs sm:text-sm mb-1 font-medium">
              Scroll to explore
            </span>
            <ChevronDown className="w-5 h-5" aria-hidden="true" />
          </div>
        </button>
      </div>

      <style jsx>{`
        /* tiny, performative entrance animations using CSS (respects reduced-motion) */
        @media (prefers-reduced-motion: no-preference) {
          .animate-hero-in {
            animation: heroIn 600ms cubic-bezier(0.2, 0.9, 0.2, 1) forwards;
          }
          .delay-100 {
            animation-delay: 140ms;
          }
          .delay-200 {
            animation-delay: 240ms;
          }
          @keyframes heroIn {
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-hero-in {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}

// "use client";

// import { useRef } from "react";
// import Image from "next/image";
// import { motion, useReducedMotion } from "framer-motion";
// import { ChevronDown } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { HERO_CONTENT, SITE_CONFIG } from "@/data/content";
// import { buildWhatsAppUrl } from "@/lib/utils";
// import { trackContact } from "@/lib/analytics";

// type Props = { nextSectionId: string };

// // small blur placeholder (keep your BLUR or a very small base64)
// const BLUR = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/...";

// export function PinnedHero({ nextSectionId }: Props) {
//   const rootRef = useRef<HTMLElement | null>(null);
//   const prefersReducedMotion = useReducedMotion();
//   const allowMotion = !prefersReducedMotion;

//   const handleGallery = () => {
//     const el = document.getElementById("gallery");
//     if (!el) return;
//     el.scrollIntoView({ behavior: "smooth", block: "start" });
//   };

//   const handleWhatsApp = () => {
//     const url = buildWhatsAppUrl(
//       SITE_CONFIG.whatsappNumber,
//       "Hi! I'm interested in booking Lake View Villa Tangalle. Could you please share availability and rates?"
//     );
//     trackContact("whatsapp", url, "Chat on WhatsApp");
//     setTimeout(() => window.open(url, "_blank", "noopener,noreferrer"), 80);
//   };

//   return (
//     <section
//       ref={(el) => (rootRef.current = el)}
//       id="home"
//       className="relative h-[100svh] overflow-hidden touch-pan-y"
//       aria-label="Lake View Villa hero section"
//     >
//       {/* Background image (LCP) + scrim */}
//       <div className="absolute inset-0 -z-10">
//         <Image
//           src="/villa/optimized/villa_img_02.webp"
//           alt="Lake View Villa Tangalle — aerial view over the lagoon and villa"
//           role="img"
//           fill
//           sizes="100vw"
//           priority
//           placeholder="blur"
//           blurDataURL={BLUR}
//           quality={75}
//           className="object-cover contrast-125 blur-sm transform-gpu will-change-transform"
//           draggable={false}
//         />
//         {/* Scrim */}
//         <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.68)_0%,rgba(0,0,0,.35)_40%,rgba(0,0,0,.15)_70%,rgba(0,0,0,0)_100%)] dark:bg-[linear-gradient(180deg,rgba(0,0,0,.78)_0%,rgba(0,0,0,.42)_45%,rgba(0,0,0,.18)_75%,rgba(0,0,0,0)_100%)]" />
//       </div>

//       {/* Noscript fallback for crawlers / non-JS LCP (good for SEO) */}
//       <noscript>
//         <img
//           src="/villa/optimized/villa_img_02.webp"
//           alt="Lake View Villa Tangalle — aerial view over the lagoon and villa"
//           style={{
//             width: "100%",
//             height: "auto",
//             display: "block",
//             objectFit: "cover",
//           }}
//           className="contrast-125 blur-sm"
//         />
//       </noscript>

//       {/* Content */}
//       <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
//         <div className="w-full max-w-5xl mx-auto py-12">
//           <motion.h1
//             className="font-bold text-shadow-deep mb-4 font-display leading-tight"
//             initial={{ y: allowMotion ? 80 : 0, opacity: allowMotion ? 0 : 1 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ duration: 0.9, ease: "easeOut" }}
//             // style={{
//             //   textShadow: "0 0 30px rgba(0,0,0,.45), 0 2px 18px rgba(0,0,0,.6)",
//             // }}
//           >
//             <span className="block text-shadow-deep text-[clamp(1.6rem,7vw,4.75rem)]">
//               <span>{HERO_CONTENT.titleParts[0]}</span>
//               <span>{HERO_CONTENT.titleParts[1]}</span>
//             </span>
//           </motion.h1>

//           <motion.p
//             className="mx-auto font-medium text-shadow-deep text-white/95 text-[clamp(0.95rem,3.6vw,1.375rem)] max-w-[68ch] mb-7"
//             initial={{ y: allowMotion ? 40 : 0, opacity: allowMotion ? 0 : 1 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
//             style={{ textShadow: "0 2px 18px rgba(0,0,0,.55)" }}
//           >
//             <span>{HERO_CONTENT.tagline}</span>
//           </motion.p>

//           <motion.div
//             className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
//             initial={{ y: allowMotion ? 24 : 0, opacity: allowMotion ? 0 : 1 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
//           >
//             <Button
//               size="lg"
//               className="glass-strong text-shadow-deep text-white border-white/40 hover:border-white/60 px-5 py-3 md:px-8 md:py-5 md:text-lg font-semibold"
//               onClick={handleGallery}
//               aria-label="View photo gallery of Lake View Villa"
//             >
//               View Gallery
//             </Button>

//             <Button
//               size="lg"
//               variant="outline"
//               className="border-2 text-shadow-deep hover:border-cyan-400/70 hover:text-cyan-100 bg-cyan-500/30 backdrop-blur-2xl text-white border-cyan-300/80 px-5 py-3 md:px-8 md:py-5 md:text-lg hover:glass font-semibold"
//               onClick={handleWhatsApp}
//               aria-label="Contact us via WhatsApp to book your stay"
//             >
//               {HERO_CONTENT.ctas[1]}
//             </Button>
//           </motion.div>
//         </div>

//         {/* Scroll hint (user-initiated only) */}
//         <button
//           type="button"
//           onClick={() => {
//             const endEl = document.getElementById(nextSectionId);
//             if (endEl)
//               endEl.scrollIntoView({ behavior: "smooth", block: "start" });
//           }}
//           className="pointer-events-auto absolute bottom-[max(env(safe-area-inset-bottom),1rem)] left-1/2 -translate-x-1/2 text-white/90"
//           aria-label="Scroll to next section"
//         >
//           <div className="flex flex-col items-center px-3 py-1.5">
//             <span className="text-xs sm:text-sm mb-1 font-medium">
//               Scroll to explore
//             </span>
//             <ChevronDown className="w-5 h-5" aria-hidden="true" />
//           </div>
//         </button>
//       </div>
//     </section>
//   );
// }
