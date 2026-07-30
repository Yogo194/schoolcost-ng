import { createServerClient } from "@/lib/supabase/server";
import { OWNERSHIP_TYPE_LABELS } from "@/types/institution";
import { NIGERIA_STATES } from "@/types/institution";
import type { OwnershipType } from "@/types/database";
import {
  createSchoolSearchIndex,
  normalizeSearchText,
  type SchoolSearchIndex,
} from "@/lib/search/school-search";
import { fetchAllRows } from "@/lib/supabase/fetch-all-rows";
import type { SearchSuggestion } from "@/lib/search/types";
import { SEARCH_SUGGESTION_LIMIT } from "@/lib/search/types";

interface InstitutionSuggestionRow {
  name: string;
  slug: string;
  abbreviation: string | null;
  city: string | null;
  state: string;
  ownership_type: OwnershipType;
  logo_url: string | null;
}

interface CourseSuggestionRow {
  name: string;
  institutions: { name: string; slug: string } | null;
}

interface IndexedCourseSuggestion {
  name: string;
  aliases: readonly string[];
  row: CourseSuggestionRow & {
    institutions: { name: string; slug: string };
  };
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

function takeSuggestions(
  items: SearchSuggestion[],
  limit: number
): SearchSuggestion[] {
  const seen = new Set<string>();
  const out: SearchSuggestion[] = [];

  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
    if (out.length >= limit) break;
  }

  return out;
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
    .select("name, slug, abbreviation, city, state, ownership_type, logo_url")
    .eq("is_active", true);

  if (error) throw error;
  const rows = (data ?? []) as InstitutionSuggestionRow[];
  institutionsIndex =
    rows.length > 0 ? createSchoolSearchIndex(rows) : null;
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

let coursesIndex: SchoolSearchIndex<IndexedCourseSuggestion> | null = null;
let coursesFetchedAt = 0;
let coursesRefresh: Promise<void> | null = null;

async function refreshCoursesIndex(): Promise<void> {
  const supabase = await createServerClient();

  const rows = await fetchAllRows<CourseSuggestionRow>((from, to) =>
    supabase
      .from("courses")
      .select("name, institutions ( name, slug )")
      .eq("is_active", true)
      .order("name")
      .range(from, to)
  );

  const indexedRows: IndexedCourseSuggestion[] = rows
    .filter(
      (
        row
      ): row is CourseSuggestionRow & {
        institutions: { name: string; slug: string };
      } => Boolean(row.institutions)
    )
    .map((row) => ({
      name: row.name,
      aliases: [row.institutions.name],
      row,
    }));

  coursesIndex =
    indexedRows.length > 0 ? createSchoolSearchIndex(indexedRows) : null;
  coursesFetchedAt = Date.now();
}

async function getCoursesIndex(): Promise<
  SchoolSearchIndex<IndexedCourseSuggestion> | null
> {
  const stale = Date.now() - coursesFetchedAt > INSTITUTIONS_CACHE_TTL_MS;

  if (coursesIndex && !stale) return coursesIndex;

  if (!coursesRefresh) {
    coursesRefresh = refreshCoursesIndex().finally(() => {
      coursesRefresh = null;
    });
  }

  if (!coursesIndex) {
    await coursesRefresh;
  } else {
    coursesRefresh.catch(() => {});
  }

  return coursesIndex;
}

async function getCourseSuggestions(
  query: string
): Promise<SearchSuggestion[]> {
  const tokens = normalizeSearchText(query).split(" ").filter(Boolean);
  if (tokens.length === 0) return [];

  const index = await getCoursesIndex();
  const rows =
    index?.searchScored(query).filter(({ score }) => score > 0) ?? [];
  if (rows.length === 0) return [];

  return rows
    .slice(0, 5)
    .map(({ item }) => {
      const institution = item.row.institutions;
      return {
        id: `course-${institution.slug}-${item.name.toLowerCase().replace(/\s+/g, "-")}`,
        kind: "course" as const,
        label: item.name,
        meta: institution.name,
        href: `/schools?q=${encodeURIComponent(item.name)}`,
      };
    });
}

/** Live institutions / courses / states only. No mock school templates. */
export async function getSearchSuggestions(
  query: string,
  limit = SEARCH_SUGGESTION_LIMIT
): Promise<SearchSuggestion[]> {
  const q = query.trim();
  if (q.length < 2) return [];

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
        logoUrl: item.logo_url,
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

    return takeSuggestions(
      [...schoolSuggestions, ...courseSuggestions, ...stateSuggestions],
      limit
    );
  } catch {
    return [];
  }
}
