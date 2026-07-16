import { createServerClient } from "@/lib/supabase/server";
import { OWNERSHIP_TYPE_LABELS } from "@/types/institution";
import { NIGERIA_STATES } from "@/types/institution";
import type { OwnershipType } from "@/types/database";
import { getMockSearchSuggestions } from "@/lib/search/mock-index";
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

export async function getSearchSuggestions(
  query: string,
  limit = SEARCH_SUGGESTION_LIMIT
): Promise<SearchSuggestion[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const mock = getMockSearchSuggestions(q, limit);

  try {
    const supabase = await createServerClient();
    const safeQ = q.replace(/[%_,]/g, "").trim();
    if (!safeQ) return mock;

    const pattern = `%${safeQ}%`;

    const [schoolsResult, coursesResult] = await Promise.all([
      supabase
        .from("institutions")
        .select("name, slug, abbreviation, city, state, ownership_type")
        .eq("is_active", true)
        .or(
          `name.ilike.${pattern},abbreviation.ilike.${pattern},city.ilike.${pattern},state.ilike.${pattern}`
        )
        .limit(5),
      supabase
        .from("courses")
        .select("name, institutions ( name, slug )")
        .eq("is_active", true)
        .ilike("name", pattern)
        .limit(5),
    ]);

    const schoolSuggestions: SearchSuggestion[] = (
      (schoolsResult.data ?? []) as InstitutionSuggestionRow[]
    ).map((row) => ({
      id: `school-${row.slug}`,
      kind: "school" as const,
      label: row.name,
      meta: schoolMeta(row),
      href: `/schools/${row.slug}`,
    }));

    const courseSuggestions: SearchSuggestion[] = (
      (coursesResult.data ?? []) as CourseSuggestionRow[]
    )
      .filter((row) => row.institutions)
      .map((row) => {
        const institution = row.institutions!;
        return {
          id: `course-${institution.slug}-${row.name.toLowerCase().replace(/\s+/g, "-")}`,
          kind: "course" as const,
          label: row.name,
          meta: institution.name,
          href: `/schools?q=${encodeURIComponent(row.name)}`,
        };
      });

    const stateSuggestions: SearchSuggestion[] = NIGERIA_STATES.filter((state) =>
      state.toLowerCase().includes(q.toLowerCase())
    )
      .slice(0, 3)
      .map((state) => ({
        id: `state-${state.toLowerCase().replace(/\s+/g, "-")}`,
        kind: "state" as const,
        label: state,
        meta: "Filter by state",
        href: `/schools?state=${encodeURIComponent(state)}`,
      }));

    const live = [...schoolSuggestions, ...courseSuggestions, ...stateSuggestions];

    if (live.length === 0) return mock;
    return mergeSuggestions(live, mock, limit);
  } catch {
    return mock;
  }
}
