/**
 * Shared Rest helpers for official fee seed scripts.
 */
import { loadEnvConfig } from "@next/env";
import {
  accommodationTotal,
  compulsoryTotal,
  estimatedDegreeTotal,
  firstYearTotal,
  optionalTotal,
  returningYearTotal,
} from "../calculations/fees";
import { slugify } from "../utils/format";
import type { FeeAppliesTo, FeeCategory, FeeFrequency } from "../../types/database";
import type { FeeItem } from "../../types/fee";

loadEnvConfig(process.cwd());

export type SeedLine = {
  name: string;
  category: FeeCategory;
  amount: number;
  is_compulsory: boolean;
  frequency: FeeFrequency;
  applies_to: FeeAppliesTo;
  description: string;
};

function requireEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }
  return { url, key };
}

export async function rest<T>(
  path: string,
  options: { method?: string; body?: unknown; prefer?: string } = {}
): Promise<T> {
  const { url, key } = requireEnv();
  const response = await fetch(`${url}${path}`, {
    method: options.method ?? "GET",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(options.prefer ? { Prefer: options.prefer } : {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (!response.ok) {
    throw new Error(
      `${options.method ?? "GET"} ${path} -> ${response.status}: ${await response.text()}`
    );
  }
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

function toCalcItems(lines: SeedLine[]): FeeItem[] {
  const now = new Date().toISOString();
  return lines.map((line, index) => ({
    id: `seed-${index}`,
    fee_record_id: "seed",
    name: line.name,
    original_label: line.name,
    category: line.category,
    amount: line.amount,
    is_compulsory: line.is_compulsory,
    frequency: line.frequency,
    applies_to: line.applies_to,
    description: line.description,
    created_at: now,
    updated_at: now,
  }));
}

export async function getInstitution(slug: string) {
  const rows = await rest<Array<{ id: string; name: string }>>(
    `/rest/v1/institutions?slug=eq.${encodeURIComponent(slug)}&select=id,name`
  );
  if (!rows[0]) {
    throw new Error(`Institution ${slug} not found. Run seed:institutions first.`);
  }
  return rows[0];
}

export async function wipeInstitutionFees(institutionId: string) {
  const fees = await rest<Array<{ id: string }>>(
    `/rest/v1/fee_records?institution_id=eq.${institutionId}&select=id`
  );
  for (const fee of fees) {
    await rest(`/rest/v1/evidence?fee_record_id=eq.${fee.id}`, {
      method: "DELETE",
      prefer: "return=minimal",
    });
    await rest(`/rest/v1/fee_items?fee_record_id=eq.${fee.id}`, {
      method: "DELETE",
      prefer: "return=minimal",
    });
  }
  if (fees.length) {
    await rest(`/rest/v1/fee_records?institution_id=eq.${institutionId}`, {
      method: "DELETE",
      prefer: "return=minimal",
    });
  }
  const courses = await rest<Array<{ id: string }>>(
    `/rest/v1/courses?institution_id=eq.${institutionId}&select=id`
  );
  if (courses.length) {
    await rest(`/rest/v1/courses?institution_id=eq.${institutionId}`, {
      method: "DELETE",
      prefer: "return=minimal",
    });
  }
  return { feesRemoved: fees.length, coursesRemoved: courses.length };
}

export async function upsertSession(
  institutionId: string,
  name: string,
  startYear: number,
  endYear: number,
  isCurrent: boolean
) {
  if (isCurrent) {
    await rest(`/rest/v1/academic_sessions?institution_id=eq.${institutionId}`, {
      method: "PATCH",
      prefer: "return=minimal",
      body: { is_current: false },
    });
  }

  const sessions = await rest<Array<{ id: string; name: string }>>(
    `/rest/v1/academic_sessions?on_conflict=institution_id,name`,
    {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=representation",
      body: [
        {
          institution_id: institutionId,
          name,
          start_year: startYear,
          end_year: endYear,
          is_current: isCurrent,
        },
      ],
    }
  );
  if (!sessions[0]) throw new Error(`Could not upsert session ${name}`);
  return sessions[0];
}

export async function insertCourse(input: {
  institutionId: string;
  name: string;
  durationYears: number;
}) {
  const rows = await rest<Array<{ id: string }>>(`/rest/v1/courses`, {
    method: "POST",
    prefer: "return=representation",
    body: [
      {
        institution_id: input.institutionId,
        faculty_id: null,
        name: input.name,
        slug: slugify(input.name),
        duration_years: input.durationYears,
        qualification: "Bachelors",
        is_active: true,
      },
    ],
  });
  if (!rows[0]) throw new Error(`Could not insert course ${input.name}`);
  return rows[0];
}

export async function insertFeeRecord(input: {
  institutionId: string;
  courseId: string;
  sessionId: string;
  level: string | null;
  studentType: "fresh" | "returning";
  lines: SeedLine[];
  durationYears: number;
  confidence: "high" | "medium";
  sourceType: "official_fee_circular" | "official_school_source";
  adminNote: string;
  evidenceUrl: string;
  evidenceNote: string;
  evidenceDate: string;
}) {
  const calcItems = toCalcItems(input.lines);
  const firstYear = firstYearTotal(calcItems);
  const returningYear = returningYearTotal(calcItems);
  const now = new Date().toISOString();

  const feeRecords = await rest<Array<{ id: string }>>(`/rest/v1/fee_records`, {
    method: "POST",
    prefer: "return=representation",
    body: [
      {
        institution_id: input.institutionId,
        course_id: input.courseId,
        academic_session_id: input.sessionId,
        level: input.level,
        student_type: input.studentType,
        currency: "NGN",
        compulsory_total: compulsoryTotal(calcItems),
        optional_total: optionalTotal(calcItems),
        accommodation_total: accommodationTotal(calcItems),
        first_year_total: firstYear,
        returning_year_total: returningYear,
        estimated_degree_total: estimatedDegreeTotal(
          firstYear,
          returningYear,
          input.durationYears
        ),
        verification_status: "officially_verified",
        confidence_level: input.confidence,
        source_type: input.sourceType,
        last_reviewed_at: now,
        review_due_at: null,
        is_published: true,
        admin_note: input.adminNote,
      },
    ],
  });

  const feeRecordId = feeRecords[0]?.id;
  if (!feeRecordId) throw new Error("Fee record insert failed");

  await rest(`/rest/v1/fee_items`, {
    method: "POST",
    prefer: "return=minimal",
    body: input.lines.map((line) => ({
      fee_record_id: feeRecordId,
      name: line.name,
      original_label: line.name,
      category: line.category,
      amount: line.amount,
      is_compulsory: line.is_compulsory,
      frequency: line.frequency,
      applies_to: line.applies_to,
      description: line.description,
    })),
  });

  await rest(`/rest/v1/evidence`, {
    method: "POST",
    prefer: "return=minimal",
    body: [
      {
        fee_record_id: feeRecordId,
        submission_id: null,
        source_type: "official_fee_circular",
        source_url: input.evidenceUrl,
        file_url: null,
        evidence_date: input.evidenceDate,
        review_status: "approved",
        submitted_by_email: null,
        admin_note: input.evidenceNote,
      },
    ],
  });

  return firstYear > 0 ? firstYear : compulsoryTotal(calcItems);
}
