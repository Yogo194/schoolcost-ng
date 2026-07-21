import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import {
  isUuid,
  normalizeSessionName,
  parseSessionYears,
} from "@/lib/submissions/session";

type ServiceClient = SupabaseClient<Database>;

/**
 * Resolve a free-text session label (or existing UUID) to an
 * academic_sessions row id. Creates the session when missing.
 */
export async function resolveAcademicSessionId(
  supabase: ServiceClient,
  institutionId: string,
  sessionInput: string
): Promise<string | null> {
  const trimmed = sessionInput.trim();
  if (!trimmed) return null;

  if (isUuid(trimmed)) {
    const { data } = await supabase
      .from("academic_sessions")
      .select("id")
      .eq("id", trimmed)
      .maybeSingle();
    return data?.id ?? null;
  }

  const name = normalizeSessionName(trimmed);
  const { data: existing } = await supabase
    .from("academic_sessions")
    .select("id")
    .eq("institution_id", institutionId)
    .eq("name", name)
    .maybeSingle();

  if (existing?.id) return existing.id;

  const { start_year, end_year } = parseSessionYears(name);
  const { data: created, error } = await supabase
    .from("academic_sessions")
    .insert({
      institution_id: institutionId,
      name,
      start_year,
      end_year,
      is_current: false,
    })
    .select("id")
    .single();

  if (error) {
    // Race on unique(institution_id, name): fetch the winner.
    const { data: raced } = await supabase
      .from("academic_sessions")
      .select("id")
      .eq("institution_id", institutionId)
      .eq("name", name)
      .maybeSingle();
    return raced?.id ?? null;
  }

  return created.id;
}

export async function assertActiveInstitution(
  supabase: ServiceClient,
  institutionId: string
): Promise<boolean> {
  if (!isUuid(institutionId)) return false;
  const { data } = await supabase
    .from("institutions")
    .select("id")
    .eq("id", institutionId)
    .eq("is_active", true)
    .maybeSingle();
  return Boolean(data?.id);
}

export async function resolveCourseId(
  supabase: ServiceClient,
  institutionId: string,
  courseId: string | undefined | null
): Promise<string | null> {
  if (!courseId || !isUuid(courseId)) return null;
  const { data } = await supabase
    .from("courses")
    .select("id")
    .eq("id", courseId)
    .eq("institution_id", institutionId)
    .maybeSingle();
  return data?.id ?? null;
}
