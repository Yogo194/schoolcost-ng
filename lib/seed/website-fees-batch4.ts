/**
 * Cursor batch 4: popular schools with official or republished band schedules
 * (not per-course tables). Trust varies by source quality.
 */
import type { WebsiteSchoolSeed } from "./website-fees-batch1";

export const WEBSITE_FEE_BATCH4: WebsiteSchoolSeed[] = [
  {
    slug: "nnamdi-azikiwe-university",
    session: "2025/2026",
    startYear: 2025,
    endYear: 2026,
    sourceUrl:
      "https://myschool.ng/news/unizik-schedule-of-charges-for-the-2025-2026-academic-session-",
    evidenceDate: "2026-07-30",
    verificationStatus: "reported",
    confidenceLevel: "low",
    sourceType: "community_reported",
    evidenceSourceType: "public_school_notice",
    adminNote:
      "Community-reported UNIZIK 2025/2026 undergraduate schedule of charges republished from a university noticeboard. Flat university-wide bands (not per course). Acceptance ₦65,000 for new students not included. Confirm on the UNIZIK portal before paying.",
    fees: [
      {
        name: "Undergraduate programmes (all faculties)",
        amount: 162_500,
        returningAmount: 95_000,
        durationYears: 4,
        level: "University-wide UG band",
      },
    ],
  },
  {
    slug: "federal-university-of-technology-akure",
    session: "2025/2026",
    startYear: 2025,
    endYear: 2026,
    sourceUrl: "https://allschool.ng/futa-school-fees/",
    evidenceDate: "2026-07-30",
    verificationStatus: "reported",
    confidenceLevel: "low",
    sourceType: "community_reported",
    evidenceSourceType: "public_school_notice",
    adminNote:
      "Community-reported FUTA 2025/2026 schedule of charges (tuition free; totals are sundry charges) republished from the approved university schedule. Level bands only, not per course. Some departments add field-trip or professional accreditation on top. Confirm on the FUTA portal before paying.",
    fees: [
      {
        name: "Undergraduate programmes",
        amount: 258_000,
        returningAmount: 80_000,
        durationYears: 5,
        level: "University-wide level band",
        note: "Fresh/DE total ₦258,000; typical 200L returning ₦80,000. Source also lists 300L ₦85,000, 400L ₦68,000, 500L ₦75,000.",
      },
    ],
  },
  {
    slug: "university-of-benin",
    session: "2025/2026",
    startYear: 2025,
    endYear: 2026,
    sourceUrl: "https://uniben.edu/school_charges.html",
    evidenceDate: "2026-07-30",
    verificationStatus: "reported",
    confidenceLevel: "medium",
    sourceType: "official_school_source",
    evidenceSourceType: "official_school_webpage",
    adminNote:
      "From UNIBEN published school charges page (science / non-science bands). Official 2025/2026 notices state no increase from the prior regime. Small NUGA add-on (₦1,200 fresh / ₦250 returning) not folded in. Confirm exact invoice on portal.uniben.edu before paying.",
    fees: [
      {
        name: "Science programmes",
        amount: 95_000,
        returningAmount: 95_000,
        durationYears: 4,
        level: "Science band",
      },
      {
        name: "Non-science programmes",
        amount: 85_000,
        returningAmount: 85_000,
        durationYears: 4,
        level: "Non-science band",
      },
    ],
  },
  {
    slug: "federal-university-lafia",
    session: "2025/2026",
    startYear: 2025,
    endYear: 2026,
    sourceUrl: "https://myschool.ng/news/fulafia-schedule-of-fees",
    evidenceDate: "2026-07-30",
    verificationStatus: "reported",
    confidenceLevel: "low",
    sourceType: "community_reported",
    evidenceSourceType: "public_school_notice",
    adminNote:
      "Community-reported FULAFIA approved 2025/2026 fee schedule republished from the university release. Totals are summed from published line items (school fee, MIS, portal, online exam, faculty, TISHIP, SUG, e-learning, NUGA, accreditation, GST, library, medical test, matriculation where applicable) plus departmental registration charge by band. Acceptance listed separately and not included. Confirm on studenthub.fulafia.edu.ng before paying.",
    fees: [
      {
        name: "MBBS",
        amount: 162_000,
        returningAmount: 134_500,
        durationYears: 6,
        level: "MBBS band (incl. ₦75,000 departmental registration)",
      },
      {
        name: "Anatomy and Physiology",
        amount: 117_000,
        returningAmount: 89_500,
        durationYears: 4,
        level: "Anatomy & Physiology band (incl. ₦30,000 departmental registration)",
      },
      {
        name: "College of Health Sciences programmes",
        amount: 147_000,
        returningAmount: 119_500,
        durationYears: 5,
        level: "Health Sciences band (incl. ₦60,000 departmental registration)",
      },
      {
        name: "Other undergraduate programmes",
        amount: 95_000,
        returningAmount: 67_500,
        durationYears: 4,
        level: "Other departments band (incl. ₦8,000 departmental registration)",
      },
    ],
  },
];
