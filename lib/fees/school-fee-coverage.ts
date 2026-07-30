/**
 * How we present fee coverage on a school profile when the official source
 * is bands/categories rather than a full course matrix.
 */

export type FeeCoverageKind = "courses" | "bands";

export type SchoolFeeCoverage = {
  kind: FeeCoverageKind;
  /** Short notice shown above the fees table. */
  notice: string;
  /** Optional official source link for readers. */
  sourceUrl?: string;
  sourceLabel?: string;
  /** Stats bar label for the count card. */
  coverageLabel: string;
  /** Fees table section title. */
  sectionTitle: string;
  /** Fees table supporting sentence. */
  sectionDescription: string;
  /** Filter dropdown label for the first column. */
  categoryFilterLabel: string;
  /** Default level filter value. */
  defaultLevelFilter: string;
  /** Range card eyebrow. */
  rangeEyebrow: string;
  rangeDescription: string;
};

const COURSE_DEFAULT: SchoolFeeCoverage = {
  kind: "courses",
  notice: "",
  coverageLabel: "Courses with verified fees",
  sectionTitle: "Course fees",
  sectionDescription:
    "Verified compulsory fees by course and level. Open any row for the full breakdown.",
  categoryFilterLabel: "Course",
  defaultLevelFilter: "100L",
  rangeEyebrow: "First-year · 100L",
  rangeDescription: "Compulsory fee range across courses",
};

/**
 * Fallback for schools whose published rows all fail canUseForPriceComparison.
 * Never claim "verified" for figures we have not verified.
 */
const COURSE_REPORTED: SchoolFeeCoverage = {
  kind: "courses",
  notice: "",
  coverageLabel: "Courses with reported fees",
  sectionTitle: "Reported course fees",
  sectionDescription:
    "Reported compulsory fees by course and level. Not yet verified, so they are excluded from lowest-cost highlights. Open any row for the full breakdown.",
  categoryFilterLabel: "Course",
  defaultLevelFilter: "100L",
  rangeEyebrow: "First-year · 100L reported",
  rangeDescription: "Reported fee range across courses",
};

