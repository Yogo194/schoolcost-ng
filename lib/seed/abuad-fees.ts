/**
 * Afe Babalola University (ABUAD) undergraduate school fees by programme and level.
 *
 * Source (official portal):
 * https://portal.abuad.edu.ng/SchoolFees
 *
 * SUB-TOTAL amounts by programme and level. Accommodation is optional and omitted.
 * Intercalated rows omitted. Extras (PTCF, medical screening, souvenir) are separate.
 */

export const ABUAD_SLUG = "afe-babalola-university";
export const ABUAD_SESSION = "2025/2026";
export const ABUAD_SOURCE = "https://portal.abuad.edu.ng/SchoolFees";

export const ABUAD_PTCF = 30_000;
export const ABUAD_MEDICAL_SCREENING = 10_000;
export const ABUAD_SOUVENIR = 75_000;

export type AbuadProgramme = {
  name: string;
  duration_years: number;
  levels: Array<{ level: string; amount: number }>;
};

const physiologyLevels = [
  { level: "100L", amount: 1_495_000 },
  { level: "200L", amount: 1_370_000 },
  { level: "300L", amount: 1_356_500 },
  { level: "400L", amount: 1_356_500 },
] as const;

const basicScienceLevels = [
  { level: "100L", amount: 1_495_000 },
  { level: "200L", amount: 1_370_000 },
  { level: "300L", amount: 1_356_500 },
  { level: "400L", amount: 1_356_500 },
] as const;

const computerScienceLevels = [
  { level: "100L", amount: 2_295_000 },
  { level: "200L", amount: 1_770_000 },
  { level: "300L", amount: 1_356_500 },
  { level: "400L", amount: 1_356_500 },
] as const;

const dataScienceOnlyLevel = [{ level: "100L", amount: 2_295_000 }] as const;

const architectureLevels = [
  { level: "100L", amount: 2_295_000 },
  { level: "200L", amount: 1_770_000 },
  { level: "300L", amount: 1_356_500 },
  { level: "400L", amount: 1_356_500 },
] as const;

const engineeringLevels = [
  { level: "100L", amount: 2_395_000 },
  { level: "200L", amount: 2_270_000 },
  { level: "300L", amount: 2_056_500 },
  { level: "400L", amount: 2_056_500 },
  { level: "500L", amount: 2_056_500 },
] as const;

const mechatronicsLevels = [
  { level: "100L", amount: 2_595_000 },
  { level: "200L", amount: 2_270_000 },
  { level: "300L", amount: 2_056_500 },
  { level: "400L", amount: 2_056_500 },
  { level: "500L", amount: 2_056_500 },
] as const;

const socialManagementLevels = [
  { level: "100L", amount: 1_395_000 },
  { level: "200L", amount: 1_270_000 },
  { level: "300L", amount: 1_226_500 },
  { level: "400L", amount: 1_226_500 },
] as const;

function programme(
  name: string,
  duration_years: number,
  levels: ReadonlyArray<{ level: string; amount: number }>
): AbuadProgramme {
  return {
    name,
    duration_years,
    levels: levels.map((row) => ({ ...row })),
  };
}

