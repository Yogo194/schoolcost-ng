/**
 * Seed University of Ibadan 2025/2026 NELFUND Total Levy schedule.
 *
 * Usage:
 *   npm run seed:ui-fees
 *
 * Replaces all existing UI fee_records. Creates one published record per
 * course + level (+ Direct Entry where listed). Acceptance is added only on
 * fresher rows (official ₦50,000 for 2025/2026).
 */
import {
  accommodationTotal,
  compulsoryTotal,
  firstYearTotal,
  optionalTotal,
  returningYearTotal,
} from "../lib/calculations/fees";
import {
  UI_ACCEPTANCE_FEE,
  UI_FEE_SESSION,
  UI_FEE_SOURCES,
  UI_INSTITUTION_SLUG,
  UI_SEED_COURSES,
  courseDurationYears,
  estimatedDegreeTotal,
  expandCourseLevies,
  type UiFeeSlot,
  type UiSeedCourse,
} from "../lib/seed/university-of-ibadan-fees";
import { slugify } from "../lib/utils/format";
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
  category: "tuition" | "acceptance_fee";
  amount: number;
  is_compulsory: boolean;
  frequency: "one_time" | "recurring";
  applies_to: "fresh_only" | "all_students";
  description: string;
};

function buildLines(slot: UiFeeSlot): SeedLine[] {
  const lines: SeedLine[] = [
    {
      name: "Total Levy",
      category: "tuition",
      amount: slot.total_levy,
      is_compulsory: true,
      frequency: "recurring",
      applies_to: "all_students",
      description: slot.is_direct_entry
        ? "NELFUND summarised schedule Total Levy for Direct Entry freshers."
        : "NELFUND summarised schedule Total Levy for this level.",
    },
  ];

  if (slot.student_type === "fresh") {
    lines.unshift({
      name: "Acceptance fee",
      category: "acceptance_fee",
      amount: UI_ACCEPTANCE_FEE,
      is_compulsory: true,
      frequency: "one_time",
      applies_to: "fresh_only",
      description: "Official UI 2025/2026 admissions acceptance fee.",
    });
  }

  return lines;
}

