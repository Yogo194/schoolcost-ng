/**
 * Seed Augustine University from the 2026/2027 official fee PDF,
 * and re-seed Elizade with the completed faculty mapping from feeStructure.pdf.
 *
 * Usage: npx --yes tsx scripts/seed-augustine-elizade-pdfs.ts
 */
import { loadEnvConfig } from "@next/env";
import {
  AUGUSTINE_LOCAL_PDF,
  AUGUSTINE_PROGRAMMES,
  AUGUSTINE_SESSION,
  AUGUSTINE_SLUG,
  AUGUSTINE_SOURCE_URL,
} from "../lib/seed/augustine-university-fees";
import { WEBSITE_FEE_BATCH1 } from "../lib/seed/website-fees-batch1";
import { slugify } from "../lib/utils/format";

loadEnvConfig(process.cwd());

function requireEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
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
      Prefer: options.prefer ?? "return=representation",
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

async function replaceSessionFees(
  institutionId: string,
  sessionName: string,
  startYear: number,
  endYear: number
) {
  await rest(`/rest/v1/academic_sessions?institution_id=eq.${institutionId}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: { is_current: false },
  });

  const session = (
    await rest<Array<{ id: string }>>(
      "/rest/v1/academic_sessions?on_conflict=institution_id,name",
      {
        method: "POST",
        prefer: "resolution=merge-duplicates,return=representation",
        body: [
          {
            institution_id: institutionId,
            name: sessionName,
            start_year: startYear,
            end_year: endYear,
            is_current: true,
          },
        ],
      }
    )
  )[0];
  if (!session) throw new Error(`Could not upsert session ${sessionName}`);

  const published = await rest<Array<{ id: string }>>(
    `/rest/v1/fee_records?institution_id=eq.${institutionId}&is_published=eq.true&select=id`
  );
  for (const row of published) {
    await rest(`/rest/v1/fee_records?id=eq.${row.id}`, {
      method: "PATCH",
      body: { is_published: false },
    });
  }

  const prior = await rest<Array<{ id: string }>>(
    `/rest/v1/fee_records?institution_id=eq.${institutionId}&academic_session_id=eq.${session.id}&select=id`
  );
  for (const row of prior) {
    await rest(`/rest/v1/evidence?fee_record_id=eq.${row.id}`, {
      method: "DELETE",
      prefer: "return=minimal",
    });
    await rest(`/rest/v1/fee_items?fee_record_id=eq.${row.id}`, {
      method: "DELETE",
      prefer: "return=minimal",
    });
    await rest(`/rest/v1/fee_records?id=eq.${row.id}`, {
      method: "DELETE",
      prefer: "return=minimal",
    });
  }

  return session;
}

async function seedAugustine() {
  const institution = (
    await rest<Array<{ id: string; name: string }>>(
      `/rest/v1/institutions?slug=eq.${AUGUSTINE_SLUG}&select=id,name`
    )
  )[0];
  if (!institution) throw new Error("Augustine University missing");

  const session = await replaceSessionFees(
    institution.id,
    AUGUSTINE_SESSION,
    2026,
    2027
  );

  let created = 0;
  for (const programme of AUGUSTINE_PROGRAMMES) {
    const course = (
      await rest<Array<{ id: string }>>("/rest/v1/courses?on_conflict=institution_id,slug", {
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
      })
    )[0];
    if (!course) throw new Error(`Could not upsert ${programme.name}`);

    const firstYear = programme.years.find((year) => year.studentType === "fresh")?.amount ?? 0;
    const returningYear =
      programme.years.find((year) => year.level === "200L")?.amount ?? firstYear;
    const degreeTotal = programme.years.reduce((sum, year) => sum + year.amount, 0);

    for (const year of programme.years) {
      const record = (
        await rest<Array<{ id: string }>>("/rest/v1/fee_records", {
          method: "POST",
          prefer: "return=representation",
          body: [
            {
              institution_id: institution.id,
              course_id: course.id,
              academic_session_id: session.id,
              level: year.level,
              student_type: year.studentType,
              currency: "NGN",
              compulsory_total: year.amount,
              optional_total: 0,
              accommodation_total: 0,
              first_year_total: firstYear,
              returning_year_total: returningYear,
              estimated_degree_total: degreeTotal,
              verification_status: "reported",
              confidence_level: "medium",
              source_type: "official_school_source",
              last_reviewed_at: new Date().toISOString(),
              review_due_at: null,
              is_published: true,
              admin_note: `${AUGUSTINE_SESSION} Augustine University fee schedule PDF. Totals exclude furnished accommodation (old hostel ₦350,000 / new hostel ₦650,000). Acceptance ₦100,500 for new students not included. Source: ${AUGUSTINE_SOURCE_URL}. Local copy: ${AUGUSTINE_LOCAL_PDF}.`,
            },
          ],
        })
      )[0];
      if (!record) throw new Error(`Could not insert ${programme.name} ${year.level}`);

      await rest("/rest/v1/fee_items", {
        method: "POST",
        prefer: "return=minimal",
        body: [
          {
            fee_record_id: record.id,
            name: "Published compulsory total",
            original_label: "TOTAL",
            category: "tuition",
            amount: year.amount,
            is_compulsory: true,
            frequency: "recurring",
            applies_to: "all_students",
            description: `${year.level} total from Augustine ${AUGUSTINE_SESSION} PDF (accommodation excluded).`,
          },
        ],
      });

      await rest("/rest/v1/evidence", {
        method: "POST",
        prefer: "return=minimal",
        body: [
          {
            fee_record_id: record.id,
            submission_id: null,
            source_type: "public_school_notice",
            source_url: AUGUSTINE_SOURCE_URL,
            file_url: AUGUSTINE_LOCAL_PDF,
            evidence_date: "2026-07-30",
            review_status: "approved",
            submitted_by_email: null,
            admin_note: "Official 2026/2027 fee schedule PDF signed by Registrar.",
          },
        ],
      });

      created += 1;
    }
  }

  console.log(`${institution.name}: published ${created} year-level fee rows`);
  return created;
}

async function reseedElizade() {
  const school = WEBSITE_FEE_BATCH1.find((row) => row.slug === "elizade-university");
  if (!school) throw new Error("Elizade missing from batch1 data");

  const institution = (
    await rest<Array<{ id: string; name: string }>>(
      `/rest/v1/institutions?slug=eq.${school.slug}&select=id,name`
    )
  )[0];
  if (!institution) throw new Error("Elizade University missing");

  const session = await replaceSessionFees(
    institution.id,
    school.session,
    school.startYear,
    school.endYear
  );

  let created = 0;
  for (const fee of school.fees) {
    const durationYears = fee.durationYears ?? 4;
    const course = (
      await rest<Array<{ id: string }>>("/rest/v1/courses?on_conflict=institution_id,slug", {
        method: "POST",
        prefer: "resolution=merge-duplicates,return=representation",
        body: [
          {
            institution_id: institution.id,
            faculty_id: null,
            name: fee.name,
            slug: slugify(fee.name),
            duration_years: durationYears,
            qualification: "Bachelors",
            is_active: true,
          },
        ],
      })
    )[0];
    if (!course) throw new Error(`Could not upsert ${fee.name}`);

    const variants = [
      { amount: fee.amount, studentType: "fresh" as const, level: "100L / fresh" },
      ...(fee.returningAmount != null
        ? [
            {
              amount: fee.returningAmount,
              studentType: "returning" as const,
              level: "200L-500L / returning",
            },
          ]
        : []),
    ];

    for (const variant of variants) {
      const record = (
        await rest<Array<{ id: string }>>("/rest/v1/fee_records", {
          method: "POST",
          prefer: "return=representation",
          body: [
            {
              institution_id: institution.id,
              course_id: course.id,
              academic_session_id: session.id,
              level: variant.level,
              student_type: variant.studentType,
              currency: "NGN",
              compulsory_total: variant.amount,
              optional_total: 0,
              accommodation_total: 0,
              first_year_total: fee.amount,
              returning_year_total: fee.returningAmount ?? fee.amount,
              estimated_degree_total: 0,
              verification_status: "reported",
              confidence_level: "medium",
              source_type: "official_school_source",
              last_reviewed_at: new Date().toISOString(),
              review_due_at: null,
              is_published: true,
              admin_note: `${school.adminNote} Local copy: /evidence/fees/elizade-2026-2027-fee-structure.pdf`,
            },
          ],
        })
      )[0];
      if (!record) throw new Error(`Could not insert ${fee.name}`);

      await rest("/rest/v1/fee_items", {
        method: "POST",
        prefer: "return=minimal",
        body: [
          {
            fee_record_id: record.id,
            name: "Published school fee total",
            original_label: "Academic fees",
            category: "tuition",
            amount: variant.amount,
            is_compulsory: true,
            frequency: "recurring",
            applies_to: "all_students",
            description: `${school.session} ${variant.studentType} total from Elizade PDF.`,
          },
        ],
      });

      await rest("/rest/v1/evidence", {
        method: "POST",
        prefer: "return=minimal",
        body: [
          {
            fee_record_id: record.id,
            submission_id: null,
            source_type: "public_school_notice",
            source_url: school.sourceUrl,
            file_url: "/evidence/fees/elizade-2026-2027-fee-structure.pdf",
            evidence_date: school.evidenceDate,
            review_status: "approved",
            submitted_by_email: null,
            admin_note: "Official Elizade 2026/2027 fee structure PDF.",
          },
        ],
      });

      created += 1;
    }
  }

  console.log(`${institution.name}: republished ${created} fee rows`);
  return created;
}

async function main() {
  const augustine = await seedAugustine();
  const elizade = await reseedElizade();
  console.log(`\nDone. Augustine ${augustine} rows, Elizade ${elizade} rows.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
