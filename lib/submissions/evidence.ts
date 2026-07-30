import "server-only";

import {
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE,
} from "@/lib/validations/submission";
import type { Database, EvidenceSourceType } from "@/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";

export const EVIDENCE_BUCKET = "submission-evidence";

type ServiceClient = SupabaseClient<Database>;

export type SubmissionResult =
  | { ok: true; submissionId: string }
  | { ok: false; error: string };

export function emptyToNull(value: string | undefined | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export async function uploadEvidenceFiles(
  supabase: ServiceClient,
  submissionId: string,
  files: File[]
): Promise<{ path: string; name: string }[]> {
  const uploaded: { path: string; name: string }[] = [];

  validateEvidenceFiles(files);

  try {
    for (const file of files) {
      const safeName = file.name.replace(/[^\w.\-()+ ]+/g, "_").slice(0, 120);
      const path = `${submissionId}/${crypto.randomUUID()}-${safeName}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      const { error } = await supabase.storage
        .from(EVIDENCE_BUCKET)
        .upload(path, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        if (/bucket|not found|does not exist/i.test(error.message)) {
          throw new Error(
            "Proof uploads are not available yet (storage bucket missing). Apply migration 004, or submit without a file."
          );
        }
        throw new Error(`Could not upload “${file.name}”: ${error.message}`);
      }

      uploaded.push({ path, name: file.name });
    }
  } catch (error) {
    await cleanupUploadedEvidenceFiles(supabase, uploaded);
    throw error;
  }

  return uploaded;
}

export function validateEvidenceFiles(files: File[]): void {
  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`“${file.name}” is larger than 10 MB`);
    }
    if (!file.type || !ACCEPTED_FILE_TYPES.includes(file.type)) {
      throw new Error(`“${file.name}” must be a PDF or image`);
    }
  }
}

export async function cleanupUploadedEvidenceFiles(
  supabase: ServiceClient,
  uploaded: { path: string }[]
): Promise<void> {
  const paths = uploaded.map((file) => file.path).filter(Boolean);
  if (paths.length === 0) return;
  await supabase.storage.from(EVIDENCE_BUCKET).remove(paths);
}

export async function insertEvidenceRows(
  supabase: ServiceClient,
  input: {
    submissionId: string;
    submitterEmail: string | null;
    sourceUrl?: string | null;
    uploaded: { path: string; name: string }[];
  }
): Promise<void> {
  const rows: Database["public"]["Tables"]["evidence"]["Insert"][] = [];

  if (input.sourceUrl) {
    rows.push({
      submission_id: input.submissionId,
      fee_record_id: null,
      source_type: "official_school_webpage" satisfies EvidenceSourceType,
      source_url: input.sourceUrl,
      file_url: null,
      evidence_date: null,
      review_status: "pending",
      submitted_by_email: input.submitterEmail,
      admin_note: null,
    });
  }

  for (const file of input.uploaded) {
    rows.push({
      submission_id: input.submissionId,
      fee_record_id: null,
      source_type: "student_portal_screenshot" satisfies EvidenceSourceType,
      source_url: null,
      file_url: file.path,
      evidence_date: null,
      review_status: "pending",
      submitted_by_email: input.submitterEmail,
      admin_note: `Uploaded file: ${file.name}`,
    });
  }

  if (rows.length === 0) return;

  const { error } = await supabase.from("evidence").insert(rows);
  if (error) {
    throw new Error(`Could not save evidence: ${error.message}`);
  }
}

/** Turn a stored storage path into a short-lived signed URL for admins. */
export async function signEvidenceFileUrl(
  supabase: ServiceClient,
  fileUrl: string | null
): Promise<string | null> {
  if (!fileUrl) return null;
  if (/^https?:\/\//i.test(fileUrl)) return fileUrl;

  const { data, error } = await supabase.storage
    .from(EVIDENCE_BUCKET)
    .createSignedUrl(fileUrl, 60 * 60);

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}
