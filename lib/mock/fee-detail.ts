import type {
  ConfidenceLevel,
  SourceType,
  VerificationStatus,
} from "@/types/database";

export type FeeDue = "both" | "1st_sem" | "2nd_sem";
export type FeeLineCategory = "compulsory" | "optional";
export type StudentType = "fresh" | "returning";

export interface FeeBreakdownLine {
  id: string;
  name: string;
  note: string;
  category: FeeLineCategory;
  due: FeeDue;
  amount: number;
  /** Only show on these levels; omit = all levels */
  levels?: string[];
}

export interface FeeDetailRecord {
  id: string;
  schoolSlug: string;
  schoolName: string;
  course: string;
  session: string;
  programmeDuration: string;
  sourceLabel: string;
  source_type: SourceType;
  verification_status: VerificationStatus;
  confidence_level: ConfidenceLevel;
  lastReviewedAt: string;
  lastReviewedLabel: string;
  /** Compulsory recurring + one-time fresh charges (estimate). */
  firstYearTotal: number;
  /** Compulsory recurring charges for a returning session (estimate). */
  returningYearTotal: number;
  estimatedDegreeTotal: number;
  /** Supporting document shown in the verification panel, if any. */
  evidence?: {
    title: string;
    typeLabel: string;
    url: string;
  };
  /** Internal reviewer note shown to build trust, if any. */
  reviewerNote?: string;
  /** Number of students who have confirmed this record matches what they paid. */
  confirmationsCount?: number;
  levels: { value: string; label: string }[];
  /** Initial academic level for the breakdown filters */
  defaultLevel: string;
  paymentPlans: { value: string; label: string }[];
  /** Amounts keyed by level value */
  totalsByLevel: Record<
    string,
    { compulsory: number; accommodation: number; withAccommodation: number }
  >;
  /** Exact line items keyed by level when a source publishes level-specific fees. */
  linesByLevel?: Record<string, FeeBreakdownLine[]>;
  lines: FeeBreakdownLine[];
}

const DUE_LABELS: Record<FeeDue, string> = {
  both: "Both",
  "1st_sem": "1st sem",
  "2nd_sem": "2nd sem",
};

export function dueLabel(due: FeeDue): string {
  return DUE_LABELS[due];
}

/** Amount shown for a line under the selected payment plan. */
export function lineAmountForPlan(
  amount: number,
  due: FeeDue,
  paymentPlan: string
): number {
  if (paymentPlan !== "semester") return amount;
  if (due === "both") return Math.round(amount / 2);
  return amount;
}

export function semesterTotals(
  lines: FeeBreakdownLine[]
): { first: number; second: number } {
  let first = 0;
  let second = 0;
  for (const line of lines) {
    if (line.category !== "compulsory") continue;
    if (line.due === "both") {
      const half = Math.round(line.amount / 2);
      first += half;
      second += half;
    } else if (line.due === "1st_sem") {
      first += line.amount;
    } else {
      second += line.amount;
    }
  }
  return { first, second };
}

export function studentTypeForLevel(level: string): StudentType {
  return level === "100L" ? "fresh" : "returning";
}

export function defaultLevelForStudentType(
  record: FeeDetailRecord,
  studentType: StudentType
): string {
  if (studentType === "fresh") {
    return (
      record.levels.find((level) => level.value === "100L")?.value ??
      record.defaultLevel
    );
  }
  return (
    record.levels.find((level) => level.value !== "100L")?.value ??
    record.defaultLevel
  );
}

