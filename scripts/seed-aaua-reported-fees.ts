import { loadEnvConfig } from "@next/env";
import {
  AAUA_REPORTED_FEES,
  AAUA_SESSION,
  AAUA_SLUG,
  AAUA_SOURCE,
} from "../lib/seed/aaua-reported-fees";
import { slugify } from "../lib/utils/format";

loadEnvConfig(process.cwd());

function env() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase environment variables");
  return { url, key };
}

async function rest<T>(path: string, init: { method?: string; body?: unknown; prefer?: string } = {}) {
  const { url, key } = env();
  const response = await fetch(`${url}${path}`, {
    method: init.method ?? "GET",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.prefer ? { Prefer: init.prefer } : {}),
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  if (!response.ok) throw new Error(`${response.status}: ${await response.text()}`);
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

async function main() {
  const institution = (await rest<Array<{ id: string }>>(
    `/rest/v1/institutions?slug=eq.${AAUA_SLUG}&select=id`
  ))[0];
  if (!institution) throw new Error("AAUA institution is missing");

  await rest(`/rest/v1/academic_sessions?institution_id=eq.${institution.id}`, {
    method: "PATCH", prefer: "return=minimal", body: { is_current: false },
  });
  const session = (await rest<Array<{ id: string }>>(
    "/rest/v1/academic_sessions?on_conflict=institution_id,name",
    { method: "POST", prefer: "resolution=merge-duplicates,return=representation", body: [{ institution_id: institution.id, name: AAUA_SESSION, start_year: 2026, end_year: 2027, is_current: true }] }
  ))[0];
  if (!session) throw new Error("Could not create AAUA session");

  const prior = await rest<Array<{ id: string }>>(
    `/rest/v1/fee_records?institution_id=eq.${institution.id}&academic_session_id=eq.${session.id}&select=id`
  );
  if (prior.length) await rest(`/rest/v1/fee_records?id=in.(${prior.map((row) => row.id).join(",")})`, { method: "DELETE", prefer: "return=minimal" });

  for (const fee of AAUA_REPORTED_FEES) {
    const course = (await rest<Array<{ id: string }>>(
      "/rest/v1/courses?on_conflict=institution_id,slug",
      { method: "POST", prefer: "resolution=merge-duplicates,return=representation", body: [{ institution_id: institution.id, faculty_id: null, name: fee.name, slug: slugify(fee.name), duration_years: 4, qualification: "Bachelors", is_active: true }] }
    ))[0];
    if (!course) throw new Error(`Could not add ${fee.name}`);
    const record = (await rest<Array<{ id: string }>>("/rest/v1/fee_records", {
      method: "POST", prefer: "return=representation",
      body: [{ institution_id: institution.id, course_id: course.id, academic_session_id: session.id, level: "Undergraduate", student_type: "fresh", currency: "NGN", compulsory_total: fee.amount, optional_total: 0, accommodation_total: 0, first_year_total: fee.amount, returning_year_total: fee.amount, estimated_degree_total: 0, verification_status: "reported", confidence_level: "low", source_type: "community_reported", last_reviewed_at: new Date().toISOString(), review_due_at: null, is_published: true, admin_note: `Community-reported ${AAUA_SESSION} annual figure from a secondary source. It does not distinguish fresh from returning students or itemise charges. Confirm on the AAUA portal before paying.` }],
    }))[0];
    if (!record) throw new Error(`Could not add fee for ${fee.name}`);
    await rest("/rest/v1/fee_items", { method: "POST", prefer: "return=minimal", body: [{ fee_record_id: record.id, name: "Reported annual school fee", original_label: "School fee", category: "tuition", amount: fee.amount, is_compulsory: true, frequency: "recurring", applies_to: "all_students", description: "Community-reported annual amount. Fresh/returning scope and line-item split not published." }] });
    await rest("/rest/v1/evidence", { method: "POST", prefer: "return=minimal", body: [{ fee_record_id: record.id, submission_id: null, source_type: "public_school_notice", source_url: AAUA_SOURCE, file_url: null, evidence_date: "2026-07-05", review_status: "pending", submitted_by_email: null, admin_note: "Secondary source only. Awaiting official AAUA or student portal evidence." }] });
  }
  console.log(`Seeded ${AAUA_REPORTED_FEES.length} community-reported AAUA annual figures.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
