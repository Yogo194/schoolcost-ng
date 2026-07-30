/**
 * Align published fee trust metadata with what each source actually supports.
 *
 *   npx --yes tsx scripts/fix-fee-trust.ts
 *
 * 1. Approves curated seed evidence so the public "view source" link renders.
 *    Public RLS only exposes approved evidence, and the website/PDF seeds wrote
 *    every row as pending, which hid the source link on 26 schools. Only rows
 *    we seeded ourselves are touched (no submission_id, no submitter email).
 * 2. Marks records as outdated when the newest schedule we hold is older than
 *    the current session, so they stop reading as current fees.
 */
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

/** Schools whose only published schedule predates 2025/2026. */
const STALE_SESSION_SLUGS = [
  "plateau-state-university-bokkos",
  "bingham-university",
  "university-of-lagos",
  "obafemi-awolowo-university",
];

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

async function approveSeedEvidence() {
  const pendingFilter =
    "/rest/v1/evidence?review_status=eq.pending&submission_id=is.null" +
    "&submitted_by_email=is.null&fee_record_id=not.is.null&select=id";

  let approved = 0;

  // PostgREST caps each select, so drain in passes until nothing is left.
  for (let pass = 1; ; pass += 1) {
    const rows = await rest<Array<{ id: string }>>(`${pendingFilter}&limit=500`);
    if (rows.length === 0) break;

    const chunkSize = 100;
    for (let index = 0; index < rows.length; index += chunkSize) {
      const ids = rows
        .slice(index, index + chunkSize)
        .map((row) => row.id)
        .join(",");
      await rest(`/rest/v1/evidence?id=in.(${ids})`, {
        method: "PATCH",
        prefer: "return=minimal",
        body: { review_status: "approved" },
      });
    }

    approved += rows.length;
    console.log(`  pass ${pass}: approved ${rows.length} (running total ${approved})`);
  }

  console.log(`Approved ${approved} curated seed evidence rows.`);
}

async function markStaleSessionsOutdated() {
  for (const slug of STALE_SESSION_SLUGS) {
    const institution = (
      await rest<Array<{ id: string; name: string }>>(
        `/rest/v1/institutions?slug=eq.${encodeURIComponent(slug)}&select=id,name`
      )
    )[0];
    if (!institution) {
      console.log(`  skip ${slug}: not in directory`);
      continue;
    }

    const updated = await rest<Array<{ id: string }>>(
      `/rest/v1/fee_records?institution_id=eq.${institution.id}` +
        `&is_published=eq.true&verification_status=neq.outdated&select=id`,
      {
        method: "PATCH",
        prefer: "return=representation",
        body: { verification_status: "outdated" },
      }
    );

    console.log(`  ${institution.name}: ${updated.length} rows marked outdated`);
  }
}

/**
 * UI levy rows were labelled as an official circular, but the schedule behind
 * them is a republished NELFUND summary on a third-party host.
 */
async function relabelIbadanSource() {
  const institution = (
    await rest<Array<{ id: string; name: string }>>(
      "/rest/v1/institutions?slug=eq.university-of-ibadan&select=id,name"
    )
  )[0];
  if (!institution) {
    console.log("  skip: University of Ibadan not in directory");
    return;
  }

  const updated = await rest<Array<{ id: string }>>(
    `/rest/v1/fee_records?institution_id=eq.${institution.id}` +
      `&is_published=eq.true&source_type=eq.official_fee_circular&select=id`,
    {
      method: "PATCH",
      prefer: "return=representation",
      body: { source_type: "community_reported" },
    }
  );

  console.log(`  ${institution.name}: ${updated.length} rows relabelled`);
}

async function main() {
  await approveSeedEvidence();
  console.log("\nMarking stale schedules as outdated:");
  await markStaleSessionsOutdated();
  console.log("\nRelabelling republished sources:");
  await relabelIbadanSource();
  console.log("\nDone.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
