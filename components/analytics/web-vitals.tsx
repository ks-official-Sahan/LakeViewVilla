"use client";

import { useEffect } from "react";

export function WebVitals() {
  useEffect(() => {
    const sendMetric = (metric: any) => {
      // Redact PII and send to API
      const body = JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        // Remove any potential PII
        url: window.location.pathname,
        timestamp: Date.now(),
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/metrics", body);
      } else {
        fetch("/api/metrics", {
          method: "POST",
          body,
          headers: { "Content-Type": "application/json" },
          keepalive: true,
        }).catch(() => {
          // Silently fail
        });
      }
    };

    const loadWebVitals = async () => {
      try {
        const { onCLS, onINP, onFCP, onLCP, onTTFB } = await import(
          "web-vitals"
        );
        onCLS(sendMetric);
        onINP(sendMetric);
        onFCP(sendMetric);
        onLCP(sendMetric);
        onTTFB(sendMetric);
      } catch (error) {
        console.warn("Web Vitals not available:", error);
      }
    };

    loadWebVitals();
  }, []);

  return null;
}