const BAND_SCHOOLS: Record<string, SchoolFeeCoverage> = {
  "adekunle-ajasin-university": {
    kind: "courses",
    notice:
      "These are community-reported annual figures for 2026/2027 from a secondary source. AAUA has not published a matching public fee schedule that we can verify, so the figures are excluded from lowest-cost highlights and verified comparisons. Confirm on the AAUA portal before paying.",
    sourceUrl:
      "https://admissiontrend.com.ng/adekunle-ajasin-university-school-fees-for-all-courses/",
    sourceLabel: "View the community-reported source",
    coverageLabel: "Community-reported course figures",
    sectionTitle: "Reported course fees",
    sectionDescription:
      "Annual figures reported by a secondary source. They are useful for early planning, not payment decisions.",
    categoryFilterLabel: "Course",
    defaultLevelFilter: "all",
    rangeEyebrow: "Reported annual figures",
    rangeDescription: "Not yet verified by AAUA",
  },
  "university-of-ibadan": {
    kind: "courses",
    notice:
      "These are Total Levy amounts for 2025/2026 taken from a republished NELFUND fee schedule, not a circular published on ui.edu.ng. The acceptance fee for fresh students comes from an official UI notice. Hostel is not on this schedule. Confirm on the UI portal before paying.",
    sourceUrl:
      "https://www.scribd.com/document/984233555/Summarized-Nelfund-Fee-2025-2026",
    sourceLabel: "View the republished NELFUND schedule",
    coverageLabel: "Courses with reported levies",
    sectionTitle: "Course fees",
    sectionDescription:
      "Total Levy by course and level as published on the NELFUND schedule. Open any row for the full breakdown.",
    categoryFilterLabel: "Course",
    defaultLevelFilter: "100L",
    rangeEyebrow: "First-year · 100L total levy",
    rangeDescription: "Total Levy range across courses",
  },
  "university-of-lagos": {
    kind: "bands",
    notice:
      "UNILAG publishes obligatory fees by category (lab / non-lab / medical), not by every course. Figures below are from the official 2023/2024 revised schedule on unilag.edu.ng. Your portal pay advice is the final amount for your programme.",
    sourceUrl:
      "https://unilag.edu.ng/important-notice-on-revised-obligatory-fees-and-modalities-for-refund-of-overpayment/",
    sourceLabel: "Official revised obligatory fees notice",
    coverageLabel: "Official fee bands listed",
    sectionTitle: "Fee bands",
    sectionDescription:
      "Official category totals for fresh and returning students. Not a full course-by-course matrix.",
    categoryFilterLabel: "Fee band",
    defaultLevelFilter: "all",
    rangeEyebrow: "Freshers · official bands",
    rangeDescription: "Compulsory range across published fee bands",
  },
  "obafemi-awolowo-university": {
    kind: "bands",
    notice:
      "OAU publishes faculty bands, not course-by-course fees. These figures come from its official 2023/2024 announcement. Check your student portal before paying.",
    sourceUrl: "https://oauife.edu.ng/oau-announces-new-fees-payable-by-students/",
    sourceLabel: "Official OAU fee announcement",
    coverageLabel: "Official fee bands listed",
    sectionTitle: "Fee bands",
    sectionDescription:
      "Official faculty-band totals for fresh and returning students. Not a full course-by-course matrix.",
    categoryFilterLabel: "Fee band",
    defaultLevelFilter: "all",
    rangeEyebrow: "Freshers · official bands",
    rangeDescription: "Compulsory range across published fee bands",
  },
  "federal-university-oye-ekiti": {
    kind: "bands",
    notice:
      "FUOYE publishes undergraduate sundry fees by faculty band, not by every course. Figures below are from the official 2025/2026 eCampus schedule (acceptance and medical registration included on fresher rows). Confirm on the student portal before paying.",
    sourceUrl: "https://www.ecampus.fuoye.edu.ng/regsteps.php",
    sourceLabel: "Official FUOYE eCampus fee schedule",
    coverageLabel: "Official fee bands listed",
    sectionTitle: "Fee bands",
    sectionDescription:
      "Official full-time undergraduate sundry bands for fresh and returning students. Not a full course-by-course matrix.",
    categoryFilterLabel: "Fee band",
    defaultLevelFilter: "all",
    rangeEyebrow: "Freshers · official bands",
    rangeDescription: "Compulsory range across published fee bands",
  },
  "adeleke-university": {
    kind: "bands",
    notice:
      "Adeleke publishes residential SESSION BILLs by faculty band and level, not by every course. The official 2025/2026 PDF also shows semester and instalment payment schedules, but does not split tuition vs hostel or other fee types. Non-residential and part-time schedules are omitted here.",
    sourceUrl:
      "https://adelekeuniversity.edu.ng/wp-content/uploads/2025/08/Adeleke-University-2025-2026-School-fees.pdf",
    sourceLabel: "Official Adeleke 2025/2026 fee PDF",
    coverageLabel: "Official fee bands listed",
    sectionTitle: "Fee bands",
    sectionDescription:
      "Official residential faculty-band session bills. Not a full course-by-course matrix.",
    categoryFilterLabel: "Fee band",
    defaultLevelFilter: "all",
    rangeEyebrow: "Freshers · residential bands",
    rangeDescription: "Compulsory range across published fee bands",
  },
  "bells-university-of-technology": {
    kind: "bands",
    notice:
      "Bells publishes fees by programme group / college band. Figures below are from the official 2025/2026 schedule PDFs. Open any row for the full line-item breakdown (tuition, accommodation, ICT, HMO, and 100L extras such as acceptance and tablet).",
    sourceUrl: "https://www.bellsuniversity.edu.ng/admissions/schools-fees/",
    sourceLabel: "Official Bells school fees page",
    coverageLabel: "Official fee bands listed",
    sectionTitle: "Fee bands",
    sectionDescription:
      "Official category totals for fresh and returning students. Open a row for the component breakdown.",
    categoryFilterLabel: "Fee band",
    defaultLevelFilter: "all",
    rangeEyebrow: "Freshers · official bands",
    rangeDescription: "Compulsory range across published fee bands",
  },
  "chrisland-university": {
    kind: "bands",
    notice:
      "Chrisland publishes fees by programme group (Mass Comm, Accounting, Nursing, Law, etc.), not every course. Open any row for the official line-item breakdown (tuition, accommodation, Classera, SRC, New Horizons, and clinical where listed).",
    sourceUrl:
      "https://www.chrislanduniversity.edu.ng/contents/schedule-of-fees.html",
    sourceLabel: "Official Chrisland schedule of fees",
    coverageLabel: "Official fee bands listed",
    sectionTitle: "Fee bands",
    sectionDescription:
      "Official programme-group fees by level. Open a row for the component breakdown.",
    categoryFilterLabel: "Fee band",
    defaultLevelFilter: "all",
    rangeEyebrow: "Freshers · official bands",
    rangeDescription: "Compulsory range across published fee bands",
  },
  "babcock-university": {
    kind: "courses",
    notice:
      "Official instructional fees from babcock.edu.ng. Other charges are listed separately.",
    sourceUrl: "https://babcock.edu.ng/admission/tuition-and-fees",
    sourceLabel: "Official Babcock tuition and fees",
    coverageLabel: "Courses with verified fees",
    sectionTitle: "Course fees",
    sectionDescription:
      "Official instructional fees by course and level. Open any row for miscellaneous charges shown separately.",
    categoryFilterLabel: "Course",
    defaultLevelFilter: "100L",
    rangeEyebrow: "First-year · 100L instructional",
    rangeDescription: "Instructional fee range across courses",
  },
  "covenant-university": {
    kind: "courses",
    notice:
      "Covenant publishes one annual NATIONAL package total per programme. The official PDF note lists what the package covers (tuition, examination, accommodation, sport, medicals, ICT, ID, EDS practical) but does not publish separate Naira amounts for those lines. International columns are omitted here.",
    sourceUrl:
      "https://admissions.covenantuniversity.edu.ng/wp-content/uploads/2025/09/APPROVED-SCHOOL-FEES-FOR-2025.pdf",
    sourceLabel: "Official Covenant approved school fees PDF",
    coverageLabel: "Courses with verified fees",
    sectionTitle: "Course fees",
    sectionDescription:
      "Official national package totals by programme. Source does not split component amounts.",
    categoryFilterLabel: "Course",
    defaultLevelFilter: "all",
    rangeEyebrow: "National package · undergraduate",
    rangeDescription: "Compulsory national package range across programmes",
  },
};

/**
 * Hand-written BAND_SCHOOLS copy always wins: it already states the exact
 * provenance for that school. Everything else falls back to trust-aware
 * defaults so a newly seeded, unverified school never inherits "verified"
 * language just because nobody hardcoded an entry for it.
 */
export function getSchoolFeeCoverage(
  slug: string,
  options?: { hasPriceComparableFees?: boolean }
): SchoolFeeCoverage {
  const explicit = BAND_SCHOOLS[slug];
  if (explicit) return explicit;
  return options?.hasPriceComparableFees === false
    ? COURSE_REPORTED
    : COURSE_DEFAULT;
}
