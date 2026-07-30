/**
 * Augustine University 2026/2027 fee schedule from official PDF.
 * Totals exclude furnished accommodation (listed separately on the PDF).
 * Acceptance fee ₦100,500 for new students is not included in year totals.
 */
export const AUGUSTINE_SLUG = "augustine-university";
export const AUGUSTINE_SESSION = "2026/2027";
export const AUGUSTINE_SOURCE_URL =
  "https://www.augustineuniversity.edu.ng/Content?head=Payments+%26+Fees&read=9";
export const AUGUSTINE_LOCAL_PDF =
  "/evidence/fees/augustine-2026-2027-fee-schedule.pdf";

export type AugustineYearFee = {
  level: string;
  studentType: "fresh" | "returning";
  amount: number;
};

export type AugustineProgramme = {
  name: string;
  durationYears: number;
  years: AugustineYearFee[];
};

function y(
  level: string,
  studentType: "fresh" | "returning",
  amount: number
): AugustineYearFee {
  return { level, studentType, amount: Math.round(amount) };
}

export const AUGUSTINE_PROGRAMMES: AugustineProgramme[] = [
  {
    name: "Mass Communication",
    durationYears: 4,
    years: [
      y("100L", "fresh", 1_585_511.5),
      y("200L", "returning", 1_566_086.5),
      y("300L", "returning", 1_433_348.18),
      y("400L", "returning", 1_672_798.18),
    ],
  },
  {
    name: "Mathematics",
    durationYears: 4,
    years: [
      y("100L", "fresh", 1_035_444),
      y("200L", "returning", 1_050_608),
      y("300L", "returning", 1_170_508),
      y("400L", "returning", 1_399_508),
    ],
  },
  {
    name: "Economics",
    durationYears: 4,
    years: [
      y("100L", "fresh", 1_343_672.4),
      y("200L", "returning", 1_324_247.4),
      y("300L", "returning", 1_254_947.4),
      y("400L", "returning", 1_494_397.4),
    ],
  },
  {
    name: "Political Science",
    durationYears: 4,
    years: [
      y("100L", "fresh", 1_339_284.24),
      y("200L", "returning", 1_319_859.24),
      y("300L", "returning", 1_189_658.4),
      y("400L", "returning", 1_429_108.4),
    ],
  },
  {
    name: "Business Administration",
    durationYears: 4,
    years: [
      y("100L", "fresh", 1_343_672.4),
      y("200L", "returning", 1_324_247.4),
      y("300L", "returning", 1_254_947.4),
      y("400L", "returning", 1_494_397.4),
    ],
  },
  {
    name: "Banking and Finance",
    durationYears: 4,
    years: [
      y("100L", "fresh", 1_297_678.2),
      y("200L", "returning", 1_324_247.4),
      y("300L", "returning", 1_254_947.4),
      y("400L", "returning", 1_494_397.4),
    ],
  },
  {
    name: "Religious Studies",
    durationYears: 4,
    years: [
      y("100L", "fresh", 976_650),
      y("200L", "returning", 990_800),
      y("300L", "returning", 1_017_750),
      y("400L", "returning", 1_246_750),
    ],
  },
  {
    name: "Accounting",
    durationYears: 4,
    years: [
      y("100L", "fresh", 1_572_050.5),
      y("200L", "returning", 1_552_625.5),
      y("300L", "returning", 1_407_199.5),
      y("400L", "returning", 1_646_649.5),
    ],
  },
  {
    name: "Computer Science",
    durationYears: 4,
    years: [
      y("100L", "fresh", 1_630_945),
      y("200L", "returning", 1_611_520),
      y("300L", "returning", 1_466_094),
      y("400L", "returning", 1_705_544),
    ],
  },
  {
    name: "Information Technology",
    durationYears: 4,
    years: [
      y("100L", "fresh", 1_416_230.5),
      y("200L", "returning", 1_396_805.5),
      y("300L", "returning", 1_407_535.5),
      y("400L", "returning", 1_646_985.5),
    ],
  },
  {
    name: "Cyber Security",
    durationYears: 4,
    years: [
      y("100L", "fresh", 1_416_230.5),
      y("200L", "returning", 1_396_805.5),
      y("300L", "returning", 1_407_535.5),
      y("400L", "returning", 1_646_985.5),
    ],
  },
  {
    name: "Software Engineering",
    durationYears: 4,
    years: [
      y("100L", "fresh", 1_630_945),
      y("200L", "returning", 1_611_520),
      y("300L", "returning", 1_466_094),
      y("400L", "returning", 1_705_544),
    ],
  },
  {
    name: "Biology",
    durationYears: 4,
    years: [
      y("100L", "fresh", 1_088_679),
      y("200L", "returning", 1_106_378),
      y("300L", "returning", 1_226_278),
      y("400L", "returning", 1_455_278),
    ],
  },
  {
    name: "Microbiology",
    durationYears: 4,
    years: [
      y("100L", "fresh", 1_181_121.9),
      y("200L", "returning", 1_161_696.9),
      y("300L", "returning", 1_229_033.4),
      y("400L", "returning", 1_468_483.4),
    ],
  },
  {
    name: "Chemistry",
    durationYears: 4,
    years: [
      y("100L", "fresh", 1_088_679),
      y("200L", "returning", 1_106_378),
      y("300L", "returning", 1_170_508),
      y("400L", "returning", 1_399_508),
    ],
  },
  {
    name: "Biochemistry",
    durationYears: 4,
    years: [
      y("100L", "fresh", 1_376_316.9),
      y("200L", "returning", 1_356_891.9),
      y("300L", "returning", 1_287_591.9),
      y("400L", "returning", 1_527_041.9),
    ],
  },
  {
    name: "Physics",
    durationYears: 4,
    years: [
      y("100L", "fresh", 1_088_679),
      y("200L", "returning", 1_106_378),
      y("300L", "returning", 1_170_508),
      y("400L", "returning", 1_399_508),
    ],
  },
  {
    name: "Fisheries and Aquaculture",
    durationYears: 4,
    years: [
      y("100L", "fresh", 1_014_150),
      y("200L", "returning", 1_028_300),
      y("300L", "returning", 1_170_508),
      y("400L", "returning", 1_399_508),
    ],
  },
  {
    name: "Biotechnology",
    durationYears: 4,
    years: [
      y("100L", "fresh", 1_329_435.4),
      y("200L", "returning", 1_356_891.9),
      y("300L", "returning", 1_287_591.9),
      y("400L", "returning", 1_527_041.9),
    ],
  },
  {
    name: "English Language",
    durationYears: 4,
    years: [
      y("100L", "fresh", 1_248_753.24),
      y("200L", "returning", 1_229_328.24),
      y("300L", "returning", 1_255_283.4),
      y("400L", "returning", 1_494_733.4),
    ],
  },
  {
    name: "Computer Engineering",
    durationYears: 4,
    years: [
      y("100L", "fresh", 1_792_450),
      y("200L", "returning", 1_772_100),
      y("300L", "returning", 1_886_500),
      y("400L", "returning", 2_008_025.2),
    ],
  },
  {
    name: "Nursing",
    durationYears: 4,
    years: [
      y("100L", "fresh", 1_885_400),
      y("200L", "returning", 2_215_595),
      y("300L", "returning", 2_098_745),
      y("400L", "returning", 2_319_436.3),
    ],
  },
  {
    name: "Philosophy",
    durationYears: 4,
    years: [
      y("100L", "fresh", 976_650),
      y("200L", "returning", 990_800),
      y("300L", "returning", 1_017_750),
      y("400L", "returning", 1_246_750),
    ],
  },
];