export const MOCK_FEE_DETAILS: Record<string, FeeDetailRecord> = {
  "unilag-cs-100": {
    id: "unilag-cs-100",
    schoolSlug: "university-of-lagos",
    schoolName: "University of Lagos",
    course: "Computer Science",
    session: "2025/2026",
    programmeDuration: "4-year programme",
    sourceLabel: "Official source",
    source_type: "official_school_source",
    verification_status: "officially_verified",
    confidence_level: "high",
    lastReviewedAt: "2026-07-10",
    lastReviewedLabel: "10 July 2026",
    firstYearTotal: 285_000,
    returningYearTotal: 245_000,
    estimatedDegreeTotal: 1_025_000,
    evidence: {
      title: "2025/2026 fee circular",
      typeLabel: "PDF · official university source",
      url: "#",
    },
    reviewerNote:
      "Figures taken from the bursary's published 2025/2026 circular.",
    confirmationsCount: 4,
    levels: [
      { value: "100L", label: "100 Level" },
      { value: "200L", label: "200 Level" },
      { value: "300L", label: "300 Level" },
      { value: "400L", label: "400 Level" },
    ],
    defaultLevel: "100L",
    paymentPlans: [
      { value: "full", label: "Full session" },
      { value: "semester", label: "Per semester" },
    ],
    totalsByLevel: {
      "100L": {
        compulsory: 285_000,
        accommodation: 120_000,
        withAccommodation: 405_000,
      },
      "200L": {
        compulsory: 245_000,
        accommodation: 120_000,
        withAccommodation: 365_000,
      },
      "300L": {
        compulsory: 245_000,
        accommodation: 120_000,
        withAccommodation: 365_000,
      },
      "400L": {
        compulsory: 250_000,
        accommodation: 120_000,
        withAccommodation: 370_000,
      },
    },
    lines: [
      {
        id: "acceptance",
        name: "Acceptance fee",
        note: "One-time · fresh students only",
        category: "compulsory",
        due: "1st_sem",
        amount: 40_000,
        levels: ["100L"],
      },
      {
        id: "tuition",
        name: "Tuition and school charges",
        note: "Per session · split across semesters",
        category: "compulsory",
        due: "both",
        amount: 180_000,
      },
      {
        id: "faculty",
        name: "Faculty fee",
        note: "Per session",
        category: "compulsory",
        due: "1st_sem",
        amount: 25_000,
      },
      {
        id: "ict",
        name: "ICT fee",
        note: "Per session",
        category: "compulsory",
        due: "1st_sem",
        amount: 15_000,
      },
      {
        id: "medical",
        name: "Medical fee",
        note: "Per session",
        category: "compulsory",
        due: "1st_sem",
        amount: 10_000,
      },
      {
        id: "union",
        name: "Student union fee",
        note: "Per session",
        category: "compulsory",
        due: "1st_sem",
        amount: 15_000,
      },
      {
        id: "project",
        name: "Project & clearance fee",
        note: "One-time · final year",
        category: "compulsory",
        due: "2nd_sem",
        amount: 15_000,
        levels: ["400L"],
      },
      {
        id: "hostel",
        name: "Hostel accommodation",
        note: "Optional · paid at allocation",
        category: "optional",
        due: "1st_sem",
        amount: 120_000,
      },
    ],
  },
};

/** Alias common school fee list IDs to the CS breakdown for demo. */
export function getMockFeeDetail(id: string): FeeDetailRecord | null {
  if (MOCK_FEE_DETAILS[id]) return MOCK_FEE_DETAILS[id];

  const aliases: Record<string, string> = {
    "unilag-cs-200": "unilag-cs-100",
    "unilag-cs-300": "unilag-cs-100",
    "unilag-law-100": "unilag-cs-100",
    "unilag-nursing-100": "unilag-cs-100",
    "unilag-biz-100": "unilag-cs-100",
    "unilag-masscom-100": "unilag-cs-100",
    "unilag-law-200": "unilag-cs-100",
    "unilag-nursing-200": "unilag-cs-100",
    "unilag-biz-300": "unilag-cs-100",
  };

  const baseId = aliases[id];
  if (!baseId) return null;
  const base = MOCK_FEE_DETAILS[baseId];
  if (!base) return null;

  const courseFromId =
    id.includes("law")
      ? "Law"
      : id.includes("nursing")
        ? "Nursing Science"
        : id.includes("biz")
          ? "Business Administration"
          : id.includes("masscom")
            ? "Mass Communication"
            : base.course;

  const levelMatch = id.match(/(\d00)/);
  const defaultLevel = levelMatch ? `${levelMatch[1]}L` : base.defaultLevel;

  return {
    ...base,
    id,
    course: courseFromId,
    defaultLevel: base.levels.some((level) => level.value === defaultLevel)
      ? defaultLevel
      : base.defaultLevel,
  };
}

export function linesForLevel(
  record: FeeDetailRecord,
  level: string
): FeeBreakdownLine[] {
  const exactLines = record.linesByLevel?.[level];
  if (exactLines) return exactLines;

  return record.lines.filter(
    (line) => !line.levels || line.levels.includes(level)
  );
}
