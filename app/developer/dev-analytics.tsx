"use client";
import { useEffect } from "react";
import { trackDeveloperPageView } from "@/lib/analytics";

export default function DevAnalytics() {
  useEffect(() => {
    trackDeveloperPageView();
  }, []);
  return null;
}
