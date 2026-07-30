import type { ConfidenceLevel, VerificationStatus } from "@/types/database";

/**
 * Single source of truth for the price-comparison rule, exported so Supabase
 * queries can filter server-side without restating the rule and drifting.
 */
export const PRICE_COMPARABLE_STATUSES: VerificationStatus[] = [
  "officially_verified",
  "community_verified",
];

export const PRICE_EXCLUDED_CONFIDENCE: ConfidenceLevel = "low";

/**
 * Reported figures can be shown with their source, but never drive price-led
 * decisions until SchoolCost has reviewed stronger supporting evidence.
 */
export function canUseForPriceComparison(
  status: VerificationStatus,
  confidence: ConfidenceLevel
): boolean {
  return (
    confidence !== PRICE_EXCLUDED_CONFIDENCE &&
    PRICE_COMPARABLE_STATUSES.includes(status)
  );
}

export function isCommunityReport(
  status: VerificationStatus,
  confidence: ConfidenceLevel
): boolean {
  return status === "reported" || confidence === "low";
}
