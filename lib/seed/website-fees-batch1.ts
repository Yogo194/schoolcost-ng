/**
 * Cursor batch 1: fees scraped from official school websites.
 * Default trust: reported + medium + official_school_source until bursary review.
 * Override per school when the scrape is secondary, outdated, or a circular PDF.
 */
import type {
  ConfidenceLevel,
  EvidenceSourceType,
  SourceType,
  VerificationStatus,
} from "@/types/database";

export type WebsiteFeeRow = {
  name: string;
  amount: number;
  returningAmount?: number;
  durationYears?: number;
  level?: string;
  note?: string;
};

export type WebsiteSchoolSeed = {
  slug: string;
  session: string;
  startYear: number;
  endYear: number;
  sourceUrl: string;
  evidenceDate: string;
  adminNote: string;
  fees: WebsiteFeeRow[];
  /** Defaults: reported / medium / official_school_source */
  verificationStatus?: VerificationStatus;
  confidenceLevel?: ConfidenceLevel;
  sourceType?: SourceType;
  evidenceSourceType?: EvidenceSourceType;
};

export const DEFAULT_WEBSITE_FEE_TRUST = {
  verificationStatus: "reported" as const,
  confidenceLevel: "medium" as const,
  sourceType: "official_school_source" as const,
  evidenceSourceType: "public_school_notice" as const,
};

