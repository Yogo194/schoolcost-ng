/**
 * Point institutions.logo_url at the crest files in public/schools/logos.
 *
 *   npx --yes tsx scripts/sync-school-logos.ts --dry
 *   npx --yes tsx scripts/sync-school-logos.ts
 *
 * The filename is the institution slug, so a file only ever attaches to the
 * school it is named for. Existing logo_url values are left alone unless
 * --force is passed, and a row is only updated when a matching file exists on
 * disk. Reports orphan files (no matching school) rather than guessing.
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const LOGO_DIR = path.join(process.cwd(), "public", "schools", "logos");
const PUBLIC_PREFIX = "/schools/logos";

const isDry = process.argv.includes("--dry");
const isForce = process.argv.includes("--force");

type Institution = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
};

function requireEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return { url, key };
}

async function rest<T>(
  endpoint: string,
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  const { url, key } = requireEnv();
  const response = await fetch(`${url}${endpoint}`, {
    method: options.method ?? "GET",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  if (!response.ok) {
    throw new Error(
      `${options.method ?? "GET"} ${endpoint} -> ${response.status}: ${await response.text()}`
    );
  }
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

async function main() {
  if (!fs.existsSync(LOGO_DIR)) {
    throw new Error(`Missing logo directory: ${LOGO_DIR}`);
  }

  const files = fs
    .readdirSync(LOGO_DIR)
    .filter((file) => /\.(png|jpe?g|webp|svg)$/i.test(file));
  const bySlug = new Map(files.map((file) => [file.replace(/\.[^.]+$/, ""), file]));

  const institutions = await rest<Institution[]>(
    "/rest/v1/institutions?select=id,name,slug,logo_url&is_active=eq.true&limit=1000"
  );

  const updates: Array<{ slug: string; logo_url: string }> = [];
  let alreadySet = 0;
  let noFile = 0;

  for (const institution of institutions) {
    const file = bySlug.get(institution.slug);
    if (!file) {
      noFile += 1;
      continue;
    }
    const target = `${PUBLIC_PREFIX}/${file}`;
    if (institution.logo_url === target) {
      alreadySet += 1;
      continue;
    }
    if (institution.logo_url && !isForce) {
      alreadySet += 1;
      continue;
    }
    updates.push({ slug: institution.slug, logo_url: target });
  }

  const knownSlugs = new Set(institutions.map((row) => row.slug));
  const orphans = [...bySlug.keys()].filter((slug) => !knownSlugs.has(slug));

  console.log(`Logo files on disk      : ${files.length}`);
  console.log(`Active institutions     : ${institutions.length}`);
  console.log(`Already pointing at file: ${alreadySet}`);
  console.log(`No file for this school : ${noFile}`);
  console.log(`To update               : ${updates.length}`);
  if (orphans.length) {
    console.log(`\nOrphan files (no matching school slug): ${orphans.length}`);
    orphans.forEach((slug) => console.log(`  - ${slug}`));
  }

  if (isDry) {
    console.log("\n--dry, no writes performed.");
    updates.slice(0, 10).forEach((u) => console.log(`  would set ${u.slug} -> ${u.logo_url}`));
    if (updates.length > 10) console.log(`  ... and ${updates.length - 10} more`);
    return;
  }

  for (const update of updates) {
    await rest(`/rest/v1/institutions?slug=eq.${encodeURIComponent(update.slug)}`, {
      method: "PATCH",
      body: { logo_url: update.logo_url },
    });
  }

  console.log(`\nUpdated ${updates.length} institutions.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
