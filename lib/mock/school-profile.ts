import type { InstitutionType, OwnershipType, SourceType } from "@/types/database";
import {
  getSchoolFeeCoverage,
  type SchoolFeeCoverage,
} from "@/lib/fees/school-fee-coverage";

export interface SchoolFeeRow {
  id: string;
  course: string;
  level: string;
  compulsory_total: number;
  session: string;
  source_type: SourceType;
}

export interface SchoolProfile {
  slug: string;
  name: string;
  abbreviation: string;
  city: string;
  state: string;
  institution_type: InstitutionType;
  ownership_type: OwnershipType;
  website_url: string;
  website_label: string;
  logo_url: string;
  /** Compact verification badge in hero. */
  source_badge: "official" | "community" | "student";
  courses_listed: number;
  first_year_min: number;
  first_year_max: number;
  payment_options: string[];
  sessions: string[];
  levels: string[];
  courses: string[];
  fees: SchoolFeeRow[];
  /**
   * True when at least one published row passes canUseForPriceComparison.
   * Drives whether the profile may use "verified" language.
   */
  has_price_comparable_fees: boolean;
  /** How fee coverage is presented (courses vs official bands). */
  fee_coverage: SchoolFeeCoverage;
}

export const MOCK_SCHOOL_PROFILES: Record<string, SchoolProfile> = {
  "university-of-lagos": {
    slug: "university-of-lagos",
    name: "University of Lagos",
    abbreviation: "UNILAG",
    city: "Akoka",
    state: "Lagos",
    institution_type: "university",
    ownership_type: "federal",
    website_url: "https://unilag.edu.ng",
    website_label: "unilag.edu.ng",
    logo_url: "/figma/school-unilag-crest.png",
    source_badge: "official",
    courses_listed: 5,
    first_year_min: 255_000,
    first_year_max: 340_000,
    payment_options: ["Per semester", "Full session"],
    sessions: ["2026/2027", "2025/2026", "2024/2025"],
    levels: ["100L", "200L", "300L", "400L"],
    courses: [
      "Computer Science",
      "Law",
      "Nursing Science",
      "Business Administration",
      "Mass Communication",
    ],
    fees: [
      {
        id: "unilag-cs-100",
        course: "Computer Science",
        level: "100L",
        compulsory_total: 185_500,
        session: "2025/2026",
        source_type: "official_school_source",
      },
      {
        id: "unilag-law-100",
        course: "Law",
        level: "100L",
        compulsory_total: 198_000,
        session: "2025/2026",
        source_type: "student_portal_evidence",
      },
      {
        id: "unilag-nursing-100",
        course: "Nursing Science",
        level: "100L",
        compulsory_total: 215_000,
        session: "2025/2026",
        source_type: "community_reported",
      },
      {
        id: "unilag-biz-100",
        course: "Business Administration",
        level: "100L",
        compulsory_total: 172_500,
        session: "2025/2026",
        source_type: "student_portal_evidence",
      },
      {
        id: "unilag-cs-200",
        course: "Computer Science",
        level: "200L",
        compulsory_total: 168_000,
        session: "2025/2026",
        source_type: "official_fee_circular",
      },
      {
        id: "unilag-masscom-100",
        course: "Mass Communication",
        level: "100L",
        compulsory_total: 165_000,
        session: "2025/2026",
        source_type: "community_reported",
      },
      {
        id: "unilag-law-200",
        course: "Law",
        level: "200L",
        compulsory_total: 182_000,
        session: "2025/2026",
        source_type: "official_school_source",
      },
      {
        id: "unilag-nursing-200",
        course: "Nursing Science",
        level: "200L",
        compulsory_total: 205_000,
        session: "2025/2026",
        source_type: "community_reported",
      },
      {
        id: "unilag-cs-300",
        course: "Computer Science",
        level: "300L",
        compulsory_total: 160_000,
        session: "2025/2026",
        source_type: "official_fee_circular",
      },
      {
        id: "unilag-biz-300",
        course: "Business Administration",
        level: "300L",
        compulsory_total: 155_000,
        session: "2025/2026",
        source_type: "student_portal_evidence",
      },
    ],
    has_price_comparable_fees: true,
    fee_coverage: getSchoolFeeCoverage("university-of-lagos"),
  },
};

export function getMockSchoolProfile(slug: string): SchoolProfile | null {
  return MOCK_SCHOOL_PROFILES[slug] ?? null;
}

export function filterSchoolFees(
  fees: SchoolFeeRow[],
  filters: {
    course?: string;
    level?: string;
    session?: string;
  }
): SchoolFeeRow[] {
  return fees.filter((fee) => {
    if (filters.course && filters.course !== "all" && fee.course !== filters.course) {
      return false;
    }
    if (filters.level && filters.level !== "all" && fee.level !== filters.level) {
      return false;
    }
    if (filters.session && filters.session !== "all" && fee.session !== filters.session) {
      return false;
    }
    return true;
  });
}