function toCalcItems(
  lines: ReturnType<typeof buildLines>
): FeeItem[] {
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

async function main() {
  const institutions = await rest<Array<{ id: string; name: string }>>(
    `/rest/v1/institutions?slug=eq.${UI_INSTITUTION_SLUG}&select=id,name`
  );
  const institution = institutions[0];
  if (!institution) {
    throw new Error(
      `Institution ${UI_INSTITUTION_SLUG} not found. Run npm run seed:institutions first.`
    );
  }

  // Mark prior sessions non-current, upsert 2025/2026 as current.
  await rest(
    `/rest/v1/academic_sessions?institution_id=eq.${institution.id}`,
    {
      method: "PATCH",
      prefer: "return=minimal",
      body: { is_current: false },
    }
  );

  const sessions = await rest<Array<{ id: string; name: string }>>(
    `/rest/v1/academic_sessions?on_conflict=institution_id,name`,
    {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=representation",
      body: [
        {
          institution_id: institution.id,
          name: UI_FEE_SESSION,
          start_year: 2025,
          end_year: 2026,
          is_current: true,
        },
      ],
    }
  );
  const session = sessions[0];
  if (!session) throw new Error("Could not upsert academic session");

  // Replace all prior UI fee records (2024/2025 stopgap included).
  const existingFees = await rest<Array<{ id: string }>>(
    `/rest/v1/fee_records?institution_id=eq.${institution.id}&select=id`
  );
  if (existingFees.length > 0) {
    const ids = existingFees.map((row) => row.id).join(",");
    await rest(`/rest/v1/fee_records?id=in.(${ids})`, {
      method: "DELETE",
      prefer: "return=minimal",
    });
    console.log(`Removed ${existingFees.length} existing UI fee records`);
  }

  const existingCourses = await rest<Array<{ id: string }>>(
    `/rest/v1/courses?institution_id=eq.${institution.id}&select=id`
  );
  if (existingCourses.length > 0) {
    const ids = existingCourses.map((row) => row.id).join(",");
    await rest(`/rest/v1/courses?id=in.(${ids})`, {
      method: "DELETE",
      prefer: "return=minimal",
    });
    console.log(`Removed ${existingCourses.length} existing UI courses`);
  }

  const courseRows = UI_SEED_COURSES.map((course) => ({
    institution_id: institution.id,
    faculty_id: null,
    name: course.name,
    slug: slugify(course.name),
    duration_years: courseDurationYears(course),
    qualification: "Bachelors",
    is_active: true,
  }));

  const slugs = courseRows.map((row) => row.slug);
  const duplicateSlugs = slugs.filter(
    (slug, index) => slugs.indexOf(slug) !== index
  );
  if (duplicateSlugs.length > 0) {
    throw new Error(`Duplicate course slugs: ${[...new Set(duplicateSlugs)].join(", ")}`);
  }

  const courses = await rest<
    Array<{ id: string; name: string; slug: string; duration_years: number }>
  >(`/rest/v1/courses`, {
    method: "POST",
    prefer: "return=representation",
    body: courseRows,
  });
  const courseBySlug = new Map(courses.map((course) => [course.slug, course]));

  const now = new Date().toISOString();
  let recordCount = 0;

  for (const seedCourse of UI_SEED_COURSES) {
    const course = courseBySlug.get(slugify(seedCourse.name));
    if (!course) {
      throw new Error(`Course missing after insert: ${seedCourse.name}`);
    }

    const degreeTotal = estimatedDegreeTotal(seedCourse);
    const slots = expandCourseLevies(seedCourse);

    for (const slot of slots) {
      const lines = buildLines(slot);
      const calcItems = toCalcItems(lines);
      const firstYear = firstYearTotal(calcItems);
      const returningYear = returningYearTotal(calcItems);

      const feeRecords = await rest<Array<{ id: string }>>(
        `/rest/v1/fee_records`,
        {
          method: "POST",
          prefer: "return=representation",
          body: [
            {
              institution_id: institution.id,
              course_id: course.id,
              academic_session_id: session.id,
              level: slot.level,
              student_type: slot.student_type,
              currency: "NGN",
              compulsory_total: compulsoryTotal(calcItems),
              optional_total: optionalTotal(calcItems),
              accommodation_total: accommodationTotal(calcItems),
              first_year_total: firstYear,
              returning_year_total: returningYear,
              estimated_degree_total: degreeTotal,
              verification_status: "community_verified",
              confidence_level: "medium",
              // Levy amounts come from a republished NELFUND schedule, not a UI circular.
              source_type: "community_reported",
              last_reviewed_at: now,
              review_due_at: null,
              is_published: true,
              admin_note: buildAdminNote(seedCourse, slot),
            },
          ],
        }
      );

      const feeRecordId = feeRecords[0]?.id;
      if (!feeRecordId) {
        throw new Error(`No fee record for ${seedCourse.name} ${slot.level}`);
      }

      await rest(`/rest/v1/fee_items`, {
        method: "POST",
        prefer: "return=minimal",
        body: lines.map((line) => ({
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
            source_type: "public_school_notice",
            source_url: UI_FEE_SOURCES.nelfundSchedule,
            file_url: null,
            evidence_date: "2025-09-01",
            review_status: "approved",
            submitted_by_email: null,
            admin_note:
              "Summarised NELFUND 2025/2026 Total Levy schedule for University of Ibadan.",
          },
          ...(slot.student_type === "fresh"
            ? [
                {
                  fee_record_id: feeRecordId,
                  submission_id: null,
                  source_type: "official_school_webpage",
                  source_url: UI_FEE_SOURCES.acceptanceNotice,
                  file_url: null,
                  evidence_date: "2025-11-10",
                  review_status: "approved",
                  submitted_by_email: null,
                  admin_note: "Official UI acceptance fee notice (N50,000).",
                },
              ]
            : []),
        ],
      });

      recordCount += 1;
    }

    console.log(
      `  - ${seedCourse.name}: ${slots.length} level rows (faculty: ${seedCourse.faculty})`
    );
  }

  console.log(
    `\nSeeded ${recordCount} published fee records across ${UI_SEED_COURSES.length} courses for ${institution.name} (${UI_FEE_SESSION}).`
  );
}

function buildAdminNote(course: UiSeedCourse, slot: UiFeeSlot): string {
  const entry = slot.is_direct_entry
    ? "Direct Entry fresher"
    : slot.student_type === "fresh"
      ? "UTME fresher"
      : "returning / graduating";
  return `${UI_FEE_SESSION} Total Levy from the summarised NELFUND schedule (${course.faculty}, ${entry}). Acceptance fee included on fresher rows from the official UI admissions notice. Hostel not included.`;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
