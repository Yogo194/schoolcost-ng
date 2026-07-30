"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

/**
 * Belt-and-suspenders init for App Router.
 * instrumentation-client.ts also inits; this no-ops if already loaded.
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key =
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ||
      process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host =
      process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

    if (!key || key.includes("your-key")) return;
    if (typeof window === "undefined") return;
    if ((posthog as { __loaded?: boolean }).__loaded) return;

    posthog.init(key, {
      api_host: host,
      defaults: "2026-05-30",
      capture_pageview: true,
      capture_pageleave: true,
      person_profiles: "identified_only",
      loaded: (client) => {
        if (process.env.NODE_ENV === "development") {
          client.debug();
        }
      },
    });
  }, []);

  return <>{children}</>;
}
