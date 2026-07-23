/**
 * Sync Pan-Atlantic University 2026/2027 tuition-only records.
 *
 * This script is deliberately scoped to PAU's 2026/2027 fee records. It does
 * not remove courses and does not alter any other institution.
 */
import {
  PAU_FEE_SESSION,
  PAU_FEE_SOURCE,
  PAU_INSTITUTION_SLUG,
  PAU_PROGRAMMES,
} from "../lib/seed/pan-atlantic-university-fees";
import { slugify } from "../lib/utils/format";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());
console.log("Starting PAU 2026/2027 fee sync...");

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
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

async function main() {
  const institutions = await rest<Array<{ id: string; name: string }>>(
    `/rest/v1/institutions?slug=eq.${PAU_INSTITUTION_SLUG}&select=id,name`
  );
  const institution = institutions[0];
  if (!institution) {
    throw new Error(
      `Institution ${PAU_INSTITUTION_SLUG} not found. Run seed:institutions first.`
    );
  }

  await rest(`/rest/v1/academic_sessions?institution_id=eq.${institution.id}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: { is_current: false },
  });

  const sessions = await rest<Array<{ id: string }>>(
    `/rest/v1/academic_sessions?on_conflict=institution_id,name`,
    {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=representation",
      body: [
        {
          institution_id: institution.id,
          name: PAU_FEE_SESSION,
          start_year: 2026,
          end_year: 2027,
          is_current: true,
        },
      ],
    }
  );
  const session = sessions[0];
  if (!session) throw new Error("Could not upsert PAU academic session");

  const existingFees = await rest<Array<{ id: string }>>(
    `/rest/v1/fee_records?institution_id=eq.${institution.id}&academic_session_id=eq.${session.id}&select=id`
  );
  if (existingFees.length) {
    await rest(
      `/rest/v1/fee_records?id=in.(${existingFees.map((fee) => fee.id).join(",")})`,
      { method: "DELETE", prefer: "return=minimal" }
    );
  }

  let recordCount = 0;
  for (const programme of PAU_PROGRAMMES) {
    const publishedYears = programme.tuitionByLevel.filter(
      (year): year is typeof year & { amount: number } => year.amount !== null
    );

    // A comparison degree total is only trustworthy when PAU published every year.
    if (publishedYears.length !== programme.durationYears) continue;

    const courseRows = await rest<Array<{ id: string }>>(
      `/rest/v1/courses?on_conflict=institution_id,slug`,
      {
        method: "POST",
        prefer: "resolution=merge-duplicates,return=representation",
        body: [
          {
            institution_id: institution.id,
            faculty_id: null,
            name: programme.name,
            slug: slugify(programme.name),
            duration_years: programme.durationYears,
            qualification: "Bachelors",
            is_active: true,
          },
        ],
      }
    );
    const course = courseRows[0];
    if (!course) throw new Error(`Could not upsert ${programme.name}`);

    const degreeTotal = publishedYears.reduce((sum, year) => sum + year.amount, 0);
    for (const year of publishedYears) {
      const records = await rest<Array<{ id: string }>>(`/rest/v1/fee_records`, {
        method: "POST",
        prefer: "return=representation",
        body: [
          {
            institution_id: institution.id,
            course_id: course.id,
            academic_session_id: session.id,
            level: year.level,
            student_type: year.level === "100L" ? "fresh" : "returning",
            currency: "NGN",
            compulsory_total: year.amount,
            optional_total: 0,
            accommodation_total: 0,
            first_year_total: year.amount,
            returning_year_total: year.amount,
            estimated_degree_total: degreeTotal,
            verification_status: "officially_verified",
            confidence_level: "high",
            source_type: "official_school_source",
            last_reviewed_at: new Date().toISOString(),
            review_due_at: null,
            is_published: true,
            admin_note: `${PAU_FEE_SESSION} official tuition schedule. Tuition only; acceptance and accommodation are not included because the current official schedule does not state them.`,
          },
        ],
      });
      const record = records[0];
      if (!record) throw new Error(`Could not add ${programme.name} ${year.level}`);

      await rest(`/rest/v1/fee_items`, {
        method: "POST",
        prefer: "return=minimal",
        body: [
          {
            fee_record_id: record.id,
            name: "Published tuition",
            original_label: "Tuition fee",
            category: "tuition",
            amount: year.amount,
            is_compulsory: true,
            frequency: "recurring",
            applies_to: "all_students",
            description: `Official ${year.level} tuition for ${PAU_FEE_SESSION}.`,
          },
        ],
      });

      await rest(`/rest/v1/evidence`, {
        method: "POST",
        prefer: "return=minimal",
        body: [
          {
            fee_record_id: record.id,
            submission_id: null,
            source_type: "official_school_webpage",
            source_url: PAU_FEE_SOURCE,
            file_url: null,
            evidence_date: "2026-07-22",
            review_status: "approved",
            submitted_by_email: null,
            admin_note:
              "Official PAU undergraduate fees page. Published figures are indicated as subject to annual review and change.",
          },
        ],
      });
      recordCount += 1;
    }
  }

  console.log(
    `Seeded ${recordCount} high-confidence PAU tuition rows for ${institution.name} (${PAU_FEE_SESSION}).`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
