/**
 * Bells University of Technology official fee bands, 2025/2026.
 *
 * Sources (official PDFs linked from admissions/schools-fees):
 * https://www.bellsuniversity.edu.ng/wp-content/uploads/2025/09/Approved-2025_2026-school-fees-schedule_-1.pdf
 * https://www.bellsuniversity.edu.ng/wp-content/uploads/2025/09/Approved-2025_2026-school-fees-schedule_2.pdf
 *
 * Category/programme-group bands as published (not invented course rows).
 * Line items match the PDF fee description rows.
 */

export const BELLS_SLUG = "bells-university-of-technology";
export const BELLS_SESSION = "2025/2026";
export const BELLS_SOURCE =
  "https://www.bellsuniversity.edu.ng/admissions/schools-fees/";
export const BELLS_PDF_100 =
  "https://www.bellsuniversity.edu.ng/wp-content/uploads/2025/09/Approved-2025_2026-school-fees-schedule_-1.pdf";
export const BELLS_PDF_RETURNING =
  "https://www.bellsuniversity.edu.ng/wp-content/uploads/2025/09/Approved-2025_2026-school-fees-schedule_2.pdf";

/** Shared across all undergraduate bands on the official schedule. */
export const BELLS_SHARED = {
  library_development: 30_000,
  examination_fee: 50_000,
  infrastructural_dev_fee: 50_000,
  accommodation: 180_000,
  e_library_kortext: 103_000,
  busa_fees: 5_000,
  new_horizon: 40_000,
  maintenance: 50_000,
  sport: 10_000,
  bupf: 25_000,
  hmo: 45_000,
  /** 100L only */
  acceptance_fee: 100_000,
  tablet: 100_000,
  medical_screening: 77_000,
} as const;

export type BellsBand = {
  name: string;
  duration_years: number;
  tuition: number;
  ict_fees: number;
  laboratory_studio_workshop: number;
  /** Official 200-500L subtotal (sanity check). */
  returning_total: number;
  /** Official 100L total (sanity check). */
  fresher_total: number;
};

export const BELLS_BANDS: BellsBand[] = [
  {
    name: "College of Management Sciences (COLMANS)",
    duration_years: 4,
    tuition: 453_750,
    ict_fees: 10_000,
    laboratory_studio_workshop: 50_000,
    returning_total: 1_101_750,
    fresher_total: 1_378_750,
  },
  {
    name: "Other Sciences",
    duration_years: 4,
    tuition: 453_750,
    ict_fees: 10_000,
    laboratory_studio_workshop: 100_000,
    returning_total: 1_151_750,
    fresher_total: 1_428_750,
  },
  {
    name: "Computer / IT",
    duration_years: 4,
    tuition: 453_750,
    ict_fees: 30_000,
    laboratory_studio_workshop: 150_000,
    returning_total: 1_221_750,
    fresher_total: 1_498_750,
  },
  {
    name: "Mathematics / Physics / Chemistry / Biotechnology (tuition waived)",
    duration_years: 4,
    tuition: 0,
    ict_fees: 10_000,
    laboratory_studio_workshop: 150_000,
    returning_total: 748_000,
    fresher_total: 1_025_000,
  },
  {
    name: "Foods Technology and Nutrition and Dietetics",
    duration_years: 5,
    tuition: 453_750,
    ict_fees: 10_000,
    laboratory_studio_workshop: 100_000,
    returning_total: 1_151_750,
    fresher_total: 1_428_750,
  },
  {
    name: "Other tuition-waived programmes",
    duration_years: 4,
    tuition: 0,
    ict_fees: 10_000,
    laboratory_studio_workshop: 150_000,
    returning_total: 748_000,
    fresher_total: 1_025_000,
  },
  {
    name: "Architecture",
    duration_years: 4,
    tuition: 453_750,
    ict_fees: 30_000,
    laboratory_studio_workshop: 150_000,
    returning_total: 1_221_750,
    fresher_total: 1_498_750,
  },
  {
    name: "Estate Management / Surveying and Geoinformatics",
    duration_years: 5,
    tuition: 453_750,
    ict_fees: 10_000,
    laboratory_studio_workshop: 100_000,
    returning_total: 1_151_750,
    fresher_total: 1_428_750,
  },
  {
    name: "Urban and Regional Planning / Building / Quantity Surveying (tuition waived)",
    duration_years: 5,
    tuition: 0,
    ict_fees: 10_000,
    laboratory_studio_workshop: 150_000,
    returning_total: 748_000,
    fresher_total: 1_025_000,
  },
  {
    name: "Agricultural Engineering",
    duration_years: 5,
    tuition: 453_750,
    ict_fees: 30_000,
    laboratory_studio_workshop: 150_000,
    returning_total: 1_221_750,
    fresher_total: 1_498_750,
  },
  {
    name: "Agricultural and Bio-Resources Engineering (tuition waived)",
    duration_years: 5,
    tuition: 0,
    ict_fees: 30_000,
    laboratory_studio_workshop: 150_000,
    returning_total: 768_000,
    fresher_total: 1_045_000,
  },
];
