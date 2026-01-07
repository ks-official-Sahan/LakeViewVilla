"use client";

import { useEffect } from "react";

export function GTM() {
  const id = process.env.NEXT_PUBLIC_GTM_ID;

  useEffect(() => {
    if (!id) return;

    let loaded = false;

    const load = () => {
      if (loaded) return;
      loaded = true;

      // Initialize dataLayer and push gtm.start event
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        "gtm.start": new Date().getTime(),
        event: "gtm.js",
      });

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
      document.head.appendChild(script);
    };

    const onFirstInteraction = () => {
      load();
    };

    const events: Array<keyof WindowEventMap> = [
      "click",
      "scroll",
      "keydown",
      "touchstart",
    ];

    events.forEach((evt) => {
      window.addEventListener(evt, onFirstInteraction, {
        once: true,
        passive: true,
      });
    });

    return () => {
      events.forEach((evt) => {
        window.removeEventListener(evt, onFirstInteraction);
      });
    };
  }, [id]);

  return null;
}

// "use client";
// import Script from "next/script";

// export function GTM() {
//   const id = process.env.NEXT_PUBLIC_GTM_ID;
//   if (!id) return null;
//   return (
//     <>
//       <Script id="gtm" strategy="afterInteractive">{`
//         (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
//         new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
//         j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
//         'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
//         })(window,document,'script','dataLayer','${id}');
//       `}</Script>
//       {/* noscript in <body> is added below in layout */}
//     </>
//   );
// }

// export default function GTM() {
//   const id = process.env.NEXT_PUBLIC_GTM_ID;
//   if (!id) return null;
//   return (
//     <>
//       <Script id="gtm" strategy="afterInteractive">{`
// (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
// new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
// j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
// 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
// })(window,document,'script','dataLayer','${id}');
//       `}</Script>
//       <noscript>
//         <iframe
//           src={`https://www.googletagmanager.com/ns.html?id=${id}`}
//           height="0"
//           width="0"
//           style={{ display: "none", visibility: "hidden" }}
//         />
//       </noscript>
//     </>
//   );
// }
