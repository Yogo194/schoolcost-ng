/**
 * Seed FUOYE 2025/2026 undergraduate full-time sundry fee bands.
 *
 *   npm run seed:fuoye-fees
 *
 * Official sources only. Does not invent course rows.
 */
import {
  accommodationTotal,
  compulsoryTotal,
  estimatedDegreeTotal,
  firstYearTotal,
  optionalTotal,
  returningYearTotal,
} from "../lib/calculations/fees";
import {
  FUOYE_ACCEPTANCE,
  FUOYE_BANDS,
  FUOYE_FLIPBOOK,
  FUOYE_MEDICAL_REGISTRATION,
  FUOYE_SESSION,
  FUOYE_SLUG,
  FUOYE_SOURCE,
  type FuoyeBand,
} from "../lib/seed/fuoye-fees";
import { slugify } from "../lib/utils/format";
import type { FeeAppliesTo, FeeCategory, FeeFrequency } from "../types/database";
import type { FeeItem } from "../types/fee";

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

const { url: BASE, key: KEY } = requireEnv();

async function rest<T>(
  path: string,
  init?: {
    method?: string;
    body?: unknown;
    prefer?: string;
    headers?: Record<string, string>;
  }
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      Prefer: init?.prefer ?? "return=representation",
      ...init?.headers,
    },
    body: init?.body === undefined ? undefined : JSON.stringify(init.body),
  });
  if (!res.ok) {
    throw new Error(`${init?.method ?? "GET"} ${path}: ${await res.text()}`);
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

type SeedLine = {
  name: string;
  category: FeeCategory;
  amount: number;
  is_compulsory: boolean;
  frequency: FeeFrequency;
  applies_to: FeeAppliesTo;
  description: string;
};

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

async function getInstitution(slug: string) {
  const rows = await rest<Array<{ id: string; name: string }>>(
    `/rest/v1/institutions?slug=eq.${encodeURIComponent(slug)}&select=id,name`
  );
  if (!rows[0]) throw new Error(`Institution not found: ${slug}`);
  return rows[0];
}

async function wipeInstitutionFees(institutionId: string) {
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

async function upsertSession(
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

async function insertCourse(input: {
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

async function insertFeeRecord(input: {
  institutionId: string;
  courseId: string;
  sessionId: string;
  level: string | null;
  studentType: "fresh" | "returning";
  lines: SeedLine[];
  durationYears: number;
  adminNote: string;
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
        confidence_level: "high",
        source_type: "official_fee_circular",
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
        source_url: FUOYE_SOURCE,
        file_url: null,
        evidence_date: "2025-09-01",
        review_status: "approved",
        submitted_by_email: null,
        admin_note: `Official FUOYE eCampus fee schedule. Flipbook mirror: ${FUOYE_FLIPBOOK}`,
      },
    ],
  });

  return firstYear;
}

function fresherLines(band: FuoyeBand): SeedLine[] {
  const acceptance = FUOYE_ACCEPTANCE[band.acceptance_group];
  return [
    {
      name: "Sundry fees (freshers)",
      category: "tuition",
      amount: band.fresher,
      is_compulsory: true,
      frequency: "recurring",
      applies_to: "fresh_only",
      description: "Official FUOYE undergraduate full-time fresher sundry band.",
    },
    {
      name: "Acceptance fee",
      category: "acceptance_fee",
      amount: acceptance,
      is_compulsory: true,
      frequency: "one_time",
      applies_to: "fresh_only",
      description: "Official acceptance fee for this faculty group (freshers only).",
    },
    {
      name: "Medical registration and fitness screening",
      category: "medical_fee",
      amount: FUOYE_MEDICAL_REGISTRATION,
      is_compulsory: true,
      frequency: "one_time",
      applies_to: "fresh_only",
      description: "Listed on the same official eCampus fee schedule.",
    },
  ];
}

function returningLines(amount: number): SeedLine[] {
  return [
    {
      name: "Sundry fees (returning)",
      category: "tuition",
      amount,
      is_compulsory: true,
      frequency: "recurring",
      // Record is already student_type=returning; use all_students so first_year_total
      // (used on the profile table) matches the published band amount.
      applies_to: "all_students",
      description: "Official FUOYE undergraduate full-time returning sundry band.",
    },
  ];
}

async function main() {
  const institution = await getInstitution(FUOYE_SLUG);
  const wiped = await wipeInstitutionFees(institution.id);
  const session = await upsertSession(
    institution.id,
    FUOYE_SESSION,
    2025,
    2026,
    true
  );

  console.log(
    `\n${institution.name}: removed ${wiped.feesRemoved} fees / ${wiped.coursesRemoved} courses`
  );

  for (const band of FUOYE_BANDS) {
    const course = await insertCourse({
      institutionId: institution.id,
      name: band.name,
      durationYears: band.duration_years,
    });

    const freshTotal = await insertFeeRecord({
      institutionId: institution.id,
      courseId: course.id,
      sessionId: session.id,
      level: "100L",
      studentType: "fresh",
      lines: fresherLines(band),
      durationYears: band.duration_years,
      adminNote: `${FUOYE_SESSION} official full-time undergraduate sundry band + acceptance + medical registration. Not course-specific. Part-time and hostel omitted.`,
    });
    console.log(`  - ${band.name} (fresh/100L): N${freshTotal.toLocaleString("en-NG")}`);

    if (band.returning_200 != null) {
      const total200 = await insertFeeRecord({
        institutionId: institution.id,
        courseId: course.id,
        sessionId: session.id,
        level: "200L",
        studentType: "returning",
        lines: returningLines(band.returning_200),
        durationYears: band.duration_years,
        adminNote: `${FUOYE_SESSION} official returning 200L sundry band. Not course-specific.`,
      });
      console.log(
        `  - ${band.name} (returning/200L): N${total200.toLocaleString("en-NG")}`
      );
    }

    if (band.returning != null) {
      const level = band.returning_200 != null ? "300L+" : "200L+";
      const total = await insertFeeRecord({
        institutionId: institution.id,
        courseId: course.id,
        sessionId: session.id,
        level,
        studentType: "returning",
        lines: returningLines(band.returning),
        durationYears: band.duration_years,
        adminNote: `${FUOYE_SESSION} official returning sundry band. Not course-specific.`,
      });
      console.log(
        `  - ${band.name} (returning/${level}): N${total.toLocaleString("en-NG")}`
      );
    }
  }

  console.log("\nDone. FUOYE 2025/2026 bands seeded.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
