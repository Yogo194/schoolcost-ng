import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 1000;

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/schools", changeFrequency: "daily", priority: 0.9 },
  { path: "/compare", changeFrequency: "weekly", priority: 0.8 },
  { path: "/how-it-works", changeFrequency: "monthly", priority: 0.6 },
  { path: "/submit-fees", changeFrequency: "monthly", priority: 0.5 },
  { path: "/suggest-school", changeFrequency: "monthly", priority: 0.4 },
  { path: "/submit-correction", changeFrequency: "monthly", priority: 0.4 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
  { path: "/disclaimer", changeFrequency: "yearly", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${site}${route.path === "/" ? "" : route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const [schools, fees] = await Promise.all([
    fetchActiveSchools(),
    fetchPublishedFees(),
  ]);

  const schoolEntries: MetadataRoute.Sitemap = schools.map((school) => ({
    url: `${site}/schools/${school.slug}`,
    lastModified: school.updated_at ? new Date(school.updated_at) : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const feeEntries: MetadataRoute.Sitemap = fees.map((fee) => ({
    url: `${site}/schools/${fee.slug}/fees/${fee.id}`,
    lastModified: fee.updated_at ? new Date(fee.updated_at) : now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticEntries, ...schoolEntries, ...feeEntries];
}

async function fetchActiveSchools(): Promise<
  Array<{ slug: string; updated_at: string | null }>
> {
  const rows = await supabaseRestPage<
    Array<{ slug: string; updated_at: string | null }>
  >("institutions?select=slug,updated_at&is_active=eq.true&order=name");
  return rows;
}

async function fetchPublishedFees(): Promise<
  Array<{ id: string; slug: string; updated_at: string | null }>
> {
  const rows = await supabaseRestPage<
    Array<{
      id: string;
      updated_at: string | null;
      institutions: { slug: string } | { slug: string }[] | null;
    }>
  >("fee_records?select=id,updated_at,institutions(slug)&is_published=eq.true&order=id");

  return rows.flatMap((row) => {
    const institution = Array.isArray(row.institutions)
      ? row.institutions[0]
      : row.institutions;
    if (!institution?.slug) return [];
    return [
      {
        id: row.id,
        slug: institution.slug,
        updated_at: row.updated_at,
      },
    ];
  });
}

async function supabaseRestPage<T extends unknown[]>(path: string): Promise<T> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!base || !key) return [] as unknown as T;

  const all: unknown[] = [];
  let from = 0;

  try {
    while (true) {
      const to = from + PAGE_SIZE - 1;
      const response = await fetch(`${base}/rest/v1/${path}`, {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          Accept: "application/json",
          Range: `${from}-${to}`,
          Prefer: "count=exact",
        },
        cache: "no-store",
      });

      if (!response.ok) break;

      const page = (await response.json()) as unknown[];
      all.push(...page);

      if (page.length < PAGE_SIZE) break;
      from += PAGE_SIZE;

      // Safety cap: never loop forever if Range is ignored.
      if (from > 50_000) break;
    }
  } catch {
    return all as T;
  }

  return all as T;
}
