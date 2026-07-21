import type { Database, SubmissionType, SubmissionStatus } from "./database";

export type Submission = Database["public"]["Tables"]["submissions"]["Row"];

export type SubmissionWithDetails = Submission & {
  institution?: { name: string; slug: string } | null;
  course?: { name: string } | null;
  academic_session?: { name: string } | null;
};

export const SUBMISSION_TYPE_LABELS: Record<SubmissionType, string> = {
  new_fee: "New Fee Information",
  correction: "Correction",
  missing_charge: "Missing Charge",
  suggest_school: "School Suggestion",
};

export const SUBMISSION_STATUS_LABELS: Record<SubmissionStatus, string> = {
  pending: "Pending Review",
  approved: "Approved",
  approved_with_edits: "Approved with Edits",
  rejected: "Rejected",
  needs_more_evidence: "Needs More Evidence",
  duplicate: "Duplicate",
  disputed: "Disputed",
};

export const SUBMISSION_STATUS_COLORS: Record<
  SubmissionStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "secondary",
  approved: "default",
  approved_with_edits: "default",
  rejected: "destructive",
  needs_more_evidence: "outline",
  duplicate: "secondary",
  disputed: "destructive",
};

export type SubmitFeePayload = {
  institution_id: string;
  course_id?: string;
  course_name: string;
  academic_session: string;
  level?: string | null;
  student_type: string;
  fees: Array<{
    name: string;
    category: string;
    amount: number;
    is_compulsory: boolean;
    frequency: string;
    applies_to: string;
  }>;
  source_url?: string | null;
  notes?: string | null;
  evidence_file_count?: number;
};

export type SubmitCorrectionPayload = {
  correction_type: "wrong_amount" | "wrong_session" | "missing_item" | "other";
  description: string;
  suggested_amount?: number;
  fee_item_id?: string;
};

export type SuggestSchoolPayload = {
  school_name: string;
  institution_type: string;
  ownership_type: string;
  state: string;
  website_url?: string | null;
  notes?: string | null;
};
