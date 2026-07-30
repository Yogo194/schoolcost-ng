import posthog from "posthog-js";

/**
 * Lightweight client init for Next.js 15.3+ / 16.
 * Pageviews + autocapture come from PostHog defaults.
 */
const key =
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ||
  process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

if (key && !key.includes("your-key")) {
  posthog.init(key, {
    api_host: host,
    defaults: "2026-05-30",
    capture_pageview: true,
    capture_pageleave: true,
    person_profiles: "identified_only",
  });
}
