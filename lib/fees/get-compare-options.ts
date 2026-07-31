import { createServerClient } from "@/lib/supabase/server";
import {
  PRICE_COMPARABLE_STATUSES,
  PRICE_EXCLUDED_CONFIDENCE,
} from "@/lib/fees/trust";
import { resolveSchoolLogoUrl } from "@/lib/schools/logo";
import type { CourseCompareColumn } from "@/lib/mock/course-compare";
import type { ConfidenceLevel, SourceType, VerificationStatus } from "@/types/database";

export type CompareCourseOption = {
  id: string;
  label: string;
  level: string;
  session: string;
  schoolCount: number;
  columns: CourseCompareColumn[];
};

type CompareRow = {
  id: string;
  level: string | null;
  first_year_total: number;
  returning_year_total: number;
  compulsory_total: number;
  accommodation_total: number;
  estimated_degree_total: number;
  verification_status: VerificationStatus;
  confidence_level: ConfidenceLevel;
  source_type: SourceType;
  last_reviewed_at: string | null;
  institutions: {
    name: string;
    slug: string;
    abbreviation: string | null;
    state: string;
    ownership_type: string;
    logo_url: string | null;
  } | null;
  courses: { name: string } | null;
  academic_sessions: { name: string } | null;
};

function formatReviewedLabel(value: string | null): string {
  if (!value) return "Not reviewed";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Compare only equal 100L records from the same session. Low-confidence and
 * unreviewed community reports stay visible on school pages but never enter
 * this dataset or determine a lowest-cost result.
 */
export async function getCompareOptions(): Promise<CompareCourseOption[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("fee_records")
      .select(
        `
        id, level, first_year_total, returning_year_total, compulsory_total,
        accommodation_total, estimated_degree_total, verification_status,
        confidence_level, source_type, last_reviewed_at,
        institutions ( name, slug, abbreviation, state, ownership_type, logo_url ),
        courses ( name ),
        academic_sessions ( name )
      `
      )
      .eq("is_published", true)
      .eq("level", "100L")
      .in("verification_status", PRICE_COMPARABLE_STATUSES)
      .neq("confidence_level", PRICE_EXCLUDED_CONFIDENCE);

    if (error || !data) return [];

    const groups = new Map<string, CompareCourseOption>();
    for (const row of data as unknown as CompareRow[]) {
      if (!row.institutions || !row.courses || !row.academic_sessions) continue;
      const key = `${row.courses.name}|${row.level}|${row.academic_sessions.name}`;
      const option = groups.get(key) ?? {
        id: key,
        label: row.courses.name,
        level: row.level ?? "100L",
        session: row.academic_sessions.name,
        schoolCount: 0,
        columns: [],
      };
      option.columns.push({
        id: row.id,
        schoolName: row.institutions.name,
        schoolSlug: row.institutions.slug,
        abbreviation: row.institutions.abbreviation,
        state: row.institutions.state,
        ownership: row.institutions.ownership_type,
        logoUrl: resolveSchoolLogoUrl(
          row.institutions.slug,
          row.institutions.logo_url
        ),
        course: row.courses.name,
        level: row.level ?? "100L",
        session: row.academic_sessions.name,
        firstYearTotal: Number(row.first_year_total) || 0,
        returningYearTotal: Number(row.returning_year_total) || 0,
        compulsoryTotal: Number(row.compulsory_total) || 0,
        accommodationTotal: Number(row.accommodation_total) || 0,
        // A stored estimate can be derived from one recurring annual fee. Do
        // not present that as a source-published whole-programme total.
        estimatedDegreeTotal: 0,
        paymentLabel: "Check source",
        lastReviewedLabel: formatReviewedLabel(row.last_reviewed_at),
        sourceLabel: row.source_type,
        source_type: row.source_type,
        confidenceLabel:
          row.confidence_level.charAt(0).toUpperCase() + row.confidence_level.slice(1),
        feeRecordId: row.id,
        isCurrent: false,
      });
      option.schoolCount = option.columns.length;
      groups.set(key, option);
    }

    return [...groups.values()]
      .filter((option) => option.schoolCount >= 2)
      .map((option) => ({
        ...option,
        columns: option.columns.sort((a, b) => a.schoolName.localeCompare(b.schoolName)),
      }))
      .sort((a, b) => b.schoolCount - a.schoolCount || a.label.localeCompare(b.label));
  } catch {
    return [];
  }
}
