/**
 * UNILAG revised obligatory fee bands (official notice).
 *
 * Primary source:
 * https://unilag.edu.ng/important-notice-on-revised-obligatory-fees-and-modalities-for-refund-of-overpayment/
 *
 * Related:
 * https://unilag.edu.ng/adjusted-obligatory-fees-for-new-and-returning-undergraduate-students/
 *
 * Session on source: revision for 2023/2024 obligatory charges.
 * We store session as 2023/2024 (year the schedule was published for).
 * No course-level matrix: bands only, as published.
 *
 * Utility ₦15,000 (all undergraduates) and Toxicology ₦10,000 (new students)
 * are stated as additional charges on the same official notice.
 */

export const UNILAG_SLUG = "university-of-lagos";
export const UNILAG_SESSION = "2023/2024";
export const UNILAG_SOURCE =
  "https://unilag.edu.ng/important-notice-on-revised-obligatory-fees-and-modalities-for-refund-of-overpayment/";

export const UNILAG_UTILITY = 15_000;
export const UNILAG_TOXICOLOGY = 10_000;

export type UnilagBand = {
  name: string;
  student_type: "fresh" | "returning";
  level: string;
  obligatory: number;
  include_toxicology: boolean;
  duration_years: number;
};

export const UNILAG_BANDS: UnilagBand[] = [
  {
    name: "Courses without lab/studio",
    student_type: "fresh",
    level: "100L",
    obligatory: 116_325,
    include_toxicology: true,
    duration_years: 4,
  },
  {
    name: "Courses with lab/studio",
    student_type: "fresh",
    level: "100L",
    obligatory: 166_300,
    include_toxicology: true,
    duration_years: 4,
  },
  {
    name: "Courses without lab/studio",
    student_type: "returning",
    level: "200L+",
    obligatory: 80_750,
    include_toxicology: false,
    duration_years: 4,
  },
  {
    name: "Courses with lab/studio",
    student_type: "returning",
    level: "200L+",
    obligatory: 120_250,
    include_toxicology: false,
    duration_years: 4,
  },
  {
    name: "Medical / Pharmacy / Health professions",
    student_type: "returning",
    level: "200L+",
    obligatory: 170_250,
    include_toxicology: false,
    duration_years: 5,
  },
];
