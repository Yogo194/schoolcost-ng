import { createServerClient } from "@/lib/supabase/server";
import type { FeeDetailRecord } from "@/lib/mock/fee-detail";
import { SOURCE_TYPE_LABELS } from "@/types/fee";
import type {
  ConfidenceLevel,
  FeeAppliesTo,
  FeeCategory,
  FeeFrequency,
  SourceType,
  VerificationStatus,
} from "@/types/database";

type LiveFeeDetailRow = {
  id: string;
  institution_id: string;
  course_id: string | null;
  academic_session_id: string;
  level: string | null;
  compulsory_total: number;
  first_year_total: number;
  returning_year_total: number;
  estimated_degree_total: number;
  accommodation_total: number;
  verification_status: VerificationStatus;
  confidence_level: ConfidenceLevel;
  source_type: SourceType;
  last_reviewed_at: string | null;
  admin_note: string | null;
  institutions: {
    name: string;
    slug: string;
    abbreviation: string | null;
    state: string;
    ownership_type: string;
  } | null;
  courses: {
    name: string;
    duration_years: number;
  } | null;
  academic_sessions: {
    name: string;
  } | null;
  fee_items: Array<{
    id: string;
    name: string;
    category: FeeCategory;
    amount: number;
    is_compulsory: boolean;
    frequency: FeeFrequency;
    applies_to: FeeAppliesTo;
    description: string | null;
  }>;
  evidence: Array<{
    source_url: string | null;
    source_type: string;
    review_status: string;
  }>;
};

