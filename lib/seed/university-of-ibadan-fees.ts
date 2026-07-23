/**
 * University of Ibadan undergraduate Total Levy schedule for 2025/2026.
 *
 * Primary source: Summarised NELFUND Fee Schedule 2025/2026
 * https://www.scribd.com/document/984233555/Summarized-Nelfund-Fee-2025-2026
 *
 * Acceptance fee (fresh students only): official UI notice, ₦50,000
 * https://ui.edu.ng/news/utme-direct-entry-acceptance-fee-payment-prospective-candidates-20252026-admission-exercise
 *
 * Amounts are Total Levy only. No invented tech/utility splits.
 * Hostel is omitted (not on this schedule).
 */

export const UI_INSTITUTION_SLUG = "university-of-ibadan";
export const UI_FEE_SESSION = "2025/2026";
export const UI_ACCEPTANCE_FEE = 50_000;

export const UI_FEE_SOURCES = {
  nelfundSchedule:
    "https://www.scribd.com/document/984233555/Summarized-Nelfund-Fee-2025-2026",
  acceptanceNotice:
    "https://ui.edu.ng/news/utme-direct-entry-acceptance-fee-payment-prospective-candidates-20252026-admission-exercise",
} as const;

/** Null means N/A on the schedule (level does not apply). */
export type UiLevyBand = {
  fresher_100: number | null;
  fresher_200_de: number | null;
  fresher_300_de?: number | null;
  returning_200: number | null;
  returning_300: number | null;
  returning_400: number | null;
  returning_500?: number | null;
  graduating_600?: number | null;
};

export type UiSeedCourse = {
  faculty: string;
  name: string;
  levies: UiLevyBand;
};

function band(
  fresher_100: number | null,
  fresher_200_de: number | null,
  returning_200: number | null,
  returning_300: number | null,
  returning_400: number | null,
  returning_500: number | null = null,
  graduating_600: number | null = null,
  fresher_300_de: number | null = null
): UiLevyBand {
  return {
    fresher_100,
    fresher_200_de,
    fresher_300_de,
    returning_200,
    returning_300,
    returning_400,
    returning_500,
    graduating_600,
  };
}

const SCIENCE = band(281_500, 281_500, 255_550, 258_550, 143_050);
const SCIENCE_LAB = band(281_500, 283_000, 257_050, 258_550, 143_050);
const SCIENCE_ANTHRO = band(281_500, 293_000, 267_050, 268_550, 153_050);
const SCIENCE_BOTANY = band(281_500, 281_500, 255_550, 268_550, 153_050);
const SCIENCE_COMPUTER = band(281_500, 281_500, 255_550, 260_050, 136_050, 133_050);
const SCIENCE_MATH = band(281_500, 283_000, 257_050, 260_050, 143_050);
const SCIENCE_GEOLOGY = band(291_500, 291_500, 265_550, 268_550, 153_050);

const ECONS = band(176_500, 176_500, 150_550, 152_050, 91_050);
const SOC_GEO = band(176_500, 176_500, 150_550, 153_550, 91_050);
const PSYCHOLOGY = band(226_500, 226_500, 200_550, 202_050, 141_050);
const LAW = band(177_500, 177_500, 151_550, 153_050, 82_050, 87_050);

const TECH = band(281_500, 283_000, 257_050, 258_550, 136_050, 133_050, null, 284_500);

const AGRIC = band(281_500, 286_500, 260_550, 262_050, 143_550, 133_050);
const RENEWABLE = band(281_500, 281_500, 255_550, 257_050, 153_550, 133_050);
const PHARMACY = band(281_500, 297_000, 271_050, 274_050, 150_050, 138_550, 148_550);
const VET = band(281_500, 307_500, 281_550, 280_050, 159_050, 149_050, 154_050);

const EDU_BASE = band(176_500, 176_500, 150_550, 157_050, 96_050);
const EDU_ADULT = band(176_500, 186_500, 160_550, 167_050, 106_050);
const EDU_LIBRARY = band(176_500, 176_500, 150_550, 153_550, 91_050);
const EDU_TEACHER_ARTS = band(226_500, 226_500, 200_550, 157_050, 96_050);
const EDU_TEACHER_SCI = band(281_500, 281_500, 255_550, 262_050, 148_050);