export const WEBSITE_FEE_BATCH1: WebsiteSchoolSeed[] = [
  {
    slug: "nile-university-of-nigeria",
    session: "2026/2027",
    startYear: 2026,
    endYear: 2027,
    sourceUrl: "https://nileuniversity.edu.ng/tuition-fees/",
    evidenceDate: "2026-07-30",
    adminNote:
      "Scraped from Nile University official tuition page for 2026/2027. Amounts are fee per session. Accommodation not included. Confirm on the school portal before paying.",
    fees: [
      { name: "Medicine & Surgery", amount: 7_150_000, durationYears: 6 },
      { name: "Human Anatomy", amount: 3_750_000, durationYears: 4 },
      { name: "Human Physiology", amount: 3_750_000, durationYears: 4 },
      { name: "Public Health", amount: 4_000_000, durationYears: 4 },
      { name: "Medical Laboratory Science", amount: 3_500_000, durationYears: 5 },
      { name: "Nursing Sciences", amount: 3_500_000, durationYears: 5 },
      { name: "Law", amount: 4_550_000, durationYears: 5 },
      { name: "Civil Engineering", amount: 3_950_000, durationYears: 5 },
      { name: "Computer Engineering", amount: 3_950_000, durationYears: 5 },
      { name: "Electrical & Electronics Engineering", amount: 3_200_000, durationYears: 5 },
      { name: "Mechanical Engineering", amount: 3_200_000, durationYears: 5 },
      { name: "Petroleum & Gas Engineering", amount: 3_200_000, durationYears: 5 },
      { name: "Mechatronics", amount: 3_950_000, durationYears: 5 },
      { name: "Chemical Engineering", amount: 3_200_000, durationYears: 5 },
      { name: "Information & Communication Engineering", amount: 3_200_000, durationYears: 5 },
      { name: "Architecture", amount: 3_950_000, durationYears: 4 },
      { name: "Urban & Regional Planning", amount: 3_200_000, durationYears: 5 },
      { name: "Quantity Surveying", amount: 3_200_000, durationYears: 5 },
      { name: "Building", amount: 3_200_000, durationYears: 5 },
      { name: "Estate Management", amount: 3_200_000, durationYears: 5 },
      { name: "Geo-Informatics & Surveying", amount: 3_200_000, durationYears: 5 },
      { name: "Biochemistry", amount: 3_000_000, durationYears: 4 },
      { name: "Microbiology", amount: 3_200_000, durationYears: 4 },
      { name: "Biotechnology", amount: 3_200_000, durationYears: 4 },
      { name: "Industrial Chemistry", amount: 3_000_000, durationYears: 4 },
      { name: "Biology", amount: 3_000_000, durationYears: 4 },
      {
        name: "Science Laboratory Technology",
        amount: 3_000_000,
        durationYears: 5,
      },
      { name: "Software Engineering", amount: 3_950_000, durationYears: 4 },
      { name: "Computer Science", amount: 3_750_000, durationYears: 4 },
      { name: "Information Technology", amount: 3_750_000, durationYears: 4 },
      { name: "Cyber Security", amount: 3_950_000, durationYears: 4 },
      { name: "Data Science", amount: 3_200_000, durationYears: 4 },
      { name: "Information System", amount: 3_750_000, durationYears: 4 },
      { name: "Accounting", amount: 3_450_000, durationYears: 4 },
      { name: "Banking and Finance", amount: 3_200_000, durationYears: 4 },
      { name: "Business Administration", amount: 3_450_000, durationYears: 4 },
      { name: "Public Administration", amount: 3_200_000, durationYears: 4 },
      { name: "Marketing", amount: 3_200_000, durationYears: 4 },
      { name: "Entrepreneurship", amount: 3_200_000, durationYears: 4 },
      {
        name: "Logistics & Supply Chain Management",
        amount: 3_200_000,
        durationYears: 4,
      },
      {
        name: "Criminology & Security Studies",
        amount: 3_200_000,
        durationYears: 4,
      },
      { name: "Economics", amount: 3_450_000, durationYears: 4 },
      {
        name: "Petroleum Economics and Policy Studies",
        amount: 3_200_000,
        durationYears: 4,
      },
      { name: "Mass Communication", amount: 3_550_000, durationYears: 4 },
      {
        name: "Political Science & International Relations",
        amount: 3_750_000,
        durationYears: 4,
      },
      { name: "Broadcasting", amount: 3_350_000, durationYears: 4 },
      { name: "Film & Multimedia Studies", amount: 3_350_000, durationYears: 4 },
      { name: "Psychology", amount: 3_200_000, durationYears: 4 },
      { name: "Sociology", amount: 3_200_000, durationYears: 4 },
      {
        name: "Peace Studies & Conflict Resolution",
        amount: 3_200_000,
        durationYears: 4,
      },
    ],
  },
  {
    slug: "edo-state-university",
    session: "2025/2026",
    startYear: 2025,
    endYear: 2026,
    sourceUrl: "https://edouniversity.edu.ng/ug-fee-description",
    evidenceDate: "2026-07-30",
    adminNote:
      "Scraped from Edo State University official UG fee page for 2025/2026. Fresh school fees excluding accommodation. Clinical add-ons for MBBS/Nursing/MLS from 300L are noted separately and not folded into these totals. Confirm on the school portal before paying.",
    fees: [
      { name: "Nursing", amount: 1_844_375, durationYears: 5 },
      { name: "Medical Laboratory Science", amount: 1_225_625, durationYears: 5 },
      { name: "History and International Studies", amount: 328_500, durationYears: 4 },
      { name: "Mass Communication", amount: 514_200, durationYears: 4 },
      { name: "English", amount: 205_650, durationYears: 4 },
      { name: "Broadcasting", amount: 428_500, durationYears: 4 },
      { name: "Journalism and Media Studies", amount: 378_500, durationYears: 4 },
      { name: "Biochemistry", amount: 328_500, durationYears: 4 },
      { name: "Anatomy", amount: 328_500, durationYears: 4 },
      { name: "Physiology", amount: 228_500, durationYears: 4 },
      {
        name: "Medicine and Surgery",
        amount: 3_900_600,
        durationYears: 6,
        note: "Additional clinical fees from 300L apply per school page.",
      },
      { name: "Mechanical Engineering", amount: 603_500, durationYears: 5 },
      { name: "Electrical/Electronic Engineering", amount: 603_500, durationYears: 5 },
      { name: "Chemical Engineering", amount: 603_500, durationYears: 5 },
      { name: "Mechatronics Engineering", amount: 603_500, durationYears: 5 },
      { name: "Computer Engineering", amount: 603_500, durationYears: 5 },
      { name: "Civil Engineering", amount: 603_500, durationYears: 5 },
      { name: "Law", amount: 1_991_250, durationYears: 5 },
      { name: "Public Administration", amount: 228_500, durationYears: 4 },
      { name: "Political Science", amount: 328_500, durationYears: 4 },
      {
        name: "Peace Studies and Conflict Resolution",
        amount: 205_650,
        durationYears: 4,
      },
      { name: "Entrepreneurship", amount: 328_500, durationYears: 4 },
      { name: "Economics", amount: 328_500, durationYears: 4 },
      { name: "Sociology", amount: 228_500, durationYears: 4 },
      { name: "Accounting", amount: 450_000, durationYears: 4 },
      { name: "Business Administration", amount: 394_200, durationYears: 4 },
      { name: "Banking and Finance", amount: 228_500, durationYears: 4 },
      { name: "Mathematics", amount: 228_500, durationYears: 4 },
      { name: "Software Engineering", amount: 603_500, durationYears: 4 },
      { name: "Cyber Security", amount: 603_500, durationYears: 4 },
      {
        name: "Plant Biology and Biotechnology",
        amount: 228_500,
        durationYears: 4,
      },
      { name: "Physics with Electronics", amount: 228_500, durationYears: 4 },
      { name: "Microbiology", amount: 328_500, durationYears: 4 },
      { name: "Industrial Chemistry", amount: 228_500, durationYears: 4 },
      { name: "Computer Science", amount: 603_500, durationYears: 4 },
      {
        name: "Animal and Environmental Biology",
        amount: 228_500,
        durationYears: 4,
      },
    ],
  },
  {
    slug: "air-force-institute-of-technology-kaduna",
    session: "2025/2026",
    startYear: 2025,
    endYear: 2026,
    sourceUrl:
      "https://afit.edu.ng/home/amp/schedule-of-sundry-fees-for-2025-2026-academic-session/",
    evidenceDate: "2026-07-30",
    adminNote:
      "Scraped from AFIT official 2025/2026 schedule of fees. Tuition is free; totals are sundry charges. Fresh totals include one-off acceptance and related charges listed on the page. Accommodation is optional and not included. Confirm on the AFIT portal before paying.",
    fees: [
      {
        name: "Aerospace Engineering",
        amount: 136_300,
        returningAmount: 99_800,
        durationYears: 5,
        level: "Faculty band: Aerospace Engineering",
      },
      {
        name: "Other Engineering",
        amount: 128_500,
        returningAmount: 92_000,
        durationYears: 5,
        level: "Faculty band: Other Engineering",
      },
      {
        name: "Sciences",
        amount: 113_500,
        returningAmount: 74_500,
        durationYears: 4,
        level: "Faculty band: Sciences",
      },
      {
        name: "Ground and Communication Engineering",
        amount: 128_500,
        returningAmount: 92_000,
        durationYears: 5,
        level: "Faculty band: Ground and Communication Engineering",
      },
      {
        name: "Computing",
        amount: 103_500,
        returningAmount: 67_000,
        durationYears: 4,
        level: "Faculty band: Computing",
      },
      {
        name: "Social and Management Science",
        amount: 98_500,
        returningAmount: 67_000,
        durationYears: 4,
        level: "Faculty band: Social and Management Science",
      },
    ],
  },
  {
    slug: "elizade-university",
    session: "2026/2027",
    startYear: 2026,
    endYear: 2027,
    sourceUrl:
      "https://www.elizadeuniversity.edu.ng/docsUpload/feeStructure.pdf",
    evidenceDate: "2026-07-30",
    adminNote:
      "From Elizade University official 2026/2027 academic fees PDF (also stored at /evidence/fees/elizade-2026-2027-fee-structure.pdf). Academic fees cover tuition, exams, registration, accommodation and listed amenities; feeding excluded. Freshers also pay ₦100,000 acceptance (not included here). Nursing/MLS clinical add-on from later levels not folded into these totals. Confirm on the school portal before paying.",
    fees: [
      { name: "English", amount: 1_300_000, returningAmount: 1_250_000, durationYears: 4 },
      {
        name: "Performing and Film Arts",
        amount: 1_300_000,
        returningAmount: 1_250_000,
        durationYears: 4,
      },
      {
        name: "International Relations",
        amount: 1_300_000,
        returningAmount: 1_250_000,
        durationYears: 4,
      },
      { name: "Accounting", amount: 1_350_000, returningAmount: 1_300_000, durationYears: 4 },
      {
        name: "Business Administration",
        amount: 1_400_000,
        returningAmount: 1_350_000,
        durationYears: 4,
      },
      { name: "Economics", amount: 1_400_000, returningAmount: 1_350_000, durationYears: 4 },
      {
        name: "Human Resource Management",
        amount: 1_400_000,
        returningAmount: 1_350_000,
        durationYears: 4,
      },
      {
        name: "Mass Communication",
        amount: 1_400_000,
        returningAmount: 1_350_000,
        durationYears: 4,
      },
      {
        name: "Political Science",
        amount: 1_400_000,
        returningAmount: 1_350_000,
        durationYears: 4,
      },
      { name: "Sociology", amount: 1_400_000, returningAmount: 1_350_000, durationYears: 4 },
      {
        name: "Tourism and Hospitality Management",
        amount: 1_400_000,
        returningAmount: 1_350_000,
        durationYears: 4,
      },
      {
        name: "Nursing Science",
        amount: 3_050_000,
        returningAmount: 2_800_000,
        durationYears: 5,
      },
      {
        name: "Medical Laboratory Science",
        amount: 3_050_000,
        returningAmount: 2_800_000,
        durationYears: 5,
      },
      { name: "Law", amount: 3_050_000, returningAmount: 2_800_000, durationYears: 5 },
      // Basic & applied sciences band
      {
        name: "Applied Geophysics",
        amount: 1_650_000,
        returningAmount: 1_600_000,
        durationYears: 4,
      },
      { name: "Anatomy", amount: 1_650_000, returningAmount: 1_600_000, durationYears: 4 },
      {
        name: "Physics and Electronics",
        amount: 1_650_000,
        returningAmount: 1_600_000,
        durationYears: 4,
      },
      {
        name: "Biotechnology",
        amount: 1_650_000,
        returningAmount: 1_600_000,
        durationYears: 4,
      },
      {
        name: "Biochemistry",
        amount: 1_650_000,
        returningAmount: 1_600_000,
        durationYears: 4,
      },
      {
        name: "Microbiology",
        amount: 1_650_000,
        returningAmount: 1_600_000,
        durationYears: 4,
      },
      {
        name: "Environmental Management and Toxicology",
        amount: 1_650_000,
        returningAmount: 1_600_000,
        durationYears: 4,
      },
      {
        name: "Physiology",
        amount: 1_650_000,
        returningAmount: 1_600_000,
        durationYears: 4,
      },
      {
        name: "Computer Science",
        amount: 1_650_000,
        returningAmount: 1_600_000,
        durationYears: 4,
      },
      {
        name: "Cybersecurity",
        amount: 1_650_000,
        returningAmount: 1_600_000,
        durationYears: 4,
      },
      {
        name: "Software Engineering",
        amount: 1_650_000,
        returningAmount: 1_600_000,
        durationYears: 4,
      },
      {
        name: "Public Health",
        amount: 1_650_000,
        returningAmount: 1_600_000,
        durationYears: 4,
      },
      // Environmental sciences band
      {
        name: "Architecture",
        amount: 1_500_000,
        returningAmount: 1_450_000,
        durationYears: 4,
      },
      {
        name: "Estate Management",
        amount: 1_500_000,
        returningAmount: 1_450_000,
        durationYears: 4,
      },
      {
        name: "Quantity Surveying",
        amount: 1_500_000,
        returningAmount: 1_450_000,
        durationYears: 4,
      },
      // Engineering band
      {
        name: "Automotive Engineering",
        amount: 1_600_000,
        returningAmount: 1_550_000,
        durationYears: 5,
      },
      {
        name: "Civil Engineering",
        amount: 1_600_000,
        returningAmount: 1_550_000,
        durationYears: 5,
      },
      {
        name: "Computer Engineering",
        amount: 1_600_000,
        returningAmount: 1_550_000,
        durationYears: 5,
      },
      {
        name: "Electrical and Electronics Engineering",
        amount: 1_600_000,
        returningAmount: 1_550_000,
        durationYears: 5,
      },
      {
        name: "Information and Communication Engineering",
        amount: 1_600_000,
        returningAmount: 1_550_000,
        durationYears: 5,
      },
      {
        name: "Mechanical Engineering",
        amount: 1_600_000,
        returningAmount: 1_550_000,
        durationYears: 5,
      },
      {
        name: "Mechatronics",
        amount: 1_600_000,
        returningAmount: 1_550_000,
        durationYears: 5,
      },
    ],
  },
  {
    slug: "clifford-university",
    session: "2026/2027",
    startYear: 2026,
    endYear: 2027,
    sourceUrl: "https://clifforduni.edu.ng/fees-charges/",
    evidenceDate: "2026-07-30",
    adminNote:
      "Scraped from Clifford University official fees page for 2026/2027. Programme amounts shown; acceptance (₦150,000) and matriculation (₦50,000 for 100L) are listed separately and not included here. Confirm on the school portal before paying.",
    fees: [
      { name: "Computer Science", amount: 845_000, durationYears: 4 },
      { name: "Cyber Security", amount: 845_000, durationYears: 4 },
      { name: "Information System", amount: 845_000, durationYears: 4 },
      { name: "Chemistry", amount: 845_000, durationYears: 4 },
      { name: "Biochemistry", amount: 845_000, durationYears: 4 },
      { name: "Industrial Chemistry", amount: 845_000, durationYears: 4 },
      { name: "Biology", amount: 845_000, durationYears: 4 },
      { name: "Microbiology", amount: 845_000, durationYears: 4 },
      { name: "Mathematics", amount: 845_000, durationYears: 4 },
      { name: "Physics", amount: 845_000, durationYears: 4 },
      { name: "Nursing Science", amount: 1_740_000, durationYears: 5 },
      { name: "Medical Laboratory Science", amount: 1_560_000, durationYears: 5 },
      { name: "Public Health", amount: 1_293_500, durationYears: 4 },
      { name: "Environmental Health", amount: 1_293_500, durationYears: 4 },
      { name: "Business Administration", amount: 825_500, durationYears: 4 },
      { name: "Accounting", amount: 825_500, durationYears: 4 },
      { name: "Economics", amount: 825_500, durationYears: 4 },
      { name: "Banking & Finance", amount: 825_500, durationYears: 4 },
      { name: "Marketing", amount: 825_500, durationYears: 4 },
      { name: "Political Science", amount: 825_500, durationYears: 4 },
      { name: "Public Administration", amount: 825_500, durationYears: 4 },
      { name: "Mass Communication", amount: 825_500, durationYears: 4 },
      { name: "International Relations", amount: 825_500, durationYears: 4 },
      {
        name: "Industrial Relations & Personnel Management",
        amount: 825_500,
        durationYears: 4,
      },
      {
        name: "Library & Information Science",
        amount: 825_500,
        durationYears: 4,
      },
      {
        name: "History & Diplomatic Studies",
        amount: 819_000,
        durationYears: 4,
      },
      { name: "English Literature", amount: 819_000, durationYears: 4 },
      { name: "English Language", amount: 819_000, durationYears: 4 },
      { name: "Computer Education", amount: 819_000, durationYears: 4 },
      { name: "Guidance & Counselling", amount: 819_000, durationYears: 4 },
      {
        name: "Christian Religious Studies",
        amount: 715_000,
        durationYears: 4,
      },
      { name: "Law", amount: 1_740_000, durationYears: 5 },
      { name: "Social Justice", amount: 825_500, durationYears: 4 },
    ],
  },
];