export const ABUAD_PROGRAMMES: AbuadProgramme[] = [
  programme("Medicine and Surgery", 6, [
    { level: "100L", amount: 5_795_000 },
    { level: "200L", amount: 6_175_000 },
    { level: "300L", amount: 5_875_000 },
    { level: "400L", amount: 5_855_000 },
    { level: "500L", amount: 5_855_000 },
    { level: "600L", amount: 5_655_000 },
  ]),
  programme("Nursing", 5, [
    { level: "100L", amount: 3_295_000 },
    { level: "200L", amount: 3_270_000 },
    { level: "300L", amount: 2_635_500 },
    { level: "400L", amount: 2_635_500 },
    { level: "500L", amount: 2_635_500 },
  ]),
  programme("Medical Laboratory Science", 5, [
    { level: "100L", amount: 2_595_000 },
    { level: "200L", amount: 2_670_000 },
    { level: "300L", amount: 2_235_500 },
    { level: "400L", amount: 2_235_500 },
    { level: "500L", amount: 2_235_500 },
  ]),
  programme("Physiology", 4, physiologyLevels),
  programme("Anatomy", 4, physiologyLevels),
  programme("Human Nutrition and Dietetics", 4, physiologyLevels),
  programme("Pharmacology", 4, physiologyLevels),
  programme("Public Health", 4, physiologyLevels),
  programme("Dentistry", 6, [
    { level: "100L", amount: 4_295_000 },
    { level: "200L", amount: 4_875_000 },
    { level: "300L", amount: 3_318_000 },
    { level: "400L", amount: 3_318_000 },
    { level: "500L", amount: 3_718_000 },
    { level: "600L", amount: 3_718_000 },
  ]),
  programme("Optometry", 6, [
    { level: "100L", amount: 1_495_000 },
    { level: "200L", amount: 1_370_000 },
    { level: "300L", amount: 1_356_500 },
    { level: "400L", amount: 1_356_500 },
    { level: "500L", amount: 1_356_500 },
    { level: "600L", amount: 1_225_000 },
  ]),
  programme("Computer Science", 4, computerScienceLevels),
  programme("Biochemistry", 4, basicScienceLevels),
  programme("Microbiology", 4, basicScienceLevels),
  programme("Human Biology", 4, basicScienceLevels),
  programme("Industrial Chemistry", 4, basicScienceLevels),
  programme("Mathematics", 4, basicScienceLevels),
  programme("Physics", 4, basicScienceLevels),
  programme("Geology", 4, basicScienceLevels),
  programme("Petroleum Chemistry", 4, basicScienceLevels),
  programme("Biotechnology", 4, basicScienceLevels),
  programme("Agriculture", 5, [
    { level: "100L", amount: 1_128_000 },
    { level: "200L", amount: 1_128_000 },
    { level: "300L", amount: 1_114_500 },
    { level: "400L", amount: 1_114_500 },
    { level: "500L", amount: 1_114_500 },
  ]),
  programme("Architecture", 4, architectureLevels),
  programme("Data Science", 4, dataScienceOnlyLevel),
  programme("Cyber Security", 4, dataScienceOnlyLevel),
  programme("Software Engineering", 4, dataScienceOnlyLevel),
  programme("Petroleum Engineering", 5, engineeringLevels),
  programme("Electrical/Electronics Engineering", 5, engineeringLevels),
  programme("Mechanical Engineering", 5, engineeringLevels),
  programme("Civil Engineering", 5, engineeringLevels),
  programme("Computer Engineering", 5, engineeringLevels),
  programme("Chemical Engineering", 5, engineeringLevels),
  programme("Agricultural Engineering", 5, engineeringLevels),
  programme("Biomedical Engineering", 5, engineeringLevels),
  programme("Mechatronics Engineering", 5, mechatronicsLevels),
  programme("Aeronautical and Astronautical Engineering", 5, mechatronicsLevels),
  programme("Media & Communication Studies", 4, socialManagementLevels),
  programme("International Relations and Diplomacy", 4, socialManagementLevels),
  programme("Economics", 4, socialManagementLevels),
  programme("Political Science", 4, socialManagementLevels),
  programme("Conflict Peace and Strategic Studies", 4, socialManagementLevels),
  programme("Tourism and Events Management", 4, socialManagementLevels),
  programme("Business Administration", 4, socialManagementLevels),
  programme("Banking & Finance", 4, socialManagementLevels),
  programme("Intelligence and Security Studies", 4, socialManagementLevels),
  programme("Social Justice", 4, socialManagementLevels),
  programme("Accounting", 4, socialManagementLevels),
  programme("Marketing", 4, socialManagementLevels),
  programme("Entrepreneurship", 4, socialManagementLevels),
  programme("Sociology", 4, socialManagementLevels),
  programme("Finance", 4, socialManagementLevels),
  programme("Law", 5, [
    { level: "100L", amount: 3_795_000 },
    { level: "200L", amount: 3_170_000 },
    { level: "300L", amount: 2_826_500 },
    { level: "400L", amount: 2_826_500 },
    { level: "500L", amount: 2_826_500 },
  ]),
  programme("Performing & Theater Arts", 4, [
    { level: "100L", amount: 1_158_000 },
    { level: "200L", amount: 1_158_000 },
    { level: "300L", amount: 1_114_500 },
    { level: "400L", amount: 1_114_500 },
  ]),
  programme("Pharmacy", 6, [
    { level: "100L", amount: 3_295_000 },
    { level: "200L", amount: 3_190_000 },
    { level: "300L", amount: 2_476_500 },
    { level: "400L", amount: 2_456_500 },
    { level: "500L", amount: 3_116_500 },
    { level: "600L", amount: 2_906_500 },
  ]),
];
