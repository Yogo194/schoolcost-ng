/**
 * Upsert the first live institution batch into Supabase.
 *
 * Usage:
 *   npm run seed:institutions
 *   npx tsx scripts/seed-institutions.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 * Uses PostgREST directly so it works on Node 20 without a WebSocket polyfill.
 */
import { SEED_INSTITUTIONS } from "../lib/seed/institutions";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  const rows = SEED_INSTITUTIONS.map((school) => ({
    name: school.name,
    slug: school.slug,
    abbreviation: school.abbreviation,
    logo_url: school.logo_url,
    institution_type: school.institution_type,
    ownership_type: school.ownership_type,
    state: school.state,
    city: school.city,
    website_url: school.website_url,
    description: null,
    is_active: true,
  }));

  const endpoint = `${url}/rest/v1/institutions?on_conflict=slug`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(rows),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Seed failed (${response.status}): ${body}`);
  }

  const data = (await response.json()) as Array<{
    id: string;
    slug: string;
    name: string;
  }>;

  console.log(`Seeded ${data.length} institutions:`);
  for (const row of data) {
    console.log(`  - ${row.name} (${row.slug})`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
