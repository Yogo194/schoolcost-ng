import { createServerClient } from "@/lib/supabase/server";
import { getSchoolFeeCoverage } from "@/lib/fees/school-fee-coverage";
import type { SchoolFeeRow, SchoolProfile } from "@/lib/mock/school-profile";
import type {
  ConfidenceLevel,
  InstitutionType,
  OwnershipType,
  SourceType,
  VerificationStatus,
} from "@/types/database";

type LiveFeeRow = {
  id: string;
  level: string | null;
  first_year_total: number;
  source_type: SourceType;
  verification_status: VerificationStatus;
  confidence_level: ConfidenceLevel;
  courses: { name: string } | null;
  academic_sessions: { name: string } | null;
};

export async function getLiveSchoolProfile(
  slug: string
): Promise<SchoolProfile | null> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("institutions")
      .select(
        "id, name, slug, abbreviation, city, state, institution_type, ownership_type, website_url, logo_url"
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) return null;

    const institution = data as {
      id: string;
      name: string;
      slug: string;
      abbreviation: string | null;
      city: string | null;
      state: string;
      institution_type: InstitutionType;
      ownership_type: OwnershipType;
      website_url: string | null;
      logo_url: string | null;
    };

    const { data: feeData } = await supabase
      .from("fee_records")
      .select(
        `
        id, level, first_year_total, source_type, verification_status, confidence_level,
        courses ( name ),
        academic_sessions ( name )
      `
      )
      .eq("institution_id", institution.id)
      .eq("is_published", true)
      .order("first_year_total", { ascending: true });

    const fees: SchoolFeeRow[] = ((feeData ?? []) as unknown as LiveFeeRow[])
      .filter((row) => row.courses && row.academic_sessions)
      .map((row) => ({
        id: row.id,
        course: row.courses!.name,
        level: row.level ?? "100L",
        compulsory_total: Number(row.first_year_total) || 0,
        session: row.academic_sessions!.name,
        source_type: row.source_type,
      }));

    const courses = [...new Set(fees.map((fee) => fee.course))].sort();
    const sessions = [...new Set(fees.map((fee) => fee.session))];
    const levels = [...new Set(fees.map((fee) => fee.level))].sort((a, b) => {
      const rank = (value: string) => {
        const n = Number.parseInt(value, 10);
        if (!Number.isFinite(n)) return 999;
        return value.includes("DE") ? n + 0.5 : n;
      };
      return rank(a) - rank(b);
    });
    const fresh100Totals = fees
      .filter(
        (fee) =>
          fee.level === "100L" ||
          fee.level === "Undergraduate" ||
          fee.level.startsWith("100")
      )
      .map((fee) => fee.compulsory_total);
    const firstYearMin = fresh100Totals.length
      ? Math.min(...fresh100Totals)
      : fees.length
        ? Math.min(...fees.map((fee) => fee.compulsory_total))
        : 0;
    const firstYearMax = fresh100Totals.length
      ? Math.max(...fresh100Totals)
      : fees.length
        ? Math.max(...fees.map((fee) => fee.compulsory_total))
        : 0;

    const hasOfficial = fees.some(
      (fee) =>
        fee.source_type === "official_school_source" ||
        fee.source_type === "official_fee_circular"
    );
    const hasOnlyCommunityReports =
      fees.length > 0 &&
      (feeData as unknown as LiveFeeRow[]).every(
        (fee) =>
          fee.verification_status === "reported" ||
          fee.confidence_level === "low"
      );

    return {
      slug: institution.slug,
      name: institution.name,
      abbreviation:
        institution.abbreviation ?? institution.name.slice(0, 6).toUpperCase(),
      city: institution.city ?? institution.state,
      state: institution.state,
      institution_type: institution.institution_type,
      ownership_type: institution.ownership_type,
      website_url: institution.website_url ?? "#",
      website_label: institution.website_url
        ? institution.website_url.replace(/^https?:\/\//, "").replace(/\/$/, "")
        : "Website pending",
      logo_url: institution.logo_url ?? "/figma/icon-logo.svg",
      source_badge: hasOfficial
        ? "official"
        : fees.length > 0
          ? "community"
          : "official",
      courses_listed: courses.length,
      first_year_min: firstYearMin,
      first_year_max: firstYearMax,
      payment_options: fees.length && !hasOnlyCommunityReports ? ["Full session"] : [],
      sessions,
      levels: levels.length ? levels : ["100L"],
      courses,
      fees,
      fee_coverage: getSchoolFeeCoverage(institution.slug),
    };
  } catch {
    return null;
  }
}
