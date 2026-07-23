/**
 * OAU Senate-adjusted undergraduate fee bands.
 *
 * Primary source (official):
 * https://oauife.edu.ng/oau-announces-new-fees-payable-by-students/
 *
 * Approved at Senate meeting Tuesday 12 September 2023 for the upcoming
 * academic year. Stored session: 2023/2024 (publication year on the notice).
 * No newer official course matrix found at seed time.
 *
 * Bands only, as published. No invented course rows.
 */

export const OAU_SLUG = "obafemi-awolowo-university";
export const OAU_SESSION = "2023/2024";
export const OAU_SOURCE =
  "https://oauife.edu.ng/oau-announces-new-fees-payable-by-students/";

export type OauBand = {
  name: string;
  fresher: number;
  returning: number;
  duration_years: number;
};

export const OAU_BANDS: OauBand[] = [
  {
    name: "Arts, Law and Humanities",
    fresher: 151_200,
    returning: 89_200,
    duration_years: 4,
  },
  {
    name: "Technology and Science",
    fresher: 163_200,
    returning: 101_200,
    duration_years: 5,
  },
  {
    name: "College of Health Sciences and Pharmacy",
    fresher: 190_200,
    returning: 128_200,
    duration_years: 6,
  },
];
