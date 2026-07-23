import type { ConfidenceLevel, VerificationStatus } from "@/types/database";

/**
 * Reported figures can be shown with their source, but never drive price-led
 * decisions until SchoolCost has reviewed stronger supporting evidence.
 */
export function canUseForPriceComparison(
  status: VerificationStatus,
  confidence: ConfidenceLevel
): boolean {
  return (
    confidence !== "low" &&
    (status === "officially_verified" || status === "community_verified")
  );
}

export function isCommunityReport(
  status: VerificationStatus,
  confidence: ConfidenceLevel
): boolean {
  return status === "reported" || confidence === "low";
}
