/**
 * Chrisland University fee bands from official schedule page.
 *
 * Source: https://www.chrislanduniversity.edu.ng/contents/schedule-of-fees.html
 *
 * Line items: tuition, accommodation, Classera, SRC, New Horizons, and
 * clinical where published. Grand totals verified against the official table.
 */

export const CHRISLAND_SLUG = "chrisland-university";
export const CHRISLAND_SESSION = "2025/2026";
export const CHRISLAND_SOURCE =
  "https://www.chrislanduniversity.edu.ng/contents/schedule-of-fees.html";

export type ChrislandLevelFees = {
  level: string; // "100L" | "200L" | "300L+"
  student_type: "fresh" | "returning";
  tuition: number;
  accommodation: number; // always 300000
  classera: number; // 5000
  src: number; // 5000
  new_horizon: number; // 35000
  clinical: number; // 0 or 100000 or 150000
};

export type ChrislandBand = {
  name: string;
  duration_years: number;
  levels: ChrislandLevelFees[];
};

const ACCOMMODATION = 300_000;
const CLASSERA = 5_000;
const SRC = 5_000;
const NEW_HORIZON = 35_000;

function levelFees(
  level: string,
  student_type: "fresh" | "returning",
  tuition: number,
  clinical = 0
): ChrislandLevelFees {
  return {
    level,
    student_type,
    tuition,
    accommodation: ACCOMMODATION,
    classera: CLASSERA,
    src: SRC,
    new_horizon: NEW_HORIZON,
    clinical,
  };
}

function flatLevels(
  tuition: number,
  clinical = 0
): ChrislandLevelFees[] {
  return [
    levelFees("100L", "fresh", tuition, clinical),
    levelFees("200L", "returning", tuition, clinical),
    levelFees("300L+", "returning", tuition, clinical),
  ];
}

function variableLevels(
  rows: Array<{
    level: string;
    student_type: "fresh" | "returning";
    tuition: number;
    clinical: number;
  }>
): ChrislandLevelFees[] {
  return rows.map(({ level, student_type, tuition, clinical }) =>
    levelFees(level, student_type, tuition, clinical)
  );
}

export const CHRISLAND_BANDS: ChrislandBand[] = [
  {
    name: "Mass Communication",
    duration_years: 4,
    levels: flatLevels(850_000),
  },
  {
    name: "Accounting",
    duration_years: 4,
    levels: flatLevels(850_000),
  },
  {
    name: "CAMAS Others",
    duration_years: 4,
    levels: flatLevels(780_000),
  },
  {
    name: "Computer Science",
    duration_years: 4,
    levels: flatLevels(900_000),
  },
  {
    name: "CONAS Others",
    duration_years: 4,
    levels: flatLevels(780_000),
  },
  {
    name: "Nursing",
    duration_years: 5,
    levels: variableLevels([
      { level: "100L", student_type: "fresh", tuition: 1_800_000, clinical: 0 },
      {
        level: "200L",
        student_type: "returning",
        tuition: 1_500_000,
        clinical: 100_000,
      },
      {
        level: "300L+",
        student_type: "returning",
        tuition: 1_500_000,
        clinical: 150_000,
      },
    ]),
  },
  {
    name: "Physiotherapy",
    duration_years: 5,
    levels: variableLevels([
      { level: "100L", student_type: "fresh", tuition: 1_300_000, clinical: 0 },
      {
        level: "200L",
        student_type: "returning",
        tuition: 1_300_000,
        clinical: 100_000,
      },
      {
        level: "300L+",
        student_type: "returning",
        tuition: 1_300_000,
        clinical: 150_000,
      },
    ]),
  },
  {
    name: "Medical Laboratory Science",
    duration_years: 5,
    levels: variableLevels([
      { level: "100L", student_type: "fresh", tuition: 1_200_000, clinical: 0 },
      {
        level: "200L",
        student_type: "returning",
        tuition: 1_200_000,
        clinical: 100_000,
      },
      {
        level: "300L+",
        student_type: "returning",
        tuition: 1_200_000,
        clinical: 150_000,
      },
    ]),
  },
  {
    name: "Public Health",
    duration_years: 4,
    levels: variableLevels([
      { level: "100L", student_type: "fresh", tuition: 800_000, clinical: 0 },
      {
        level: "200L",
        student_type: "returning",
        tuition: 800_000,
        clinical: 100_000,
      },
      {
        level: "300L+",
        student_type: "returning",
        tuition: 800_000,
        clinical: 150_000,
      },
    ]),
  },
  {
    name: "Law",
    duration_years: 5,
    levels: variableLevels([
      { level: "100L", student_type: "fresh", tuition: 2_000_000, clinical: 0 },
      {
        level: "200L",
        student_type: "returning",
        tuition: 1_550_000,
        clinical: 0,
      },
      {
        level: "300L+",
        student_type: "returning",
        tuition: 1_550_000,
        clinical: 0,
      },
    ]),
  },
];
