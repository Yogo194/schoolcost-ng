import { createServiceClient } from "@/lib/supabase/service";
import { signEvidenceFileUrl } from "@/lib/submissions/evidence";
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

export async function moderateSubmission(
  id: string,
  status: SubmissionStatus,
  feedback?: string
): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("submissions")
    .update({
      status,
      admin_feedback: feedback?.trim() || null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
}
