import { createServerClient } from "@/lib/supabase/server";
import { OWNERSHIP_TYPE_LABELS } from "@/types/institution";
import { NIGERIA_STATES } from "@/types/institution";
import type { OwnershipType } from "@/types/database";
import { getMockSearchSuggestions } from "@/lib/search/mock-index";
import {
  createSchoolSearchIndex,
  normalizeSearchText,
  type SchoolSearchIndex,
} from "@/lib/search/school-search";
import type { SearchSuggestion } from "@/lib/search/types";
import { SEARCH_SUGGESTION_LIMIT } from "@/lib/search/types";

interface InstitutionSuggestionRow {
  name: string;
  slug: string;
  abbreviation: string | null;
  city: string | null;
  state: string;
  ownership_type: OwnershipType;
}

interface CourseSuggestionRow {
  name: string;
  institutions: { name: string; slug: string } | null;
}

function schoolMeta(row: {
  abbreviation: string | null;
  city: string | null;
  state: string;
  ownership_type: OwnershipType;
}): string {
  return [
    row.abbreviation,
    row.city,
    OWNERSHIP_TYPE_LABELS[row.ownership_type],
  ]
    .filter(Boolean)
    .join(" · ");
}

function mergeSuggestions(
  primary: SearchSuggestion[],
  fallback: SearchSuggestion[],
  limit: number
): SearchSuggestion[] {
  const seen = new Set<string>();
  const merged: SearchSuggestion[] = [];

  for (const item of [...primary, ...fallback]) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    merged.push(item);
    if (merged.length >= limit) break;
  }

  return merged;
}

/*
 * Institutions are a small, slow-changing dataset (all Nigerian institutions
 * fit in a few hundred rows), so instead of running a per-keystroke ILIKE
 * query, we load the whole active list once per server instance, build a
 * ranked typo-tolerant index over it, and refresh it in the background every
 * few minutes. Every suggestion request is then answered from memory.
 */
const INSTITUTIONS_CACHE_TTL_MS = 5 * 60 * 1000;

let institutionsIndex: SchoolSearchIndex<InstitutionSuggestionRow> | null =
  null;
let institutionsFetchedAt = 0;
let institutionsRefresh: Promise<void> | null = null;

async function refreshInstitutionsIndex(): Promise<void> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("institutions")
    .select("name, slug, abbreviation, city, state, ownership_type")
    .eq("is_active", true);

  if (error) throw error;
  const rows = (data ?? []) as InstitutionSuggestionRow[];
  if (rows.length === 0) {
    // Leave any previous index in place; an empty table means Supabase is
    // not seeded yet and the mock fallback will carry the results.
    institutionsFetchedAt = Date.now();
    return;
  }
  institutionsIndex = createSchoolSearchIndex(rows);
  institutionsFetchedAt = Date.now();
}

async function getInstitutionsIndex(): Promise<SchoolSearchIndex<InstitutionSuggestionRow> | null> {
  const stale = Date.now() - institutionsFetchedAt > INSTITUTIONS_CACHE_TTL_MS;

  if (institutionsIndex && !stale) return institutionsIndex;

  if (!institutionsRefresh) {
    institutionsRefresh = refreshInstitutionsIndex().finally(() => {
      institutionsRefresh = null;
    });
  }

  if (!institutionsIndex) {
    // Cold start: nothing to serve yet, wait for the first load.
    await institutionsRefresh;
  } else {
    // Stale-while-revalidate: serve the old index, refresh in background.
    institutionsRefresh.catch(() => {});
  }

  return institutionsIndex;
}

const stateIndex = createSchoolSearchIndex(
  NIGERIA_STATES.map((state) => ({ name: state }))
);

async function getCourseSuggestions(
  query: string
): Promise<SearchSuggestion[]> {
  // Courses can grow much larger than institutions, so they stay in the
  // database: ILIKE narrows candidates, the shared engine ranks them.
  const tokens = normalizeSearchText(query).split(" ").filter(Boolean);
  if (tokens.length === 0) return [];

  const supabase = await createServerClient();
  const { data } = await supabase
    .from("courses")
    .select("name, institutions ( name, slug )")
    .eq("is_active", true)
    .ilike("name", `%${tokens[0]}%`)
    .limit(30);

  const rows = ((data ?? []) as CourseSuggestionRow[]).filter(
    (row) => row.institutions
  );
  if (rows.length === 0) return [];

  const index = createSchoolSearchIndex(
    rows.map((row) => ({
      name: row.name,
      aliases: [row.institutions!.name],
      row,
    }))
  );

  return index
    .searchScored(query)
    .filter(({ score }) => score > 0)
    .slice(0, 5)
    .map(({ item }) => {
      const institution = item.row.institutions!;
      return {
        id: `course-${institution.slug}-${item.name.toLowerCase().replace(/\s+/g, "-")}`,
        kind: "course" as const,
        label: item.name,
        meta: institution.name,
        href: `/schools?q=${encodeURIComponent(item.name)}`,
      };
    });
}

export async function getSearchSuggestions(
  query: string,
  limit = SEARCH_SUGGESTION_LIMIT
): Promise<SearchSuggestion[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const mock = getMockSearchSuggestions(q, limit);

  try {
    const [index, courseSuggestions] = await Promise.all([
      getInstitutionsIndex(),
      getCourseSuggestions(q).catch(() => [] as SearchSuggestion[]),
    ]);

    const schoolSuggestions: SearchSuggestion[] = (
      index?.searchScored(q) ?? []
    )
      .filter(({ score }) => score > 0)
      .slice(0, 5)
      .map(({ item }) => ({
        id: `school-${item.slug}`,
        kind: "school" as const,
        label: item.name,
        meta: schoolMeta(item),
        href: `/schools/${item.slug}`,
      }));

    const stateSuggestions: SearchSuggestion[] = stateIndex
      .searchScored(q)
      .filter(({ score }) => score > 0)
      .slice(0, 3)
      .map(({ item }) => ({
        id: `state-${item.name.toLowerCase().replace(/\s+/g, "-")}`,
        kind: "state" as const,
        label: item.name,
        meta: "Filter by state",
        href: `/schools?state=${encodeURIComponent(item.name)}`,
      }));

    const live = [
      ...schoolSuggestions,
      ...courseSuggestions,
      ...stateSuggestions,
    ];

    if (live.length === 0) return mock;
    return mergeSuggestions(live, mock, limit);
  } catch {
    return mock;
  }
}