function formatReviewedLabel(iso: string | null): string {
  if (!iso) return "Not reviewed yet";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function lineNote(item: LiveFeeDetailRow["fee_items"][number]): string {
  const bits: string[] = [];
  if (item.frequency === "one_time") bits.push("One-time");
  else bits.push("Per session");
  if (item.applies_to === "fresh_only") bits.push("fresh students only");
  if (item.applies_to === "returning_only") bits.push("returning students only");
  if (item.description) bits.push(item.description);
  return bits.join(" · ");
}

function mapLines(row: LiveFeeDetailRow, levels: { value: string }[]) {
  return row.fee_items.map((item) => ({
    id: item.id,
    name: item.name,
    note: lineNote(item),
    category: item.is_compulsory ? ("compulsory" as const) : ("optional" as const),
    due: "both" as const,
    amount: Number(item.amount) || 0,
    levels:
      item.applies_to === "fresh_only"
        ? ["100L"]
        : item.applies_to === "returning_only"
          ? levels.filter((level) => level.value !== "100L").map((level) => level.value)
          : undefined,
  }));
}

function levelRank(value: string): number {
  const numeric = Number.parseInt(value, 10);
  if (!Number.isFinite(numeric)) return Number.MAX_SAFE_INTEGER;
  return numeric + (value.includes("DE") ? 0.5 : 0);
}

function mapFeeDetail(
  row: LiveFeeDetailRow,
  relatedRows: LiveFeeDetailRow[]
): FeeDetailRecord | null {
  if (!row.institutions || !row.courses || !row.academic_sessions) return null;

  const duration = row.courses.duration_years;
  const detailedRows = relatedRows.filter((item) => item.level);
  const hasLevelSpecificTotals = detailedRows.length > 1;
  const levels = hasLevelSpecificTotals
    ? detailedRows
        .map((item) => item.level!)
        .filter((value, index, values) => values.indexOf(value) === index)
        .sort((a, b) => levelRank(a) - levelRank(b))
        .map((value) => ({
          value,
          label: value.includes("DE")
            ? `${value.replace("L", " Level ")}`
            : `${value.replace("L", " Level")}`,
        }))
    : Array.from({ length: duration }, (_, index) => {
        const value = `${index + 1}00L`;
        return { value, label: `${index + 1}00 Level` };
      });

  const totalsByLevel: FeeDetailRecord["totalsByLevel"] = {};
  if (hasLevelSpecificTotals) {
    for (const detailRow of detailedRows) {
      const level = detailRow.level!;
      const compulsory = Number(detailRow.compulsory_total) || 0;
      const accommodation = Number(detailRow.accommodation_total) || 0;
      totalsByLevel[level] = {
        compulsory,
        accommodation,
        withAccommodation: compulsory + accommodation,
      };
    }
  } else {
    const accommodation = Number(row.accommodation_total) || 0;
    const firstYear = Number(row.first_year_total) || 0;
    const returningYear = Number(row.returning_year_total) || 0;
    for (const level of levels) {
      const compulsory = level.value === "100L" ? firstYear : returningYear;
      totalsByLevel[level.value] = {
        compulsory,
        accommodation,
        withAccommodation: compulsory + accommodation,
      };
    }
  }

  const firstYearTotal =
    totalsByLevel["100L"]?.compulsory ?? Number(row.first_year_total) ?? 0;
  const returningLevel = levels.find((level) => level.value !== "100L")?.value;
  const returningYearTotal = returningLevel
    ? totalsByLevel[returningLevel]?.compulsory ?? 0
    : Number(row.returning_year_total) || 0;
  const degreeTotal = hasLevelSpecificTotals
    ? Object.entries(totalsByLevel)
        .filter(([level]) => !level.includes("DE"))
        .reduce((sum, [, total]) => sum + total.compulsory, 0)
    : Number(row.estimated_degree_total) || 0;

  const approvedEvidence = row.evidence.find(
    (item) => item.review_status === "approved" && item.source_url
  );
  const linesByLevel = hasLevelSpecificTotals
    ? Object.fromEntries(
        detailedRows
          .filter((detailRow) => detailRow.level)
          .map((detailRow) => [
            detailRow.level!,
            mapLines(detailRow, levels),
          ])
      )
    : undefined;

  return {
    id: row.id,
    schoolSlug: row.institutions.slug,
    schoolName: row.institutions.name,
    schoolAbbreviation: row.institutions.abbreviation,
    schoolState: row.institutions.state,
    schoolOwnership: row.institutions.ownership_type,
    course: row.courses.name,
    session: row.academic_sessions.name,
    programmeDuration: `${duration}-year programme`,
    sourceLabel: SOURCE_TYPE_LABELS[row.source_type],
    source_type: row.source_type,
    verification_status: row.verification_status,
    confidence_level: row.confidence_level,
    lastReviewedAt: row.last_reviewed_at?.slice(0, 10) ?? "",
    lastReviewedLabel: formatReviewedLabel(row.last_reviewed_at),
    firstYearTotal,
    returningYearTotal,
    estimatedDegreeTotal: degreeTotal,
    evidence: approvedEvidence?.source_url
      ? {
          title: "Source link",
          typeLabel: "Web evidence",
          url: approvedEvidence.source_url,
        }
      : undefined,
    reviewerNote: row.admin_note ?? undefined,
    levels,
    defaultLevel: row.level ?? levels[0]?.value ?? "100L",
    paymentPlans: [
      { value: "full", label: "Full session" },
      { value: "semester", label: "Per semester" },
    ],
    totalsByLevel,
    linesByLevel,
    lines: mapLines(row, levels),
  };
}

export async function getLiveFeeDetail(
  feeRecordId: string
): Promise<FeeDetailRecord | null> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("fee_records")
      .select(
        `
        id, institution_id, course_id, academic_session_id, level, compulsory_total,
        first_year_total, returning_year_total, estimated_degree_total,
        accommodation_total, verification_status, confidence_level, source_type,
        last_reviewed_at, admin_note,
        institutions ( name, slug, abbreviation, state, ownership_type ),
        courses ( name, duration_years ),
        academic_sessions ( name ),
        fee_items ( id, name, category, amount, is_compulsory, frequency, applies_to, description ),
        evidence ( source_url, source_type, review_status )
      `
      )
      .eq("id", feeRecordId)
      .eq("is_published", true)
      .maybeSingle();

    if (error || !data) return null;

    const row = data as unknown as LiveFeeDetailRow;
    const { data: relatedData } = await supabase
      .from("fee_records")
      .select(
        `
        id, institution_id, course_id, academic_session_id, level, compulsory_total,
        first_year_total, returning_year_total, estimated_degree_total,
        accommodation_total, verification_status, confidence_level, source_type,
        last_reviewed_at, admin_note,
        institutions ( name, slug ),
        courses ( name, duration_years ),
        academic_sessions ( name ),
        fee_items ( id, name, category, amount, is_compulsory, frequency, applies_to, description ),
        evidence ( source_url, source_type, review_status )
      `
      )
      .eq("institution_id", row.institution_id)
      .eq("course_id", row.course_id ?? "")
      .eq("academic_session_id", row.academic_session_id)
      .eq("is_published", true);

    const relatedRows = (relatedData ?? []) as unknown as LiveFeeDetailRow[];
    return mapFeeDetail(row, relatedRows.length ? relatedRows : [row]);
  } catch {
    return null;
  }
}
