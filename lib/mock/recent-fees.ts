import type { OwnershipType, SourceType } from "@/types/database";

/** Homepage "Recently verified fees" display cap (matches Figma: 10 body rows). */
export const RECENT_FEES_LIMIT = 10;

export type RecentFeeTab = "all" | OwnershipType;

export interface RecentFeeRow {
  id: string;
  level: string | null;
  first_year_total: number;
  source_type: SourceType;
  institutions: {
    name: string;
    abbreviation: string | null;
    city: string | null;
    state: string;
    ownership_type: OwnershipType;
    slug: string;
  };
  courses: { name: string };
  academic_sessions: { name: string };
}

/**
 * Design-time mock rows: enough variety to exercise every ownership tab,
 * course lengths, levels, fee scales, and the three compact source badges.
 * Ordered newest-first (as live query will be).
 */
export const MOCK_RECENT_FEES: RecentFeeRow[] = [
  {
    id: "unilag-cs-100",
    level: "100L",
    first_year_total: 185_500,
    source_type: "official_school_source",
    institutions: {
      name: "University of Lagos",
      abbreviation: "UNILAG",
      city: "Lagos",
      state: "Lagos",
      ownership_type: "federal",
      slug: "university-of-lagos",
    },
    courses: { name: "Computer Science" },
    academic_sessions: { name: "2025/2026" },
  },
  {
    id: "mock-covenant-nursing-100",
    level: "100L",
    first_year_total: 2_450_000,
    source_type: "student_portal_evidence",
    institutions: {
      name: "Covenant University",
      abbreviation: "CU",
      city: "Ota",
      state: "Ogun",
      ownership_type: "private",
      slug: "covenant-university",
    },
    courses: { name: "Nursing Science" },
    academic_sessions: { name: "2025/2026" },
  },
  {
    id: "mock-ui-medicine-100",
    level: "100L",
    first_year_total: 312_000,
    source_type: "community_reported",
    institutions: {
      name: "University of Ibadan",
      abbreviation: "UI",
      city: "Ibadan",
      state: "Oyo",
      ownership_type: "federal",
      slug: "university-of-ibadan",
    },
    courses: { name: "Medicine and Surgery" },
    academic_sessions: { name: "2025/2026" },
  },
  {
    id: "mock-lasu-law-100",
    level: "100L",
    first_year_total: 275_000,
    source_type: "official_fee_circular",
    institutions: {
      name: "Lagos State University",
      abbreviation: "LASU",
      city: "Ojo",
      state: "Lagos",
      ownership_type: "state",
      slug: "lagos-state-university",
    },
    courses: { name: "Law" },
    academic_sessions: { name: "2025/2026" },
  },
  {
    id: "mock-babcock-accounting-100",
    level: "100L",
    first_year_total: 1_890_000,
    source_type: "payment_invoice",
    institutions: {
      name: "Babcock University",
      abbreviation: "BU",
      city: "Ilishan-Remo",
      state: "Ogun",
      ownership_type: "private",
      slug: "babcock-university",
    },
    courses: { name: "Accounting" },
    academic_sessions: { name: "2025/2026" },
  },
  {
    id: "mock-oau-eng-100",
    level: "100L",
    first_year_total: 198_750,
    source_type: "official_school_source",
    institutions: {
      name: "Obafemi Awolowo University",
      abbreviation: "OAU",
      city: "Ile-Ife",
      state: "Osun",
      ownership_type: "federal",
      slug: "obafemi-awolowo-university",
    },
    courses: { name: "Electrical Engineering" },
    academic_sessions: { name: "2025/2026" },
  },
  {
    id: "mock-uniben-pharm-100",
    level: "100L",
    first_year_total: 241_000,
    source_type: "community_reported",
    institutions: {
      name: "University of Benin",
      abbreviation: "UNIBEN",
      city: "Benin City",
      state: "Edo",
      ownership_type: "federal",
      slug: "university-of-benin",
    },
    courses: { name: "Pharmacy" },
    academic_sessions: { name: "2024/2025" },
  },
  {
    id: "mock-rsust-masscom-100",
    level: "100L",
    first_year_total: 165_000,
    source_type: "student_portal_evidence",
    institutions: {
      name: "Rivers State University",
      abbreviation: "RSU",
      city: "Port Harcourt",
      state: "Rivers",
      ownership_type: "state",
      slug: "rivers-state-university",
    },
    courses: { name: "Mass Communication" },
    academic_sessions: { name: "2025/2026" },
  },
  {
    id: "mock-abuad-law-100",
    level: "100L",
    first_year_total: 2_100_000,
    source_type: "official_school_source",
    institutions: {
      name: "Afe Babalola University",
      abbreviation: "ABUAD",
      city: "Ado-Ekiti",
      state: "Ekiti",
      ownership_type: "private",
      slug: "afe-babalola-university",
    },
    courses: { name: "Law" },
    academic_sessions: { name: "2025/2026" },
  },
  {
    id: "mock-unizik-cs-200",
    level: "200L",
    first_year_total: 156_200,
    source_type: "official_fee_circular",
    institutions: {
      name: "Nnamdi Azikiwe University",
      abbreviation: "UNIZIK",
      city: "Awka",
      state: "Anambra",
      ownership_type: "federal",
      slug: "nnamdi-azikiwe-university",
    },
    courses: { name: "Computer Science" },
    academic_sessions: { name: "2025/2026" },
  },
  {
    id: "mock-unical-edu-100",
    level: "100L",
    first_year_total: 148_000,
    source_type: "community_reported",
    institutions: {
      name: "University of Calabar",
      abbreviation: "UNICAL",
      city: "Calabar",
      state: "Cross River",
      ownership_type: "federal",
      slug: "university-of-calabar",
    },
    courses: { name: "Education" },
    academic_sessions: { name: "2024/2025" },
  },
  {
    id: "mock-eksu-biochem-100",
    level: "100L",
    first_year_total: 192_500,
    source_type: "student_portal_evidence",
    institutions: {
      name: "Ekiti State University",
      abbreviation: "EKSU",
      city: "Ado-Ekiti",
      state: "Ekiti",
      ownership_type: "state",
      slug: "ekiti-state-university",
    },
    courses: { name: "Biochemistry" },
    academic_sessions: { name: "2025/2026" },
  },
  {
    id: "mock-landmark-biz-100",
    level: "100L",
    first_year_total: 1_350_000,
    source_type: "payment_invoice",
    institutions: {
      name: "Landmark University",
      abbreviation: "LMU",
      city: "Omu-Aran",
      state: "Kwara",
      ownership_type: "private",
      slug: "landmark-university",
    },
    courses: { name: "Business Administration" },
    academic_sessions: { name: "2025/2026" },
  },
  {
    id: "mock-abu-agric-100",
    level: "100L",
    first_year_total: 132_800,
    source_type: "official_school_source",
    institutions: {
      name: "Ahmadu Bello University",
      abbreviation: "ABU",
      city: "Zaria",
      state: "Kaduna",
      ownership_type: "federal",
      slug: "ahmadu-bello-university",
    },
    courses: { name: "Agriculture" },
    academic_sessions: { name: "2025/2026" },
  },
];

export function filterRecentFees(
  rows: RecentFeeRow[],
  tab: RecentFeeTab,
  limit = RECENT_FEES_LIMIT
): RecentFeeRow[] {
  const filtered =
    tab === "all"
      ? rows
      : rows.filter((row) => row.institutions.ownership_type === tab);
  return filtered.slice(0, limit);
}
