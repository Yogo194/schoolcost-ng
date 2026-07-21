import type { FeeAppliesTo, FeeCategory, FeeFrequency } from "@/types/database";

/**
 * Smart defaults so contributed lines can drive first-year vs returning
 * totals in lib/calculations/fees.ts without asking every detail up front.
 */
export function defaultsForFeeCategory(category: FeeCategory): {
  is_compulsory: boolean;
  frequency: FeeFrequency;
  applies_to: FeeAppliesTo;
} {
  switch (category) {
    case "acceptance_fee":
      return {
        is_compulsory: true,
        frequency: "one_time",
        applies_to: "fresh_only",
      };
    case "accommodation":
      return {
        is_compulsory: false,
        frequency: "recurring",
        applies_to: "all_students",
      };
    default:
      return {
        is_compulsory: true,
        frequency: "recurring",
        applies_to: "all_students",
      };
  }
}
