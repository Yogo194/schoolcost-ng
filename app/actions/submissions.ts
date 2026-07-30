"use server";

import { createFeeSubmission } from "@/lib/submissions/create-fee";
import { createCorrectionSubmission } from "@/lib/submissions/create-correction";
import { createSchoolSuggestion } from "@/lib/submissions/create-school";
import type { SubmissionResult } from "@/lib/submissions/evidence";
import {
  submitCorrectionSchema,
  submitFeeSchema,
  suggestSchoolSchema,
  type SuggestSchoolInput,
} from "@/lib/validations/submission";

export async function submitFeeAction(
  formData: FormData
): Promise<SubmissionResult> {
  const raw = formData.get("payload");
  if (typeof raw !== "string") {
    return { ok: false, error: "Missing submission payload" };
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return { ok: false, error: "Invalid submission payload" };
  }

  const parsed = submitFeeSchema.safeParse(json);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid submission",
    };
  }

  const evidenceFiles = formData
    .getAll("evidence")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  return createFeeSubmission({
    ...parsed.data,
    evidenceFiles,
  });
}

export async function suggestSchoolAction(
  input: SuggestSchoolInput
): Promise<SubmissionResult> {
  const parsed = suggestSchoolSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid suggestion",
    };
  }
  return createSchoolSuggestion(parsed.data);
}

export async function submitCorrectionAction(
  formData: FormData
): Promise<SubmissionResult> {
  const raw = formData.get("payload");
  if (typeof raw !== "string") {
    return { ok: false, error: "Missing correction payload" };
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return { ok: false, error: "Invalid correction payload" };
  }

  const parsed = submitCorrectionSchema.safeParse(json);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid correction",
    };
  }

  const evidenceFiles = formData
    .getAll("evidence")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  return createCorrectionSubmission({
    ...parsed.data,
    evidenceFiles,
  });
}
