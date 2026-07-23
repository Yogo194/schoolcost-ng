/**
 * Pan-Atlantic University undergraduate tuition schedule for 2026/2027.
 *
 * Primary source: https://pau.edu.ng/admissions/undergrad-2/fees/
 *
 * The official page states that the fees are indicative and subject to annual
 * review. These are tuition figures only. The schedule does not publish a
 * current acceptance or hostel amount, so neither belongs in these totals.
 */

export const PAU_INSTITUTION_SLUG = "pan-atlantic-university";
export const PAU_FEE_SESSION = "2026/2027";
export const PAU_FEE_SOURCE = "https://pau.edu.ng/admissions/undergrad-2/fees/";

export type PauAnnualTuition = {
  level: "100L" | "200L" | "300L" | "400L" | "500L";
  amount: number | null;
};

export type PauProgramme = {
  name: string;
  durationYears: number;
  tuitionByLevel: PauAnnualTuition[];
};

const fourYearBusiness = [
  ["Accounting", 6_584_000, 6_298_000, 5_398_000, 4_959_000],
  ["Business Administration", 6_584_000, 6_298_000, 5_398_000, 4_959_000],
  ["Economics", 6_584_000, 6_298_000, 5_398_000, 4_959_000],
  ["Finance", 6_584_000, 6_298_000, 5_398_000, 4_959_000],
  ["Mass Communication", 6_962_000, 6_659_000, 5_708_000, 5_465_000],
  [
    "Information Science and Media Studies",
    7_091_000,
    6_782_000,
    5_813_000,
    5_566_000,
  ],
  ["Computer Science", 7_099_000, 6_791_000, 5_821_000, 5_573_000],
  ["Software Engineering", 7_099_000, 6_791_000, 5_821_000, 5_573_000],
  ["Film and Multimedia", 6_962_000, 6_659_000, 5_708_000, 5_465_000],
] as const;

function fourYearProgramme(
  name: string,
  year1: number,
  year2: number,
  year3: number,
  year4: number
): PauProgramme {
  return {
    name,
    durationYears: 4,
    tuitionByLevel: [
      { level: "100L", amount: year1 },
      { level: "200L", amount: year2 },
      { level: "300L", amount: year3 },
      { level: "400L", amount: year4 },
    ],
  };
}

function fiveYearProgramme(
  name: string,
  year1: number,
  year2: number,
  year3: number,
  year4: number,
  year5: number
): PauProgramme {
  return {
    name,
    durationYears: 5,
    tuitionByLevel: [
      { level: "100L", amount: year1 },
      { level: "200L", amount: year2 },
      { level: "300L", amount: year3 },
      { level: "400L", amount: year4 },
      { level: "500L", amount: year5 },
    ],
  };
}

/**
 * Keep unavailable future levels explicit. A seed must never convert a dash
 * in PAU's published schedule into a zero fee or a whole-degree estimate.
 */
function partialProgramme(
  name: string,
  durationYears: number,
  amounts: Array<number | null>
): PauProgramme {
  return {
    name,
    durationYears,
    tuitionByLevel: (["100L", "200L", "300L", "400L", "500L"] as const).map(
      (level, index) => ({ level, amount: amounts[index] ?? null })
    ),
  };
}

export const PAU_PROGRAMMES: PauProgramme[] = [
  ...fourYearBusiness.map(([name, year1, year2, year3, year4]) =>
    fourYearProgramme(name, year1, year2, year3, year4)
  ),
  fiveYearProgramme(
    "Electrical/Electronics Engineering",
    7_011_000,
    6_706_000,
    5_748_000,
    5_748_000,
    5_514_000
  ),
  fiveYearProgramme(
    "Mechanical Engineering",
    7_011_000,
    6_706_000,
    5_748_000,
    5_748_000,
    5_514_000,
  ),
  partialProgramme("Data Science", 4, [7_099_000, 6_791_000, null, null, null]),
  partialProgramme("Mechatronics Engineering", 5, [
    7_322_000,
    7_004_000,
    6_003_000,
    null,
    null,
  ]),
  partialProgramme("Strategic Communication", 4, [
    6_962_000,
    6_659_000,
    null,
    null,
    null,
  ]),
];
