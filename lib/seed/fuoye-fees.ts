/**
 * FUOYE undergraduate full-time sundry fee bands, 2025/2026.
 *
 * Primary sources (official):
 * - https://www.ecampus.fuoye.edu.ng/regsteps.php
 * - https://fuoye.edu.ng/academic-fees/ (flipbook; confirmed via screenshots)
 *
 * Bands only as published. Part-time rows omitted from this seed.
 * Hostel / incidental fees omitted from compulsory totals (optional extras).
 */

export const FUOYE_SLUG = "federal-university-oye-ekiti";
export const FUOYE_SESSION = "2025/2026";
export const FUOYE_SOURCE = "https://www.ecampus.fuoye.edu.ng/regsteps.php";
export const FUOYE_FLIPBOOK = "https://fuoye.edu.ng/academic-fees/";

export type FuoyeAcceptanceGroup =
  | "arts_science"
  | "basic_med_law_pharm"
  | "comm_eng_mgmt_social";

export type FuoyeBand = {
  name: string;
  fresher: number;
  /** Returning amount when the schedule has a single returning rate. */
  returning?: number;
  /** Separate 200L returning rate when published. */
  returning_200?: number;
  acceptance_group: FuoyeAcceptanceGroup;
  duration_years: number;
};

export const FUOYE_ACCEPTANCE: Record<FuoyeAcceptanceGroup, number> = {
  arts_science: 80_000,
  basic_med_law_pharm: 100_000,
  comm_eng_mgmt_social: 90_000,
};

export const FUOYE_MEDICAL_REGISTRATION = 20_000;

export const FUOYE_BANDS: FuoyeBand[] = [
  {
    name: "Arts, Social Science, Management Sciences and Education",
    fresher: 190_000,
    returning: 80_000,
    acceptance_group: "arts_science",
    duration_years: 4,
  },
  {
    name: "Science, Science Education, Agriculture",
    fresher: 190_000,
    returning: 90_000,
    acceptance_group: "arts_science",
    duration_years: 5,
  },
  {
    name: "Anatomy and Physiology",
    fresher: 240_000,
    returning_200: 145_000,
    returning: 100_000,
    acceptance_group: "basic_med_law_pharm",
    duration_years: 4,
  },
  {
    name: "Faculty of Medicine and Surgery",
    fresher: 390_000,
    returning: 265_000,
    acceptance_group: "basic_med_law_pharm",
    duration_years: 6,
  },
  {
    name: "Environmental Design and Management and Engineering",
    fresher: 240_000,
    returning: 100_000,
    acceptance_group: "comm_eng_mgmt_social",
    duration_years: 5,
  },
  {
    name: "Communication and Media Studies, Computing and Information Engineering",
    fresher: 225_500,
    returning: 100_000,
    acceptance_group: "comm_eng_mgmt_social",
    duration_years: 5,
  },
  {
    name: "Law, Nursing, Medical Lab Science, Radiology and Pharmacy",
    fresher: 290_000,
    returning_200: 145_000,
    returning: 135_000,
    acceptance_group: "basic_med_law_pharm",
    duration_years: 5,
  },
];
