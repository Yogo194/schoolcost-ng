import type { FeeDetailRecord } from "@/lib/mock/fee-detail";
import type { SourceType } from "@/types/database";

export interface CourseCompareColumn {
  id: string;
  schoolName: string;
  schoolSlug: string;
  logoUrl?: string | null;
  abbreviation: string | null;
  state: string;
  ownership: string;
  course: string;
  level: string;
  session: string;
  firstYearTotal: number;
  returningYearTotal: number;
  compulsoryTotal: number;
  accommodationTotal: number;
  estimatedDegreeTotal: number;
  paymentLabel: string;
  lastReviewedLabel: string;
  sourceLabel: string;
  source_type: SourceType;
  confidenceLabel: string;
  feeRecordId: string;
  isCurrent: boolean;
}

/**
 * Builds the compare columns for a fee detail page: the current record plus
 * whatever real peers were passed in. Never fabricates peers.
 */
export function getCourseCompareColumns(
  record: FeeDetailRecord,
  level: string,
  peerColumns: CourseCompareColumn[] = []
): CourseCompareColumn[] {
  const totals =
    record.totalsByLevel[level] ?? record.totalsByLevel[record.defaultLevel];

  const current: CourseCompareColumn = {
    id: record.id,
    schoolName: record.schoolName,
    schoolSlug: record.schoolSlug,
    abbreviation:
      record.schoolAbbreviation ?? record.schoolName.slice(0, 2).toUpperCase(),
    state: record.schoolState ?? "Nigeria",
    ownership: record.schoolOwnership ?? "Not specified",
    logoUrl: record.schoolLogoUrl,
    course: record.course,
    level,
    session: record.session,
    firstYearTotal: record.firstYearTotal,
    returningYearTotal: record.returningYearTotal,
    compulsoryTotal: totals?.compulsory ?? 0,
    accommodationTotal: totals?.accommodation ?? 0,
    estimatedDegreeTotal: record.estimatedDegreeTotal,
    paymentLabel: "Per semester or full",
    lastReviewedLabel: record.lastReviewedLabel,
    sourceLabel: record.sourceLabel,
    source_type: record.source_type,
    confidenceLabel:
      record.confidence_level.charAt(0).toUpperCase() +
      record.confidence_level.slice(1),
    feeRecordId: record.id,
    isCurrent: true,
  };

  const peers = peerColumns.map((peer) => ({
    ...peer,
    compulsoryTotal:
      level === "100L" ? peer.firstYearTotal : peer.returningYearTotal,
    level,
    course: record.course,
    isCurrent: false,
  }));

  return [current, ...peers];
}
