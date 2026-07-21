import {
  accommodationTotal,
  compulsoryTotal,
  estimatedDegreeTotal,
  firstYearTotal,
  optionalTotal,
  returningYearTotal,
} from "@/lib/calculations/fees";
import { createServiceClient } from "@/lib/supabase/service";
import { resolveAcademicSessionId } from "@/lib/submissions/resolve";
import type {
  FeeAppliesTo,
  FeeCategory,
  FeeFrequency,
  Json,
  StudentType,
} from "@/types/database";
import type { FeeItem } from "@/types/fee";
import type { SubmitFeePayload, SuggestSchoolPayload } from "@/types/submission";

type ServiceClient = ReturnType<typeof createServiceClient>;

function asFeeItems(
  fees: SubmitFeePayload["fees"],
  feeRecordId: string
): Omit<FeeItem, "id" | "created_at" | "updated_at">[] {
  return fees.map((fee) => ({
    fee_record_id: feeRecordId,
    name: fee.name,
    original_label: fee.name,
    category: fee.category as FeeCategory,
    amount: fee.amount,
    is_compulsory: fee.is_compulsory,
    frequency: fee.frequency as FeeFrequency,
    applies_to: fee.applies_to as FeeAppliesTo,
    description: null,
  }));
}

function toCalcItems(
  fees: SubmitFeePayload["fees"]
): FeeItem[] {
  return fees.map((fee, index) => ({
    id: `temp-${index}`,
    fee_record_id: "temp",
    name: fee.name,
    original_label: fee.name,
    category: fee.category as FeeCategory,
    amount: fee.amount,
    is_compulsory: fee.is_compulsory,
    frequency: fee.frequency as FeeFrequency,
    applies_to: fee.applies_to as FeeAppliesTo,
    description: null,
    created_at: "",
    updated_at: "",
  }));
}

/**
 * Turn an approved new_fee submission into a draft fee_record + fee_items.
 * Drafts are not published (is_published = false) until an admin toggles them.
 */
export async function publishFeeFromSubmission(
  supabase: ServiceClient,
  submission: {
    id: string;
    institution_id: string | null;
    course_id: string | null;
    submitter_email: string | null;
    submitted_payload: Json;
  }
): Promise<{ feeRecordId: string }> {
  if (!submission.institution_id) {
    throw new Error("Submission is missing an institution");
  }

  const payload = submission.submitted_payload as SubmitFeePayload;
  if (!payload?.fees?.length) {
    throw new Error("Submission has no fee lines to publish");
  }

  const sessionName =
    typeof payload.academic_session === "string"
      ? payload.academic_session
      : "";
  const academicSessionId = await resolveAcademicSessionId(
    supabase,
    submission.institution_id,
    sessionName
  );
  if (!academicSessionId) {
    throw new Error("Could not resolve academic session for this submission");
  }

  const calcItems = toCalcItems(payload.fees);
  const firstYear = firstYearTotal(calcItems);
  const returningYear = returningYearTotal(calcItems);
  const studentType = (payload.student_type ?? "fresh") as StudentType;

  const { data: feeRecord, error: feeError } = await supabase
    .from("fee_records")
    .insert({
      institution_id: submission.institution_id,
      course_id: submission.course_id,
      academic_session_id: academicSessionId,
      level: payload.level ?? null,
      student_type: studentType,
      currency: "NGN",
      compulsory_total: compulsoryTotal(calcItems),
      optional_total: optionalTotal(calcItems),
      accommodation_total: accommodationTotal(calcItems),
      first_year_total: firstYear,
      returning_year_total: returningYear,
      estimated_degree_total: estimatedDegreeTotal(firstYear, returningYear, 4),
      verification_status: "community_verified",
      confidence_level: "medium",
      source_type: "community_reported",
      last_reviewed_at: new Date().toISOString(),
      review_due_at: null,
      is_published: false,
      admin_note: `Created from submission ${submission.id}${
        submission.submitter_email ? ` (${submission.submitter_email})` : ""
      }`,
    })
    .select("id")
    .single();

  if (feeError || !feeRecord) {
    throw new Error(feeError?.message ?? "Could not create fee record");
  }

  const { error: itemsError } = await supabase
    .from("fee_items")
    .insert(asFeeItems(payload.fees, feeRecord.id));

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  // Link evidence files to the new fee record as well.
  await supabase
    .from("evidence")
    .update({ fee_record_id: feeRecord.id })
    .eq("submission_id", submission.id);

  // Attach resolved session FK on the submission for cleaner admin history.
  await supabase
    .from("submissions")
    .update({ academic_session_id: academicSessionId })
    .eq("id", submission.id);

  return { feeRecordId: feeRecord.id };
}

/**
 * Create an inactive institution draft from an approved school suggestion.
 */
export async function publishSchoolFromSuggestion(
  supabase: ServiceClient,
  submission: {
    id: string;
    submitted_payload: Json;
  }
): Promise<{ institutionId: string }> {
  const payload = submission.submitted_payload as SuggestSchoolPayload;
  if (!payload?.school_name?.trim()) {
    throw new Error("Suggestion is missing a school name");
  }

  const baseSlug = payload.school_name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  const slug = `${baseSlug || "school"}-${submission.id.slice(0, 8)}`;

  const { data: institution, error } = await supabase
    .from("institutions")
    .insert({
      name: payload.school_name.trim(),
      slug,
      abbreviation: null,
      logo_url: null,
      institution_type: payload.institution_type as never,
      ownership_type: payload.ownership_type as never,
      state: payload.state,
      city: null,
      website_url: payload.website_url ?? null,
      description: payload.notes ?? null,
      is_active: false,
    })
    .select("id")
    .single();

  if (error || !institution) {
    throw new Error(error?.message ?? "Could not create institution");
  }

  await supabase
    .from("submissions")
    .update({ institution_id: institution.id })
    .eq("id", submission.id);

  return { institutionId: institution.id };
}
