/**
 * Unpublish the second Figma planning-list placeholder pairs
 * (₦20,000 / ₦55,000 low-confidence community estimates).
 *
 * Schools stay active. Profiles with no remaining published fees
 * show the contribute empty state.
 *
 * Usage: npx --yes tsx scripts/unpublish-figma-estimate-pairs.ts
 */
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const FIGMA_AMOUNTS = new Set([20_000, 55_000]);
const ADMIN_NOTE_MARKERS = [
  "second Figma planning list",
  "Figma planning list",
  "Figma reported estimate",
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
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  const { url, key } = requireEnv();
  const response = await fetch(`${url}${path}`, {
    method: options.method ?? "GET",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
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

type FeeRow = {
  id: string;
  institution_id: string;
  level: string | null;
  admin_note: string | null;
  confidence_level: string | null;
  source_type: string | null;
  compulsory_total: number | null;
  institutions: { name: string; abbreviation: string | null; slug: string } | null;
};

function isFigmaEstimatePair(row: FeeRow): boolean {
  const amount = Number(row.compulsory_total);
  const note = row.admin_note ?? "";
  const noteHit = ADMIN_NOTE_MARKERS.some((marker) => note.includes(marker));
  const amountHit = FIGMA_AMOUNTS.has(amount);
  const lowCommunity =
    row.confidence_level === "low" &&
    row.source_type === "community_reported";

  return lowCommunity && (noteHit || amountHit);
}

async function fetchPublishedTargets(): Promise<FeeRow[]> {
  const matches: FeeRow[] = [];
  const pageSize = 1000;
  for (let offset = 0; ; offset += pageSize) {
    const batch = await rest<FeeRow[]>(
      `/rest/v1/fee_records?is_published=eq.true&select=id,institution_id,level,admin_note,confidence_level,source_type,compulsory_total,institutions(name,abbreviation,slug)&order=id.asc&limit=${pageSize}&offset=${offset}`
    );
    if (!batch?.length) break;
    for (const row of batch) {
      if (isFigmaEstimatePair(row)) matches.push(row);
    }
    if (batch.length < pageSize) break;
  }
  return matches;
}

async function main() {
  const targets = await fetchPublishedTargets();
  if (targets.length === 0) {
    console.log("No Figma estimate-pair fees are published. Nothing to do.");
    return;
  }

  const bySchool = new Map<string, number>();
  for (const row of targets) {
    const name = row.institutions?.name ?? row.institution_id;
    bySchool.set(name, (bySchool.get(name) ?? 0) + 1);
  }

  console.log(`Unpublishing ${targets.length} Figma estimate-pair rows across ${bySchool.size} schools:\n`);
  for (const [name, count] of [...bySchool.entries()].sort(([a], [b]) =>
    a.localeCompare(b)
  )) {
    console.log(`  ${name}: ${count}`);
  }

  let updated = 0;
  for (const row of targets) {
    const rows = await rest<Array<{ id: string; is_published: boolean }>>(
      `/rest/v1/fee_records?id=eq.${row.id}`,
      {
        method: "PATCH",
        body: { is_published: false },
      }
    );
    if (rows?.[0]?.is_published === false) updated += 1;
    else console.warn(`  Failed to unpublish ${row.id}`);
  }

  const remaining = await fetchPublishedTargets();

  // Summarize what remains published
  const keep = new Map<string, number>();
  for (let offset = 0; ; offset += 1000) {
    const batch = await rest<
      Array<{ institutions: { name: string } | null }>
    >(
      `/rest/v1/fee_records?is_published=eq.true&select=institutions(name)&order=id&limit=1000&offset=${offset}`
    );
    if (!batch?.length) break;
    for (const row of batch) {
      const name = row.institutions?.name ?? "unknown";
      keep.set(name, (keep.get(name) ?? 0) + 1);
    }
    if (batch.length < 1000) break;
  }

  console.log(`\nDone. Unpublished ${updated} records.`);
  console.log(`Remaining Figma estimate pairs published: ${remaining.length}`);
  console.log(`Schools still showing published fees: ${keep.size}`);
  for (const [name, count] of [...keep.entries()].sort(([a], [b]) =>
    a.localeCompare(b)
  )) {
    console.log(`  KEEP ${name}: ${count}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
