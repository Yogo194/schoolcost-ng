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
  assertActiveInstitution,
  resolveAcademicSessionId,
  resolveCourseId,
} from "@/lib/submissions/resolve";
import {
  submitFeeSchema,
  type SubmitFeeInput,
} from "@/lib/validations/submission";
import type { Json } from "@/types/database";

export type CreateFeeSubmissionInput = SubmitFeeInput & {
  evidenceFiles?: File[];
};

export async function createFeeSubmission(
  input: CreateFeeSubmissionInput
): Promise<SubmissionResult> {
  const parsed = submitFeeSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid submission",
    };
  }

  const data = parsed.data;
  const files = input.evidenceFiles ?? [];

  try {
    validateEvidenceFiles(files);
    const supabase = createServiceClient();

    const institutionOk = await assertActiveInstitution(
      supabase,
      data.institution_id
    );
    if (!institutionOk) {
      return {
        ok: false,
        error:
          "That school is not in our live directory yet. Pick a listed school, or suggest it first.",
      };
    }

    const courseId = await resolveCourseId(
      supabase,
      data.institution_id,
      data.course_id
    );
    const academicSessionId = await resolveAcademicSessionId(
      supabase,
      data.institution_id,
      data.academic_session
    );

    const payload = {
      course_name: data.course_name,
      academic_session: data.academic_session.trim(),
      level: emptyToNull(data.level),
      student_type: data.student_type,
      fees: data.fees,
      source_url: emptyToNull(data.source_url),
      notes: emptyToNull(data.notes),
      evidence_file_count: files.length,
    };

    const { data: submission, error: insertError } = await supabase
      .from("submissions")
      .insert({
        submission_type: "new_fee",
        institution_id: data.institution_id,
        course_id: courseId,
        academic_session_id: academicSessionId,
        submitter_name: emptyToNull(data.submitter_name),
        submitter_email: data.submitter_email.trim().toLowerCase(),
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
        error: insertError?.message ?? "Could not save this submission",
      };
    }

    const uploaded: { path: string; name: string }[] = [];
    try {
      uploaded.push(...(await uploadEvidenceFiles(supabase, submission.id, files)));
      await insertEvidenceRows(supabase, {
        submissionId: submission.id,
        submitterEmail: data.submitter_email.trim().toLowerCase(),
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
          : "Something went wrong saving this submission",
    };
  }
}
