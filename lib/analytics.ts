import posthog from "posthog-js";

type Props = Record<string, string | number | boolean | null | undefined>;

function isEnabled() {
  const key =
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ||
    process.env.NEXT_PUBLIC_POSTHOG_KEY;
  return Boolean(key && !key.includes("your-key"));
}

/** Safe client-side capture. No-ops when PostHog is not configured. */
export function track(event: string, properties?: Props) {
  if (typeof window === "undefined" || !isEnabled()) return;
  try {
    posthog.capture(event, properties);
  } catch {
    // Never break UX for analytics.
  }
}

export const AnalyticsEvents = {
  schoolViewed: "school_viewed",
  feeDetailViewed: "fee_detail_viewed",
  compareSchoolToggled: "compare_school_toggled",
  sourceLinkClicked: "source_link_clicked",
  submitFeesSucceeded: "submit_fees_succeeded",
  submitSchoolSucceeded: "submit_school_succeeded",
  submitCorrectionSucceeded: "submit_correction_succeeded",
  directorySearch: "directory_search",
} as const;