const ARTS_ANTHRO = band(206_500, 218_000, 192_050, 193_550, 101_050);
const ARTS_CLASSICS = band(226_500, 226_500, 200_550, 152_050, 91_050);
const ARTS_ENGLISH = band(206_500, 211_500, 185_550, 187_050, 91_050);
const ARTS_PHILOSOPHY = band(176_500, 176_500, 150_550, 152_050, 91_050);
const ARTS_THEATRE = band(226_500, 231_500, 205_550, 157_050, 91_050);
const ARTS_MUSIC = band(206_500, 206_500, 180_550, 182_050, 91_050);

const ARCHITECTURE = band(286_500, 286_500, 260_550, 262_050, 198_050, null, null, 288_000);
const ENV_DESIGN = band(231_500, 231_500, 205_550, 207_050, 136_050, 136_050, null, 233_000);

function many(
  faculty: string,
  names: string[],
  levies: UiLevyBand
): UiSeedCourse[] {
  return names.map((name) => ({ faculty, name, levies }));
}

export const UI_SEED_COURSES: UiSeedCourse[] = [
  // Faculty disambiguators on shared programme names keep course slugs unique.
  ...many(
    "Science",
    ["Anthropology (Science)", "Archaeology (Science)"],
    SCIENCE_ANTHRO
  ),
  { faculty: "Science", name: "Botany", levies: SCIENCE_BOTANY },
  { faculty: "Science", name: "Chemistry", levies: SCIENCE_LAB },
  { faculty: "Science", name: "Computer Science", levies: SCIENCE_COMPUTER },
  {
    faculty: "Science",
    name: "Geography (Science)",
    levies: SCIENCE,
  },
  ...many("Science", ["Microbiology", "Statistics"], SCIENCE),
  ...many("Science", ["Physics", "Zoology"], SCIENCE_LAB),
  { faculty: "Science", name: "Mathematics", levies: SCIENCE_MATH },
  { faculty: "Science", name: "Geology", levies: SCIENCE_GEOLOGY },

  ...many(
    "Economics",
    [
      "Economics",
      "Accounting",
      "Banking and Finance",
      "Marketing and Consumer Studies",
    ],
    ECONS
  ),
  {
    faculty: "Social Sciences",
    name: "Geography (Social Sciences)",
    levies: SOC_GEO,
  },
  ...many("Social Sciences", ["Political Science", "Sociology"], ECONS),
  { faculty: "Social Sciences", name: "Psychology", levies: PSYCHOLOGY },
  { faculty: "Law", name: "Law", levies: LAW },

  {
    faculty: "Clinical Sciences",
    name: "Medicine and Surgery",
    levies: band(281_500, 356_500, 330_550, 344_050, 245_050, 235_050, 233_050),
  },
  {
    faculty: "Clinical Sciences",
    name: "Nursing",
    levies: band(281_500, 351_500, 325_550, 355_550, 231_550, 218_050),
  },
  {
    faculty: "Clinical Sciences",
    name: "Physiotherapy",
    levies: band(281_500, 351_500, 325_550, 317_050, 194_550, 193_050),
  },
  {
    faculty: "Basic Medical Science",
    name: "Biochemistry",
    levies: band(281_500, 301_500, 275_550, 278_550, 163_050),
  },
  {
    faculty: "Basic Medical Science",
    name: "Biomedical Laboratory Science",
    levies: band(281_500, 351_500, 330_550, 354_050, 230_050, 218_050),
  },
  {
    faculty: "Basic Medical Science",
    name: "Physiology",
    levies: band(281_500, 301_500, 275_550, 277_050, 163_050),
  },
  {
    faculty: "Dentistry",
    name: "Dental Surgery",
    levies: band(281_500, 356_500, 330_550, 344_050, 245_050, 235_050, 233_050),
  },
  {
    faculty: "Public Health",
    name: "Human Nutrition",
    levies: band(281_500, 331_500, 305_550, 328_550, 213_050),
  },
  {
    faculty: "Public Health",
    name: "Environmental Health Science",
    levies: band(281_500, 331_500, 305_550, 328_550, 203_050, 203_050),
  },

  ...many(
    "Technology",
    [
      "Agricultural and Environmental Engineering",
      "Civil Engineering",
      "Industrial and Production Engineering",
      "Food Technology",
      "Electrical and Electronic Engineering",
      "Mechanical Engineering",
      "Petroleum Engineering",
      "Wood Products Engineering",
      "Automotive Engineering",
    ],
    TECH
  ),

  ...many(
    "Agriculture",
    [
      "Agricultural Economics",
      "Agricultural Extension and Rural Development",
      "Agronomy",
      "Animal Science",
      "Crop Protection and Environmental Biology",
    ],
    AGRIC
  ),
  ...many(
    "Renewable Natural Resources",
    [
      "Aquaculture and Fisheries Management",
      "Forest Production and Products",
      "Social and Environmental Forestry",
      "Wildlife and Ecotourism Management",
    ],
    RENEWABLE
  ),
  { faculty: "Pharmacy", name: "Pharmacy", levies: PHARMACY },
  { faculty: "Veterinary Medicine", name: "Veterinary Medicine", levies: VET },

  { faculty: "Education", name: "Adult Education", levies: EDU_ADULT },
  ...many(
    "Education",
    [
      "Educational Management",
      "Guidance and Counselling",
      "Education",
      "Special Education",
      "Early Childhood and Educational Foundation",
    ],
    EDU_BASE
  ),
  {
    faculty: "Education",
    name: "Library, Archival and Information Studies",
    levies: EDU_LIBRARY,
  },
  {
    faculty: "Education",
    name: "Teacher Education Arts and Social Science",
    levies: EDU_TEACHER_ARTS,
  },
  {
    faculty: "Education",
    name: "Teacher Education Science and Technology",
    levies: EDU_TEACHER_SCI,
  },

  ...many(
    "Arts",
    ["Anthropology (Arts)", "Archaeology (Arts)"],
    ARTS_ANTHRO
  ),
  ...many(
    "Arts",
    ["Classics", "Communication and Language Arts"],
    ARTS_CLASSICS
  ),
  ...many(
    "Arts",
    [
      "English",
      "European Studies",
      "Linguistics and African Languages",
      "Religious Studies",
    ],
    ARTS_ENGLISH
  ),
  { faculty: "Arts", name: "Philosophy", levies: ARTS_PHILOSOPHY },
  ...many("Arts", ["Theatre Arts", "History"], ARTS_THEATRE),
  ...many("Arts", ["Music", "Arabic and Islamic Studies"], ARTS_MUSIC),

  {
    faculty: "Environmental Design and Management",
    name: "Architecture",
    levies: ARCHITECTURE,
  },
  ...many(
    "Environmental Design and Management",
    [
      "Urban and Regional Planning",
      "Estate Management",
      "Quantity Surveying",
    ],
    ENV_DESIGN
  ),
];

