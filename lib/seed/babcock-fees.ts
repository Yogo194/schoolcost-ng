/**
 * Babcock University undergraduate instructional fees by programme and level.
 *
 * Source (official tuition and fees page):
 * https://babcock.edu.ng/admission/tuition-and-fees
 *
 * Instructional Full Year amounts only. Misc charges by level are exported separately.
 * Medicine package (includes accommodation and feeding) is exported as BABCOCK_MEDICINE.
 */

export const BABCOCK_SLUG = "babcock-university";
export const BABCOCK_SESSION = "2025/2026";
export const BABCOCK_SOURCE = "https://babcock.edu.ng/admission/tuition-and-fees";

export const BABCOCK_MISC: Record<string, number> = {
  "100L": 346_830,
  "200L": 294_830,
  "300L": 294_830,
  "400L": 221_430,
  "500L": 221_430,
};

export type BabcockProgramme = {
  name: string;
  duration_years: number;
  levels: Array<{ level: string; instructional: number }>;
};

export type BabcockMedicineLevel = {
  level: string;
  amount: number;
};

const accountingLevels = [
  { level: "100L", instructional: 1_286_283.7 },
  { level: "200L", instructional: 1_286_283.7 },
  { level: "300L", instructional: 1_187_338.8 },
  { level: "400L", instructional: 1_022_866.35 },
  { level: "500L", instructional: 1_022_866.35 },
] as const;

const agricultureLevels = [
  { level: "100L", instructional: 1_175_367.7 },
  { level: "200L", instructional: 1_175_367.7 },
  { level: "300L", instructional: 1_084_954.8 },
  { level: "400L", instructional: 924_748.35 },
  { level: "500L", instructional: 924_748.35 },
] as const;

const anatomyLevels = [
  { level: "100L", instructional: 1_249_311.7 },
  { level: "200L", instructional: 1_249_311.7 },
  { level: "300L", instructional: 1_153_210.8 },
  { level: "400L", instructional: 990_160.35 },
  { level: "500L", instructional: 990_160.35 },
] as const;

const architectureLevels = [
  { level: "100L", instructional: 1_270_750 },
  { level: "200L", instructional: 1_270_750 },
  { level: "300L", instructional: 1_221_875 },
] as const;

const civilEngineeringLevels = [
  { level: "100L", instructional: 1_484_173.5 },
  { level: "200L", instructional: 1_484_173.5 },
  { level: "300L", instructional: 1_385_228.6 },
] as const;

const educationLevels = [
  { level: "100L", instructional: 813_036.9 },
  { level: "200L", instructional: 813_036.9 },
  { level: "300L", instructional: 750_495.6 },
  { level: "400L", instructional: 604_224.95 },
  { level: "500L", instructional: 604_224.95 },
] as const;

const englishLevels = [
  { level: "100L", instructional: 1_212_339.7 },
  { level: "200L", instructional: 1_212_339.7 },
  { level: "300L", instructional: 1_119_082.8 },
  { level: "400L", instructional: 957_454.35 },
  { level: "500L", instructional: 957_454.35 },
] as const;

const informationTechnologyLevels = [
  { level: "100L", instructional: 1_277_183.7 },
  { level: "200L", instructional: 1_277_183.7 },
  { level: "300L", instructional: 1_178_938.8 },
  { level: "400L", instructional: 1_014_816.35 },
  { level: "500L", instructional: 1_014_816.35 },
] as const;

const lawLevels = [
  { level: "100L", instructional: 2_001_987 },
  { level: "200L", instructional: 2_001_987 },
  { level: "300L", instructional: 1_847_988 },
  { level: "400L", instructional: 1_655_988.5 },
  { level: "500L", instructional: 1_655_988.5 },
] as const;

const nursingLevels = [
  { level: "100L", instructional: 1_484_173.5 },
  { level: "200L", instructional: 1_484_173.5 },
  { level: "300L", instructional: 1_385_228.6 },
  { level: "400L", instructional: 1_156_283.7 },
  { level: "500L", instructional: 1_156_283.7 },
] as const;

const theologyLevels = [
  { level: "100L", instructional: 1_138_393.1 },
  { level: "200L", instructional: 1_138_393.1 },
  { level: "300L", instructional: 1_050_824.4 },
  { level: "400L", instructional: 892_040.05 },
  { level: "500L", instructional: 892_040.05 },
] as const;

function programme(
  name: string,
  duration_years: number,
  levels: ReadonlyArray<{ level: string; instructional: number }>
): BabcockProgramme {
  return {
    name,
    duration_years,
    levels: levels.map((row) => ({ ...row })),
  };
}

export const BABCOCK_MEDICINE: BabcockMedicineLevel[] = [
  { level: "100L", amount: 7_000_000 },
  { level: "200L", amount: 7_000_000 },
  { level: "300L", amount: 6_000_000 },
  { level: "400L", amount: 6_000_000 },
  { level: "500L", amount: 5_500_000 },
  { level: "600L", amount: 5_500_000 },
];

export const BABCOCK_PROGRAMMES: BabcockProgramme[] = [
  programme("Accounting", 4, accountingLevels),
  programme("Agriculture", 4, agricultureLevels),
  programme("Anatomy", 4, anatomyLevels),
  programme("Architecture", 4, architectureLevels),
  programme("Biochemistry", 4, anatomyLevels),
  programme("Biology", 4, agricultureLevels),
  programme("Business Administration", 4, anatomyLevels),
  programme("Chemistry", 4, agricultureLevels),
  programme("Civil Engineering", 5, civilEngineeringLevels),
  programme("Computer Engineering", 5, civilEngineeringLevels),
  programme("Computer Information System", 4, accountingLevels),
  programme("Computer Science", 4, accountingLevels),
  programme("Computer Technology", 4, accountingLevels),
  programme("Economics", 4, anatomyLevels),
  programme("Education Programs", 4, educationLevels),
  programme("Electrical Electronics", 5, civilEngineeringLevels),
  programme("English Studies", 4, englishLevels),
  programme("Estate Management", 4, architectureLevels),
  programme("Finance", 4, anatomyLevels),
  programme("History and International Relations", 4, agricultureLevels),
  programme("Information Resource Management", 4, englishLevels),
  programme("Information Technology", 4, informationTechnologyLevels),
  programme("International Law and Diplomacy", 4, englishLevels),
  programme("Law", 5, lawLevels),
  programme("Marketing", 4, anatomyLevels),
  programme("Mass Communication", 4, anatomyLevels),
  programme("Mathematics / Physics / Chemistry / Electronics", 4, agricultureLevels),
  programme("Mechanical Engineering", 5, civilEngineeringLevels),
  programme("Medical Laboratory", 5, accountingLevels),
  programme("Microbiology", 4, anatomyLevels),
  programme("Nursing Science", 5, nursingLevels),
  programme("Nutrition and Dietetics", 4, agricultureLevels),
  programme("Physiology", 4, anatomyLevels),
  programme("Physics", 4, agricultureLevels),
  programme("Political Science", 4, englishLevels),
  programme("Public Administration", 4, englishLevels),
  programme("Public Health", 4, englishLevels),
  programme("Social Work", 4, englishLevels),
  programme("Software Engineering", 4, accountingLevels),
  programme("Theology", 4, theologyLevels),
];
