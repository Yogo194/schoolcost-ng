import { createServiceClient } from "@/lib/supabase/service";
import { emptyToNull, type SubmissionResult } from "@/lib/submissions/evidence";
import {
  suggestSchoolSchema,
  type SuggestSchoolInput,
} from "@/lib/validations/submission";
import type { Json } from "@/types/database";

export async function createSchoolSuggestion(
  input: SuggestSchoolInput
): Promise<SubmissionResult> {
  const parsed = suggestSchoolSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid suggestion",
    };
  }

  const data = parsed.data;

  try {
    const supabase = createServiceClient();

    const payload = {
      school_name: data.school_name.trim(),
      institution_type: data.institution_type,
      ownership_type: data.ownership_type,
      state: data.state,
      website_url: emptyToNull(data.website_url),
      notes: emptyToNull(data.notes),
    };

    const { data: submission, error } = await supabase
      .from("submissions")
      .insert({
        submission_type: "suggest_school",
        institution_id: null,
        course_id: null,
        academic_session_id: null,
        submitter_name: data.submitter_name.trim(),
        submitter_email: data.submitter_email.trim().toLowerCase(),
        submitted_payload: payload as Json,
        status: "pending",
        admin_feedback: null,
        reviewed_at: null,
      })
      .select("id")
      .single();

    if (error || !submission) {
      return {
        ok: false,
        error: error?.message ?? "Could not save this suggestion",
      };
    }

    return { ok: true, submissionId: submission.id };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong saving this suggestion",
    };
  }
}
