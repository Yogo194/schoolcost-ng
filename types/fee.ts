import type {
  Database,
  FeeCategory,
  FeeFrequency,
  FeeAppliesTo,
  VerificationStatus,
  ConfidenceLevel,
  SourceType,
} from "./database";

export type FeeRecord = Database["public"]["Tables"]["fee_records"]["Row"];

export type FeeItem = Database["public"]["Tables"]["fee_items"]["Row"];

export type Evidence = Database["public"]["Tables"]["evidence"]["Row"];

export type FeeRecordWithItems = FeeRecord & {
  fee_items: FeeItem[];
};

export type FeeRecordWithDetails = FeeRecord & {
  fee_items: FeeItem[];
  evidence: Evidence[];
};

export const FEE_CATEGORY_LABELS: Record<FeeCategory, string> = {
  tuition: "Tuition",
  acceptance_fee: "Acceptance Fee",
  departmental_fee: "Departmental Fee",
  faculty_fee: "Faculty Fee",
  ict_fee: "ICT Fee",
  medical_fee: "Medical Fee",
  exam_fee: "Exam Fee",
  development_levy: "Development Levy",
  student_union_fee: "Student Union Fee",
  accommodation: "Accommodation",
  other: "Other Charges",
};

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
  officially_verified: "Officially Verified",
  community_verified: "Community Verified",
  reported: "Reported",
  outdated: "Outdated",
  disputed: "Disputed",
};

export const CONFIDENCE_LEVEL_LABELS: Record<ConfidenceLevel, string> = {
  high: "High Confidence",
  medium: "Medium Confidence",
  low: "Low Confidence",
};

/** One-line meaning shown next to confidence meters. */
export const CONFIDENCE_LEVEL_SUMMARIES: Record<ConfidenceLevel, string> = {
  high: "Strong source, recently reviewed, breakdown looks complete",
  medium: "Credible evidence, but some details may be incomplete",
  low: "Weak or unclear source. Confirm directly with the school",
};

export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  official_school_source: "Official School Source",
  official_fee_circular: "Official Fee Circular",
  school_representative: "School Representative",
  student_portal_evidence: "Student Portal Evidence",
  payment_invoice: "Payment Invoice",
  community_reported: "Community Reported",
};

export const FEE_FREQUENCY_LABELS: Record<FeeFrequency, string> = {
  one_time: "One-time",
  recurring: "Yearly",
};

export const FEE_APPLIES_TO_LABELS: Record<FeeAppliesTo, string> = {
  fresh_only: "Fresh students only",
  returning_only: "Returning students only",
  all_students: "All students",
};

export const STUDENT_LEVELS = [
  "100 Level",
  "200 Level",
  "300 Level",
  "400 Level",
  "500 Level",
  "600 Level",
  "Postgraduate",
] as const;