export type UiFeeSlot = {
  level: string;
  student_type: "fresh" | "returning";
  is_direct_entry: boolean;
  total_levy: number;
};

export function expandCourseLevies(course: UiSeedCourse): UiFeeSlot[] {
  const { levies } = course;
  const slots: UiFeeSlot[] = [];

  const push = (
    level: string,
    student_type: "fresh" | "returning",
    amount: number | null | undefined,
    is_direct_entry = false
  ) => {
    if (amount == null) return;
    slots.push({ level, student_type, is_direct_entry, total_levy: amount });
  };

  push("100L", "fresh", levies.fresher_100);
  push("200L DE", "fresh", levies.fresher_200_de, true);
  push("300L DE", "fresh", levies.fresher_300_de, true);
  push("200L", "returning", levies.returning_200);
  push("300L", "returning", levies.returning_300);
  push("400L", "returning", levies.returning_400);
  push("500L", "returning", levies.returning_500);
  push("600L", "returning", levies.graduating_600);

  return slots;
}

export function courseDurationYears(course: UiSeedCourse): number {
  const slots = expandCourseLevies(course);
  const max = Math.max(
    ...slots.map((slot) => Number.parseInt(slot.level, 10) / 100)
  );
  return Number.isFinite(max) ? max : 4;
}

/** UTME path degree estimate: acceptance + 100L fresher + returning levels. */
export function estimatedDegreeTotal(course: UiSeedCourse): number {
  const { levies } = course;
  let total = UI_ACCEPTANCE_FEE;
  for (const amount of [
    levies.fresher_100,
    levies.returning_200,
    levies.returning_300,
    levies.returning_400,
    levies.returning_500,
    levies.graduating_600,
  ]) {
    if (amount != null) total += amount;
  }
  return total;
}
