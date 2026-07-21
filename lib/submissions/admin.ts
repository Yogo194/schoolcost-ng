import { createServiceClient } from "@/lib/supabase/service";
import { signEvidenceFileUrl } from "@/lib/submissions/evidence";
import {
  publishFeeFromSubmission,
  publishSchoolFromSuggestion,
} from "@/lib/submissions/publish";
import type { Evidence } from "@/types/fee";
import type { SubmissionStatus } from "@/types/database";
import type { SubmissionWithDetails } from "@/types/submission";

const SUBMISSION_SELECT = `
  *,
  institution:institutions ( name, slug ),
  course:courses ( name ),
  academic_session:academic_sessions ( name )
`;

export async function listSubmissions(): Promise<SubmissionWithDetails[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("submissions")
    .select(SUBMISSION_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as SubmissionWithDetails[];
}

export async function getSubmissionById(id: string): Promise<{
  submission: SubmissionWithDetails;
  evidence: Evidence[];
} | null> {
  const supabase = createServiceClient();

  const { data: submission, error } = await supabase
    .from("submissions")
    .select(SUBMISSION_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!submission) return null;

  const { data: evidenceRows, error: evidenceError } = await supabase
    .from("evidence")
    .select("*")
    .eq("submission_id", id)
    .order("created_at", { ascending: true });

  if (evidenceError) throw new Error(evidenceError.message);

  const evidence = await Promise.all(
    (evidenceRows ?? []).map(async (row) => ({
      ...row,
      file_url: await signEvidenceFileUrl(supabase, row.file_url),
    }))
  );

  return {
    submission: submission as SubmissionWithDetails,
    evidence,
  };
}

export type ModerateResult = {
  feeRecordId?: string;
  institutionId?: string;
};

export async function moderateSubmission(
  id: string,
  status: SubmissionStatus,
  feedback?: string
): Promise<ModerateResult> {
  const supabase = createServiceClient();
  const result: ModerateResult = {};

  const { data: submission, error: fetchError } = await supabase
    .from("submissions")
    .select(
      "id, submission_type, institution_id, course_id, submitter_email, submitted_payload, status"
    )
    .eq("id", id)
    .maybeSingle();

  if (fetchError) throw new Error(fetchError.message);
  if (!submission) throw new Error("Submission not found");

  const shouldPublish =
    status === "approved" || status === "approved_with_edits";

  if (shouldPublish) {
    if (submission.submission_type === "new_fee") {
      const published = await publishFeeFromSubmission(supabase, submission);
      result.feeRecordId = published.feeRecordId;
    }
    if (submission.submission_type === "suggest_school") {
      const published = await publishSchoolFromSuggestion(supabase, submission);
      result.institutionId = published.institutionId;
    }
  }

  const noteParts = [feedback?.trim()].filter(Boolean) as string[];
  if (result.feeRecordId) {
    noteParts.push(`Draft fee record: ${result.feeRecordId}`);
  }
  if (result.institutionId) {
    noteParts.push(`Draft institution: ${result.institutionId}`);
  }

  const { error } = await supabase
    .from("submissions")
    .update({
      status,
      admin_feedback: noteParts.length ? noteParts.join("\n") : null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return result;
}
