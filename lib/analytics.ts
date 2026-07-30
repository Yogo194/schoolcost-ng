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

/**
 * Launch taxonomy for SchoolCost NG.
 *
 * Automatic (SDK): $pageview, $pageleave, autocapture, $web_vitals
 * Custom (below): browse → school → fee → compare / submit
 */
export const AnalyticsEvents = {
  /** School profile opened. school_slug, school_name, ownership, has_fees, fee_count */
  schoolViewed: "school_viewed",
  /** Fee detail opened. fee_record_id, school_slug, school_name, course, session, verification_status, confidence_level */
  feeDetailViewed: "fee_detail_viewed",
  /** Compare tray add/remove. school_slug, school_name, action, compare_count */
  compareSchoolToggled: "compare_school_toggled",
  /** Evidence / source URL clicked. source_url, source_label, surface */
  sourceLinkClicked: "source_link_clicked",
  /** Fee submission succeeded. institution_id, course_id, has_evidence_files, evidence_file_count */
  submitFeesSucceeded: "submit_fees_succeeded",
  /** New school suggestion succeeded. school_name, state, ownership_type */
  submitSchoolSucceeded: "submit_school_succeeded",
  /** Correction succeeded. fee_record_id, correction_type, has_evidence_files */
  submitCorrectionSucceeded: "submit_correction_succeeded",
  /** Directory search settled (600ms). query, result_count, state?, ownership?, institution_type? */
  directorySearch: "directory_search",
} as const;
