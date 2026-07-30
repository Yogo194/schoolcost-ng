/**
 * Seed Cursor batch 3 website/PDF fee schedules.
 * Usage: npx --yes tsx scripts/seed-website-fees-batch3.ts
 */
import { loadEnvConfig } from "@next/env";
import { WEBSITE_FEE_BATCH3 } from "../lib/seed/website-fees-batch3";
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

async function seedSchool(school: (typeof WEBSITE_FEE_BATCH3)[number]) {
  const institution = (
    await rest<Array<{ id: string; name: string }>>(
      `/rest/v1/institutions?slug=eq.${encodeURIComponent(school.slug)}&select=id,name`
    )
  )[0];
  if (!institution) throw new Error(`Missing institution ${school.slug}`);

  const published = await rest<Array<{ id: string }>>(
    `/rest/v1/fee_records?institution_id=eq.${institution.id}&is_published=eq.true&select=id`
  );
  for (const row of published) {
    await rest(`/rest/v1/fee_records?id=eq.${row.id}`, {
      method: "PATCH",
      body: { is_published: false },
    });
  }

  await rest(`/rest/v1/academic_sessions?institution_id=eq.${institution.id}`, {
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
            institution_id: institution.id,
            name: school.session,
            start_year: school.startYear,
            end_year: school.endYear,
            is_current: true,
          },
        ],
      }
    )
  )[0];
  if (!session) throw new Error(`Could not upsert session for ${school.slug}`);

  const prior = await rest<Array<{ id: string }>>(
    `/rest/v1/fee_records?institution_id=eq.${institution.id}&academic_session_id=eq.${session.id}&select=id`
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
    if (!course) throw new Error(`Could not upsert course ${fee.name}`);

    const variants = [
      {
        amount: fee.amount,
        studentType: "fresh" as const,
        level: fee.level ?? "100L / fresh",
      },
      ...(fee.returningAmount != null
        ? [
            {
              amount: fee.returningAmount,
              studentType: "returning" as const,
              level: "Returning",
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
              admin_note: [school.adminNote, fee.note ?? null, `Source: ${school.sourceUrl}`]
                .filter(Boolean)
                .join(" "),
            },
          ],
        })
      )[0];
      if (!record) throw new Error(`Could not insert fee for ${fee.name}`);

      await rest("/rest/v1/fee_items", {
        method: "POST",
        prefer: "return=minimal",
        body: [
          {
            fee_record_id: record.id,
            name: "Published school fee total",
            original_label: "School fees",
            category: "tuition",
            amount: variant.amount,
            is_compulsory: true,
            frequency: "recurring",
            applies_to: "all_students",
            description: `${school.session} ${variant.studentType} total from school website/PDF.`,
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
            file_url: null,
            evidence_date: school.evidenceDate,
            review_status: "approved",
            submitted_by_email: null,
            admin_note: "Website/PDF scrape pending bursary confirmation.",
          },
        ],
      });

      created += 1;
    }
  }

  console.log(
    `${institution.name}: published ${created} fee rows from ${school.fees.length} programmes (${school.session})`
  );
  return created;
}

async function main() {
  let total = 0;
  for (const school of WEBSITE_FEE_BATCH3) {
    total += await seedSchool(school);
  }
  console.log(`\nDone. Published ${total} rows across ${WEBSITE_FEE_BATCH3.length} schools.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
