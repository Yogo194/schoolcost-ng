import { createServiceClient } from "@/lib/supabase/service";
import {
  emptyToNull,
  cleanupUploadedEvidenceFiles,
  insertEvidenceRows,
  uploadEvidenceFiles,
  validateEvidenceFiles,
  type SubmissionResult,
} from "@/lib/submissions/evidence";
import {
  submitCorrectionSchema,
  type SubmitCorrectionInput,
} from "@/lib/validations/submission";
import type { Json } from "@/types/database";

export type CreateCorrectionSubmissionInput = SubmitCorrectionInput & {
  evidenceFiles?: File[];
};

export async function createCorrectionSubmission(
  input: CreateCorrectionSubmissionInput
): Promise<SubmissionResult> {
  const parsed = submitCorrectionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid correction",
    };
  }

  const data = parsed.data;
  const files = input.evidenceFiles ?? [];

  try {
    validateEvidenceFiles(files);
    const supabase = createServiceClient();

    const { data: feeRecord, error: feeRecordError } = await supabase
      .from("fee_records")
      .select("id, institution_id, course_id, academic_session_id, is_published")
      .eq("id", data.fee_record_id)
      .maybeSingle();

    if (feeRecordError) {
      return {
        ok: false,
        error: feeRecordError.message,
      };
    }

    if (!feeRecord?.id || !feeRecord.is_published) {
      return {
        ok: false,
        error: "We could not find that published fee record.",
      };
    }

    const payload = {
      fee_record_id: data.fee_record_id,
      correction_type: data.correction_type,
      description: data.description.trim(),
      suggested_amount: data.suggested_amount ?? null,
      source_url: emptyToNull(data.source_url),
      evidence_file_count: files.length,
    };

    const { data: submission, error: insertError } = await supabase
      .from("submissions")
      .insert({
        submission_type: "correction",
        institution_id: feeRecord.institution_id,
        course_id: feeRecord.course_id,
        academic_session_id: feeRecord.academic_session_id,
        submitter_name: emptyToNull(data.submitter_name),
        submitter_email: emptyToNull(data.submitter_email),
        submitted_payload: payload as Json,
        status: "pending",
        admin_feedback: null,
        reviewed_at: null,
      })
      .select("id")
      .single();

    if (insertError || !submission) {
      return {
        ok: false,
        error: insertError?.message ?? "Could not save this correction",
      };
    }

    const uploaded: { path: string; name: string }[] = [];
    try {
      uploaded.push(...(await uploadEvidenceFiles(supabase, submission.id, files)));
      await insertEvidenceRows(supabase, {
        submissionId: submission.id,
        submitterEmail: emptyToNull(data.submitter_email),
        sourceUrl: emptyToNull(data.source_url),
        uploaded,
      });
    } catch (error) {
      await cleanupUploadedEvidenceFiles(supabase, uploaded);
      await supabase.from("submissions").delete().eq("id", submission.id);
      throw error;
    }

    return { ok: true, submissionId: submission.id };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong saving this correction",
    };
  }
}
