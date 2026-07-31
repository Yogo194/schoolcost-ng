import { createServerClient } from "@/lib/supabase/server";
import {
  PRICE_COMPARABLE_STATUSES,
  PRICE_EXCLUDED_CONFIDENCE,
} from "@/lib/fees/trust";
import { resolveSchoolLogoUrl } from "@/lib/schools/logo";
import type { CourseCompareColumn } from "@/lib/mock/course-compare";
import type { ConfidenceLevel, SourceType } from "@/types/database";

type PeerRow = {
  id: string;
  level: string | null;
  first_year_total: number;
  returning_year_total: number;
  compulsory_total: number;
  accommodation_total: number;
  confidence_level: ConfidenceLevel;
  source_type: SourceType;
  last_reviewed_at: string | null;
  institution_id: string;
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
 * Real peer schools offering the same course, for the compare tab on a fee
 * detail page.
 *
 * Only price-comparable rows qualify, the same rule the directory and the
 * standalone compare flow use, so an outdated or low-confidence figure can
 * never appear beside a verified one as if they were equivalent.
 *
 * Returns an empty list when there are no qualifying peers. That is the honest
 * answer: showing nothing is correct, inventing peers is not.
 */
export async function getCoursePeers(
  courseName: string,
  excludeInstitutionSlug: string,
  limit = 6
): Promise<CourseCompareColumn[]> {
  if (!courseName) return [];

  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("fee_records")
      .select(
        `
        id, level, first_year_total, returning_year_total, compulsory_total,
        accommodation_total, confidence_level, source_type, last_reviewed_at,
        institution_id,
        institutions ( name, slug, abbreviation, state, ownership_type, logo_url ),
        courses ( name ),
        academic_sessions ( name )
      `
      )
      .eq("is_published", true)
      .eq("level", "100L")
      .in("verification_status", PRICE_COMPARABLE_STATUSES)
      .neq("confidence_level", PRICE_EXCLUDED_CONFIDENCE)
      .gt("first_year_total", 0);

    if (error || !data) return [];

    const seenSlugs = new Set<string>([excludeInstitutionSlug]);
    const target = courseName.trim().toLowerCase();
    const peers: CourseCompareColumn[] = [];

    for (const row of data as unknown as PeerRow[]) {
      if (peers.length >= limit) break;
      if (!row.institutions || !row.courses || !row.academic_sessions) continue;
      if (row.courses.name.trim().toLowerCase() !== target) continue;
      if (seenSlugs.has(row.institutions.slug)) continue;
      seenSlugs.add(row.institutions.slug);

      peers.push({
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
        // Never derive a whole-programme total from one annual figure.
        estimatedDegreeTotal: 0,
        paymentLabel: "Check source",
        lastReviewedLabel: formatReviewedLabel(row.last_reviewed_at),
        sourceLabel: row.source_type,
        source_type: row.source_type,
        confidenceLabel:
          row.confidence_level.charAt(0).toUpperCase() +
          row.confidence_level.slice(1),
        feeRecordId: row.id,
        isCurrent: false,
      });
    }

    return peers;
  } catch {
    return [];
  }
}
