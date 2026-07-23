/**
 * Adeleke University residential session bills by faculty band, 2025/2026.
 *
 * Source (official PDF):
 * https://adelekeuniversity.edu.ng/wp-content/uploads/2025/08/Adeleke-University-2025-2026-School-fees.pdf
 *
 * Residential summary only. Non-residential / conversion / part-time / JUPEB
 * omitted from this seed. Bands as published (not invented course rows).
 */

export const ADELEKE_SLUG = "adeleke-university";
export const ADELEKE_SESSION = "2025/2026";
export const ADELEKE_SOURCE =
  "https://adelekeuniversity.edu.ng/wp-content/uploads/2025/08/Adeleke-University-2025-2026-School-fees.pdf";

export type AdelekeBandRow = {
  level: string;
  student_type: "fresh" | "returning";
  session_bill: number;
};

export type AdelekeBand = {
  name: string;
  duration_years: number;
  rows: AdelekeBandRow[];
};

export const ADELEKE_BANDS: AdelekeBand[] = [
  {
    name: "Faculty of Business and Social Sciences (Others)",
    duration_years: 4,
    rows: [
      { level: "100L", student_type: "fresh", session_bill: 1_805_200 },
      { level: "200L-300L", student_type: "returning", session_bill: 1_750_200 },
      { level: "400L", student_type: "returning", session_bill: 1_910_200 },
    ],
  },
  {
    name: "Faculty of Business and Social Sciences (Mass Communication)",
    duration_years: 4,
    rows: [
      { level: "100L", student_type: "fresh", session_bill: 1_986_000 },
      { level: "200L-300L", student_type: "returning", session_bill: 1_847_240 },
      { level: "400L", student_type: "returning", session_bill: 2_007_240 },
    ],
  },
  {
    name: "Faculty of Business and Social Sciences (Accounting)",
    duration_years: 4,
    rows: [
      { level: "100L", student_type: "fresh", session_bill: 1_945_200 },
      { level: "200L", student_type: "returning", session_bill: 1_805_710 },
      { level: "300L", student_type: "returning", session_bill: 1_665_710 },
      { level: "400L", student_type: "returning", session_bill: 1_825_710 },
    ],
  },
  {
    name: "Faculty of Basic Medical Sciences (Nursing)",
    duration_years: 5,
    rows: [
      { level: "100L", student_type: "fresh", session_bill: 2_893_000 },
      { level: "200L-400L", student_type: "returning", session_bill: 2_485_312.5 },
      { level: "500L", student_type: "returning", session_bill: 2_725_312.5 },
    ],
  },
  {
    name: "Faculty of Basic Medical Sciences (Medical Laboratory Science)",
    duration_years: 5,
    rows: [
      { level: "100L", student_type: "fresh", session_bill: 2_737_450 },
      { level: "200L-400L", student_type: "returning", session_bill: 2_439_875 },
      { level: "500L", student_type: "returning", session_bill: 2_689_875 },
    ],
  },
  {
    name: "Faculty of Basic Medical Sciences (Public Health)",
    duration_years: 4,
    rows: [
      { level: "100L", student_type: "fresh", session_bill: 2_118_650 },
      { level: "200L-300L", student_type: "returning", session_bill: 1_998_550 },
      { level: "400L", student_type: "returning", session_bill: 2_238_550 },
    ],
  },
  {
    name: "Faculty of Basic Medical Sciences (Anatomy and Physiology)",
    duration_years: 4,
    rows: [
      { level: "100L", student_type: "fresh", session_bill: 1_861_050 },
      { level: "200L-300L", student_type: "returning", session_bill: 1_763_350 },
      { level: "400L", student_type: "returning", session_bill: 1_923_350 },
    ],
  },
  {
    name: "Faculty of Science (Computer Science, Cybersecurity, Info Tech, Software Engineering)",
    duration_years: 4,
    rows: [
      { level: "100L", student_type: "fresh", session_bill: 1_931_650 },
      { level: "200L-300L", student_type: "returning", session_bill: 1_796_580 },
      { level: "400L", student_type: "returning", session_bill: 1_956_580 },
    ],
  },
  {
    name: "Faculty of Science (Biochemistry and Microbiology)",
    duration_years: 4,
    rows: [
      { level: "100L", student_type: "fresh", session_bill: 1_791_375 },
      { level: "200L-300L", student_type: "returning", session_bill: 1_697_125 },
      { level: "400L", student_type: "returning", session_bill: 1_857_125 },
    ],
  },
  {
    name: "Faculty of Science (Mathematics, Physics, Chemistry and Biology)",
    duration_years: 4,
    rows: [
      { level: "100L", student_type: "fresh", session_bill: 1_741_375 },
      { level: "200L-300L", student_type: "returning", session_bill: 1_647_125 },
      { level: "400L", student_type: "returning", session_bill: 1_807_125 },
    ],
  },
  {
    name: "Faculty of Arts (History)",
    duration_years: 4,
    rows: [
      { level: "100L", student_type: "fresh", session_bill: 1_764_950 },
      { level: "200L-300L", student_type: "returning", session_bill: 1_668_650 },
      { level: "400L", student_type: "returning", session_bill: 1_888_650 },
    ],
  },
  {
    name: "Faculty of Arts (Others)",
    duration_years: 4,
    rows: [
      { level: "100L", student_type: "fresh", session_bill: 1_664_062.5 },
      { level: "200L-300L", student_type: "returning", session_bill: 1_572_187.5 },
      { level: "400L", student_type: "returning", session_bill: 1_732_187.5 },
    ],
  },
  {
    name: "Faculty of Engineering (Agriculture)",
    duration_years: 5,
    rows: [
      { level: "100L", student_type: "fresh", session_bill: 1_815_000 },
      { level: "200L-400L", student_type: "returning", session_bill: 1_752_500 },
      { level: "500L", student_type: "returning", session_bill: 1_992_500 },
    ],
  },
  {
    name: "Faculty of Engineering (Electrical, Mechanical and Civil)",
    duration_years: 5,
    rows: [
      { level: "100L", student_type: "fresh", session_bill: 2_064_500 },
      { level: "200L-400L", student_type: "returning", session_bill: 1_893_580 },
      { level: "500L", student_type: "returning", session_bill: 2_133_580 },
    ],
  },
  {
    name: "Faculty of Engineering (Computer and Chemical Engineering)",
    duration_years: 5,
    rows: [
      { level: "100L", student_type: "fresh", session_bill: 2_114_500 },
      { level: "200L-400L", student_type: "returning", session_bill: 1_943_580 },
      { level: "500L", student_type: "returning", session_bill: 2_183_580 },
    ],
  },
  {
    name: "Faculty of Law",
    duration_years: 5,
    rows: [
      { level: "100L", student_type: "fresh", session_bill: 2_910_000 },
      { level: "200L-400L", student_type: "returning", session_bill: 2_683_050 },
      { level: "500L", student_type: "returning", session_bill: 2_843_050 },
    ],
  },
];
