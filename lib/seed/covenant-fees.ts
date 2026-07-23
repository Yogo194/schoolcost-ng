/**
 * Covenant University approved national school fees, 2025/2026.
 *
 * Source (official admissions PDF):
 * https://admissions.covenantuniversity.edu.ng/wp-content/uploads/2025/09/APPROVED-SCHOOL-FEES-FOR-2025.pdf
 *
 * PDF lists annual NATIONAL totals only (not by level / fresh vs returning).
 * Note on PDF: fees cover tuition, examination, accommodation, sport,
 * medicals, ICT, ID card, EDS practical.
 *
 * Engineering is one priced line covering the named programmes; we store one
 * row per named engineering programme at that official rate (not invented).
 * International $ columns are omitted (national NGN only).
 */

export const COVENANT_SLUG = "covenant-university";
export const COVENANT_SESSION = "2025/2026";
export const COVENANT_SOURCE =
  "https://admissions.covenantuniversity.edu.ng/wp-content/uploads/2025/09/APPROVED-SCHOOL-FEES-FOR-2025.pdf";

export type CovenantProgramme = {
  college: string;
  name: string;
  /** Annual national fee (NGN) from the PDF. */
  national_fee: number;
  duration_years: number;
};

const ENGINEERING_FEE = 2_009_280;
const ENGINEERING_PROGRAMMES = [
  "Chemical Engineering",
  "Civil Engineering",
  "Computer Engineering",
  "Information and Communication Engineering",
  "Electrical and Electronics Engineering",
  "Mechanical Engineering",
  "Petroleum Engineering",
] as const;

export const COVENANT_PROGRAMMES: CovenantProgramme[] = [
  { college: "CLDS", name: "English", national_fee: 1_733_797.5, duration_years: 4 },
  {
    college: "CLDS",
    name: "International Relations",
    national_fee: 1_959_945,
    duration_years: 4,
  },
  {
    college: "CLDS",
    name: "Policy and Strategic Studies",
    national_fee: 1_733_797.5,
    duration_years: 4,
  },
  {
    college: "CLDS",
    name: "Political Science",
    national_fee: 1_733_797.5,
    duration_years: 4,
  },
  { college: "CLDS", name: "Psychology", national_fee: 1_884_562.5, duration_years: 4 },
  { college: "CMSS", name: "Accounting", national_fee: 1_959_945, duration_years: 4 },
  {
    college: "CMSS",
    name: "Business Administration",
    national_fee: 1_815_562.5,
    duration_years: 4,
  },
  { college: "CMSS", name: "Economics", national_fee: 1_959_945, duration_years: 4 },
  { college: "CMSS", name: "Finance", national_fee: 1_809_180, duration_years: 4 },
  {
    college: "CMSS",
    name: "Finance (Technology)",
    national_fee: 1_809_180,
    duration_years: 4,
  },
  {
    college: "CMSS",
    name: "Industrial Relations and Human Resource Management",
    national_fee: 1_713_891,
    duration_years: 4,
  },
  { college: "CMSS", name: "Marketing", national_fee: 1_713_891, duration_years: 4 },
  {
    college: "CMSS",
    name: "Mass Communication",
    national_fee: 1_959_945,
    duration_years: 4,
  },
  { college: "CMSS", name: "Sociology", national_fee: 1_742_940, duration_years: 4 },
  ...ENGINEERING_PROGRAMMES.map((name) => ({
    college: "CoE",
    name,
    national_fee: ENGINEERING_FEE,
    duration_years: 5,
  })),
  { college: "CST", name: "Architecture", national_fee: 1_959_945, duration_years: 4 },
  { college: "CST", name: "Biochemistry", national_fee: 1_821_931.2, duration_years: 4 },
  { college: "CST", name: "Biology", national_fee: 1_733_797.5, duration_years: 4 },
  {
    college: "CST",
    name: "Building Technology",
    national_fee: 1_809_180,
    duration_years: 4,
  },
  {
    college: "CST",
    name: "Computer Science",
    national_fee: 1_959_945,
    duration_years: 4,
  },
  {
    college: "CST",
    name: "Estate Management",
    national_fee: 1_733_797.5,
    duration_years: 4,
  },
  {
    college: "CST",
    name: "Industrial Chemistry",
    national_fee: 1_733_797.5,
    duration_years: 4,
  },
  {
    college: "CST",
    name: "Industrial Mathematics",
    national_fee: 1_897_845,
    duration_years: 4,
  },
  {
    college: "CST",
    name: "Industrial Physics",
    national_fee: 1_897_845,
    duration_years: 4,
  },
  {
    college: "CST",
    name: "Management Information Systems",
    national_fee: 1_884_562.5,
    duration_years: 4,
  },
  { college: "CST", name: "Microbiology", national_fee: 1_821_931.2, duration_years: 4 },
];
