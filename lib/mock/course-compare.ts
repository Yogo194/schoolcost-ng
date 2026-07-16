import type { FeeDetailRecord } from "@/lib/mock/fee-detail";
import type { SourceType } from "@/types/database";

export interface CourseCompareColumn {
  id: string;
  schoolName: string;
  schoolSlug: string;
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

const COURSE_PEERS: Omit<CourseCompareColumn, "course" | "isCurrent">[] = [
  {
    id: "demo-ui-cs",
    schoolName: "University of Ibadan",
    schoolSlug: "university-of-ibadan",
    abbreviation: "UI",
    state: "Oyo",
    ownership: "Federal",
    level: "100L",
    session: "2025/2026",
    firstYearTotal: 228_000,
    returningYearTotal: 198_000,
    compulsoryTotal: 198_000,
    accommodationTotal: 95_000,
    estimatedDegreeTotal: 822_000,
    paymentLabel: "Per semester or full",
    lastReviewedLabel: "12 July 2026",
    sourceLabel: "Official source",
    source_type: "official_school_source",
    confidenceLabel: "High",
    feeRecordId: "demo-ui-cs",
  },
  {
    id: "demo-lasu-cs",
    schoolName: "Lagos State University",
    schoolSlug: "lagos-state-university",
    abbreviation: "LASU",
    state: "Lagos",
    ownership: "State",
    level: "100L",
    session: "2025/2026",
    firstYearTotal: 295_000,
    returningYearTotal: 265_000,
    compulsoryTotal: 265_000,
    accommodationTotal: 140_000,
    estimatedDegreeTotal: 1_090_000,
    paymentLabel: "Full session",
    lastReviewedLabel: "5 July 2026",
    sourceLabel: "Student evidence",
    source_type: "student_portal_evidence",
    confidenceLabel: "Medium",
    feeRecordId: "demo-lasu-cs",
  },
  {
    id: "demo-oau-cs",
    schoolName: "Obafemi Awolowo University",
    schoolSlug: "obafemi-awolowo-university",
    abbreviation: "OAU",
    state: "Osun",
    ownership: "Federal",
    level: "100L",
    session: "2025/2026",
    firstYearTotal: 205_000,
    returningYearTotal: 172_500,
    compulsoryTotal: 172_500,
    accommodationTotal: 84_000,
    estimatedDegreeTotal: 722_500,
    paymentLabel: "Per session",
    lastReviewedLabel: "8 July 2026",
    sourceLabel: "Official source",
    source_type: "official_fee_circular",
    confidenceLabel: "High",
    feeRecordId: "demo-oau-cs",
  },
];

/** Same-course, same-level peers for the fee detail compare panel (mock). */
export function getCourseCompareColumns(
  record: FeeDetailRecord,
  level: string
): CourseCompareColumn[] {
  const totals =
    record.totalsByLevel[level] ?? record.totalsByLevel[record.defaultLevel];

  const current: CourseCompareColumn = {
    id: record.id,
    schoolName: record.schoolName,
    schoolSlug: record.schoolSlug,
    abbreviation: "UNILAG",
    state: "Lagos",
    ownership: "Federal",
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

  const peers = COURSE_PEERS.map((peer) => ({
    ...peer,
    compulsoryTotal:
      level === "100L" ? peer.firstYearTotal : peer.returningYearTotal,
    level,
    course: record.course,
    isCurrent: false,
  }));

  return [current, ...peers];
}
