/**
 * Seed greenlit Round-1 schools from official sources only.
 *
 *   npm run seed:verified-fees
 *
 * Seeds:
 * - Covenant University 2025/2026 programme fees (official PDF)
 * - UNILAG 2023/2024 obligatory fee bands (official notice)
 * - OAU 2023/2024 Senate fee bands (official notice)
 *
 * Does not invent course rows where the source only publishes bands.
 * Does not seed FUTA or LASU (sources not greenlit).
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
  COVENANT_PROGRAMMES,
  COVENANT_SESSION,
  COVENANT_SLUG,
  COVENANT_SOURCE,
} from "../lib/seed/covenant-fees";
import {
  OAU_BANDS,
  OAU_SESSION,
  OAU_SLUG,
  OAU_SOURCE,
} from "../lib/seed/oau-fees";
import {
  UNILAG_BANDS,
  UNILAG_SESSION,
  UNILAG_SLUG,
  UNILAG_SOURCE,
  UNILAG_TOXICOLOGY,
  UNILAG_UTILITY,
} from "../lib/seed/unilag-fees";
import { slugify } from "../lib/utils/format";
import type { FeeCategory, FeeFrequency, FeeAppliesTo } from "../types/database";
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

async function rest<T>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    prefer?: string;
  } = {}
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
      `${options.method ?? "GET"} ${path} → ${response.status}: ${await response.text()}`
    );
  }
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

type SeedLine = {
  name: string;
  category: FeeCategory;
  amount: number;
  is_compulsory: boolean;
  frequency: FeeFrequency;
  applies_to: FeeAppliesTo;
  description: string | null;
};

function toCalcItems(lines: SeedLine[]): FeeItem[] {
  return lines.map((line, index) => ({
    id: `temp-${index}`,
    fee_record_id: "temp",
    name: line.name,
    original_label: line.name,
    category: line.category,
    amount: line.amount,
    is_compulsory: line.is_compulsory,
    frequency: line.frequency,
    applies_to: line.applies_to,
    description: line.description,
    created_at: "",
    updated_at: "",
  }));
}

async function getInstitution(slug: string) {
  const rows = await rest<Array<{ id: string; name: string }>>(
    `/rest/v1/institutions?slug=eq.${slug}&select=id,name`
  );
  const institution = rows[0];
  if (!institution) {
    throw new Error(`Institution ${slug} not found. Run seed:institutions first.`);
  }
  return institution;
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

async function wipeInstitutionFees(institutionId: string) {
  const existing = await rest<Array<{ id: string }>>(
    `/rest/v1/fee_records?institution_id=eq.${institutionId}&select=id`
  );
  if (existing.length > 0) {
    await rest(
      `/rest/v1/fee_records?id=in.(${existing.map((row) => row.id).join(",")})`,
      { method: "DELETE", prefer: "return=minimal" }
    );
  }
  const courses = await rest<Array<{ id: string }>>(
    `/rest/v1/courses?institution_id=eq.${institutionId}&select=id`
  );
  if (courses.length > 0) {
    await rest(
      `/rest/v1/courses?id=in.(${courses.map((row) => row.id).join(",")})`,
      { method: "DELETE", prefer: "return=minimal" }
    );
  }
  return { feesRemoved: existing.length, coursesRemoved: courses.length };
}

async function insertCourse(input: {
  institutionId: string;
  name: string;
  durationYears: number;
}) {
  const rows = await rest<Array<{ id: string; name: string; slug: string }>>(
    `/rest/v1/courses`,
    {
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
    }
  );
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

  return firstYear;
}

async function seedCovenant() {
  const institution = await getInstitution(COVENANT_SLUG);
  const wiped = await wipeInstitutionFees(institution.id);
  const session = await upsertSession(
    institution.id,
    COVENANT_SESSION,
    2025,
    2026,
    true
  );

  console.log(
    `\n${institution.name}: removed ${wiped.feesRemoved} fees / ${wiped.coursesRemoved} courses`
  );

  for (const programme of COVENANT_PROGRAMMES) {
    const course = await insertCourse({
      institutionId: institution.id,
      name: programme.name,
      durationYears: programme.duration_years,
    });

    // Official PDF publishes one NATIONAL total only (no Naira split by fee type).
    const lines: SeedLine[] = [
      {
        name: "Approved national school fees package",
        category: "tuition",
        amount: programme.national_fee,
        is_compulsory: true,
        frequency: "recurring",
        applies_to: "all_students",
        description:
          "Official PDF annual NATIONAL package. Note lists coverage (no separate amounts): tuition, examination, accommodation, sport, medicals registration, medical registration access, ICT facility access, identity card, EDS practical.",
      },
    ];

    const total = await insertFeeRecord({
      institutionId: institution.id,
      courseId: course.id,
      sessionId: session.id,
      level: "Undergraduate",
      studentType: "fresh",
      lines,
      durationYears: programme.duration_years,
      confidence: "high",
      sourceType: "official_fee_circular",
      adminNote: `${COVENANT_SESSION} national fee from Covenant admissions PDF (${programme.college}). Source does not publish component Naira amounts or level/returning splits. International columns omitted.`,
      evidenceUrl: COVENANT_SOURCE,
      evidenceNote: "Official Covenant University approved school fees PDF.",
      evidenceDate: "2025-09-01",
    });

    console.log(`  - ${programme.name}: N${total.toLocaleString("en-NG")}`);
  }
}

async function seedUnilag() {
  const institution = await getInstitution(UNILAG_SLUG);
  const wiped = await wipeInstitutionFees(institution.id);
  const session = await upsertSession(
    institution.id,
    UNILAG_SESSION,
    2023,
    2024,
    true
  );

  console.log(
    `\n${institution.name}: removed ${wiped.feesRemoved} fees / ${wiped.coursesRemoved} courses`
  );

  // Unique course rows per band name (fresh/returning share the course).
  const courseIds = new Map<string, string>();
  for (const band of UNILAG_BANDS) {
    if (!courseIds.has(band.name)) {
      const course = await insertCourse({
        institutionId: institution.id,
        name: band.name,
        durationYears: band.duration_years,
      });
      courseIds.set(band.name, course.id);
    }
  }

  for (const band of UNILAG_BANDS) {
    const lines: SeedLine[] = [
      {
        name: "Revised obligatory charges",
        category: "tuition",
        amount: band.obligatory,
        is_compulsory: true,
        frequency: "recurring",
        applies_to: "all_students",
        description: "Official UNILAG revised obligatory total for this band.",
      },
      {
        name: "Utility charge",
        category: "other",
        amount: UNILAG_UTILITY,
        is_compulsory: true,
        frequency: "recurring",
        applies_to: "all_students",
        description: "Stated on the same official notice for all undergraduates.",
      },
    ];
    if (band.include_toxicology) {
      lines.push({
        name: "Toxicology charge",
        category: "medical_fee",
        amount: UNILAG_TOXICOLOGY,
        is_compulsory: true,
        frequency: "one_time",
        applies_to: "fresh_only",
        description: "Stated on the same official notice for new students.",
      });
    }

    const total = await insertFeeRecord({
      institutionId: institution.id,
      courseId: courseIds.get(band.name)!,
      sessionId: session.id,
      level: band.level,
      studentType: band.student_type,
      lines,
      durationYears: band.duration_years,
      confidence: "medium",
      sourceType: "official_school_source",
      adminNote: `${UNILAG_SESSION} official fee band (not course-specific). Source revised obligatory fees notice. No invented department rows.`,
      evidenceUrl: UNILAG_SOURCE,
      evidenceNote: "Official UNILAG revised obligatory fees notice.",
      evidenceDate: "2023-09-21",
    });

    console.log(
      `  - ${band.name} (${band.student_type}/${band.level}): N${total.toLocaleString("en-NG")}`
    );
  }
}

async function seedOau() {
  const institution = await getInstitution(OAU_SLUG);
  const wiped = await wipeInstitutionFees(institution.id);
  const session = await upsertSession(
    institution.id,
    OAU_SESSION,
    2023,
    2024,
    true
  );

  console.log(
    `\n${institution.name}: removed ${wiped.feesRemoved} fees / ${wiped.coursesRemoved} courses`
  );

  for (const band of OAU_BANDS) {
    const course = await insertCourse({
      institutionId: institution.id,
      name: band.name,
      durationYears: band.duration_years,
    });

    for (const row of [
      {
        studentType: "fresh" as const,
        level: "100L",
        amount: band.fresher,
      },
      {
        studentType: "returning" as const,
        level: "200L+",
        amount: band.returning,
      },
    ]) {
      const lines: SeedLine[] = [
        {
          name: "Senate-adjusted session charges",
          category: "tuition",
          amount: row.amount,
          is_compulsory: true,
          frequency: "recurring",
          applies_to: "all_students",
          description:
            "Official OAU faculty-band total from the September 2023 Senate notice.",
        },
      ];

      const total = await insertFeeRecord({
        institutionId: institution.id,
        courseId: course.id,
        sessionId: session.id,
        level: row.level,
        studentType: row.studentType,
        lines,
        durationYears: band.duration_years,
        confidence: "medium",
        sourceType: "official_school_source",
        adminNote: `${OAU_SESSION} official faculty band from oauife.edu.ng Senate notice (12 Sep 2023). Not course-specific. No newer official circular used.`,
        evidenceUrl: OAU_SOURCE,
        evidenceNote: "Official OAU announcement of adjusted student fees.",
        evidenceDate: "2023-09-12",
      });

      console.log(
        `  - ${band.name} (${row.studentType}): N${total.toLocaleString("en-NG")}`
      );
    }
  }
}

async function main() {
  await seedCovenant();
  await seedUnilag();
  await seedOau();
  console.log("\nDone. FUTA and LASU skipped (not greenlit).");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
