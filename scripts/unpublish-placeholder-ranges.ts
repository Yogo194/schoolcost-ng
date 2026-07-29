/**
 * Unpublish the Figma planning-list placeholder fee ranges.
 * Schools stay active in the directory; profiles fall back to the
 * "No verified fee schedule yet" + contribute empty state.
 *
 * Usage: npx --yes tsx scripts/unpublish-placeholder-ranges.ts
 */
import { loadEnvConfig } from "@next/env";

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
  options: {
    method?: string;
    body?: unknown;
    prefer?: string;
    range?: string;
  } = {}
): Promise<T> {
  const { url, key } = requireEnv();
  const response = await fetch(`${url}${path}`, {
    method: options.method ?? "GET",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: options.prefer ?? "return=representation",
      ...(options.range ? { Range: options.range } : {}),
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

function isPlaceholder(row: {
  level: string | null;
  admin_note: string | null;
}): boolean {
  const level = row.level ?? "";
  const note = row.admin_note ?? "";
  return (
    level === "Reported lower estimate" ||
    level === "Reported upper estimate" ||
    note.includes("Figma planning list")
  );
}

type FeeRow = {
  id: string;
  institution_id: string;
  is_published: boolean;
  level: string | null;
  admin_note: string | null;
  institutions: { name: string; slug: string } | null;
};

async function fetchAllPublishedPlaceholders(): Promise<FeeRow[]> {
  const matches: FeeRow[] = [];
  const pageSize = 1000;
  for (let offset = 0; ; offset += pageSize) {
    const batch = await rest<FeeRow[]>(
      `/rest/v1/fee_records?is_published=eq.true&select=id,institution_id,is_published,level,admin_note,institutions(name,slug)&order=id.asc&limit=${pageSize}&offset=${offset}`
    );
    if (!batch?.length) break;
    for (const row of batch) {
      if (isPlaceholder(row)) matches.push(row);
    }
    if (batch.length < pageSize) break;
  }
  return matches;
}

async function main() {
  const targets = await fetchAllPublishedPlaceholders();
  if (targets.length === 0) {
    console.log("No placeholder range fees are published. Nothing to do.");
    return;
  }

  const bySchool = new Map<string, number>();
  for (const row of targets) {
    const name = row.institutions?.name ?? row.institution_id;
    bySchool.set(name, (bySchool.get(name) ?? 0) + 1);
  }

  console.log(`Unpublishing ${targets.length} placeholder fee rows:\n`);
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
    else {
      console.warn(`  Failed to unpublish ${row.id} (${row.institutions?.name})`);
    }
  }

  const remaining = await fetchAllPublishedPlaceholders();
  console.log(`\nDone. Unpublished ${updated} records.`);
  console.log(`Remaining published placeholders: ${remaining.length}`);
  console.log(
    "Schools stay in the directory. Profiles with no remaining published fees show the contribute empty state."
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
