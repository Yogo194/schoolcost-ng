/**
 * Redeemer's University (RUN) obligatory school fees by programme and level.
 *
 * Source (official image-only PDF, transcribed):
 * https://run.edu.ng/wp-content/uploads/2025/11/2025-2026-fee-schedule.pdf
 *
 * Session: 2025/2026 (stated on the schedule).
 * The schedule gives a single obligatory total per programme x level (no
 * component breakdown), so each level seeds one all-inclusive line.
 *
 * Columns on the PDF: 100L | 200L DE | 200L | 300L | 400L | 500L.
 * The "200L DE" (Direct Entry) column is a separate entry price and is NOT
 * seeded here (noted in admin_note); the standard 100-500 progression is used.
 * "-" cells (no 500L) are omitted.
 *
 * HELD CELL: French 300L. The PDF prints N133,500, an obvious typo versus its
 * identical sibling programmes English/Philosophy (N860,500 at 300L). Under the
 * no-faking rule we neither publish the misleading figure nor invent one, so
 * French 300L is omitted and flagged.
 */

export const REDEEMERS_SLUG = "redeemers-university";
export const REDEEMERS_SESSION = "2025/2026";
export const REDEEMERS_SOURCE =
  "https://run.edu.ng/wp-content/uploads/2025/11/2025-2026-fee-schedule.pdf";

export type RedeemersProgramme = {
  name: string;
  faculty: string;
  // Order: [100L, 200L, 300L, 400L, 500L, _pad]. null = not offered / held.
  levels: Array<number | null>;
};

// levels tuple order: 100L, 200L, 300L, 400L, 500L (200L DE column dropped)
export const REDEEMERS_PROGRAMMES: RedeemersProgramme[] = [
  // A. FACULTY OF BASIC MEDICAL SCIENCES
  { name: "Anatomy", faculty: "Basic Medical Sciences", levels: [926_000, 911_000, 939_500, 1_027_500, null, null] },
  { name: "Biochemistry", faculty: "Basic Medical Sciences", levels: [928_000, 913_000, 931_500, 1_019_500, null, null] },
  { name: "Medical Laboratory Sciences", faculty: "Basic Medical Sciences", levels: [1_389_500, 1_374_500, 1_324_000, 1_407_500, 1_486_500, null] },
  { name: "Nursing", faculty: "Basic Medical Sciences", levels: [1_702_300, 1_889_800, 1_732_200, 1_478_750, 1_571_500, null] },
  { name: "Physiology", faculty: "Basic Medical Sciences", levels: [951_000, 911_000, 939_500, 1_017_500, null, null] },
  { name: "Physiotherapy", faculty: "Basic Medical Sciences", levels: [1_420_000, 1_405_000, 1_392_500, 1_367_500, 1_480_000, null] },
  { name: "Public Health", faculty: "Basic Medical Sciences", levels: [1_300_500, 1_285_500, 1_235_000, 1_458_500, null, null] },

  // B. FACULTY OF THE BUILT ENVIRONMENTAL STUDIES
  { name: "Architecture", faculty: "Built Environmental Studies", levels: [1_327_500, 1_362_500, 1_316_000, 1_419_000, null, null] },
  { name: "Building Technology", faculty: "Built Environmental Studies", levels: [1_070_500, 1_055_500, 1_109_000, 1_079_000, 1_121_500, null] },
  { name: "Estate Management", faculty: "Built Environmental Studies", levels: [1_003_000, 988_000, 1_041_500, 1_011_500, 1_054_000, null] },
  { name: "Quantity Surveying", faculty: "Built Environmental Studies", levels: [1_003_000, 988_000, 1_041_500, 1_011_500, 1_054_000, null] },
  { name: "Surveying and Geoinformatics", faculty: "Built Environmental Studies", levels: [1_003_000, 988_000, 1_041_500, 1_011_500, 1_054_000, null] },
  { name: "Urban and Regional Planning", faculty: "Built Environmental Studies", levels: [1_003_000, 988_000, 1_041_500, 1_011_500, 1_054_000, null] },
  { name: "Environmental Management and Toxicology", faculty: "Built Environmental Studies", levels: [1_003_000, 988_000, 1_041_500, 1_011_500, 1_054_000, null] },

  // C. FACULTY OF ENGINEERING
  { name: "Civil Engineering", faculty: "Engineering", levels: [1_440_000, 1_425_000, 1_266_500, 1_256_500, 1_429_000, null] },
  { name: "Computer Engineering", faculty: "Engineering", levels: [1_440_000, 1_425_000, 1_266_500, 1_256_500, 1_429_000, null] },
  { name: "Mechanical Engineering", faculty: "Engineering", levels: [1_440_000, 1_425_000, 1_266_500, 1_256_500, 1_429_000, null] },
  { name: "Electrical Engineering", faculty: "Engineering", levels: [1_450_000, 1_435_000, 1_276_500, 1_246_500, 1_439_000, null] },
  { name: "Chemical Engineering", faculty: "Engineering", levels: [1_435_000, 1_420_000, 1_261_500, 1_231_500, 1_424_000, null] },

  // D. FACULTY OF HUMANITIES
  { name: "English", faculty: "Humanities", levels: [877_000, 857_000, 860_500, 963_500, null, null] },
  { name: "History and International Studies", faculty: "Humanities", levels: [1_052_000, 1_034_500, 1_035_500, 1_138_500, null, null] },
  { name: "Christian Religious Studies", faculty: "Humanities", levels: [666_500, 643_500, 650_500, 725_500, null, null] },
  { name: "Theatre Arts", faculty: "Humanities", levels: [1_027_000, 987_000, 1_005_500, 1_108_500, null, null] },
  // French 300L held (source typo N133,500); seed 100/200/400 only.
  { name: "French", faculty: "Humanities", levels: [877_000, 857_000, null, 963_500, null, null] },
  { name: "Philosophy", faculty: "Humanities", levels: [877_000, 857_000, 860_500, 963_500, null, null] },

  // E. FACULTY OF LAW
  { name: "Law", faculty: "Law", levels: [2_040_000, 2_025_000, 1_752_250, 1_181_500, 1_274_000, null] },

  // F. FACULTY OF MANAGEMENT SCIENCES
  { name: "Accounting", faculty: "Management Sciences", levels: [1_036_700, 1_005_500, 887_500, 990_500, null, null] },
  { name: "Actuarial Science", faculty: "Management Sciences", levels: [899_000, 884_000, 887_500, 990_500, null, null] },
  { name: "Banking & Finance", faculty: "Management Sciences", levels: [899_000, 884_000, 887_500, 990_500, null, null] },
  { name: "Business Administration", faculty: "Management Sciences", levels: [899_000, 884_000, 887_500, 990_500, null, null] },
  { name: "Marketing", faculty: "Management Sciences", levels: [899_000, 884_000, 887_500, 990_500, null, null] },
  { name: "Transport Management", faculty: "Management Sciences", levels: [998_000, 1_183_000, 986_500, 1_089_500, null, null] },
  { name: "Insurance", faculty: "Management Sciences", levels: [899_000, 884_000, 887_500, 990_500, null, null] },

  // G. FACULTY OF NATURAL SCIENCES
  { name: "Industrial Chemistry", faculty: "Natural Sciences", levels: [926_000, 911_000, 914_500, 1_017_500, null, null] },
  { name: "Industrial Mathematics", faculty: "Natural Sciences", levels: [905_750, 890_750, 894_250, 997_250, null, null] },
  { name: "Industrial Mathematics and Computer Science", faculty: "Natural Sciences", levels: [905_750, 890_750, 894_250, 997_250, null, null] },
  { name: "Statistics", faculty: "Natural Sciences", levels: [910_750, 890_750, 894_250, 997_250, null, null] },
  { name: "Statistics and Data Science", faculty: "Natural Sciences", levels: [910_750, 890_750, 894_250, 997_250, null, null] },
  { name: "Microbiology", faculty: "Natural Sciences", levels: [926_000, 911_000, 914_500, 1_017_500, null, null] },
  { name: "Geology", faculty: "Natural Sciences", levels: [941_000, 926_000, 1_129_500, 1_232_500, null, null] },
  { name: "Meteorology", faculty: "Natural Sciences", levels: [926_000, 911_000, 914_500, 1_017_500, null, null] },
  { name: "Applied Geo-Physics", faculty: "Natural Sciences", levels: [926_000, 911_000, 914_500, 1_017_500, null, null] },
  { name: "Physics/Electronics", faculty: "Natural Sciences", levels: [946_000, 931_000, 934_500, 1_037_500, null, null] },

  // H. FACULTY OF SOCIAL SCIENCES
  { name: "Economics", faculty: "Social Sciences", levels: [894_000, 879_000, 882_500, 1_000_500, null, null] },
  { name: "Mass Communication", faculty: "Social Sciences", levels: [904_500, 889_500, 943_000, 996_000, null, null] },
  { name: "Political Science", faculty: "Social Sciences", levels: [899_000, 884_000, 887_500, 990_500, null, null] },
  { name: "Psychology", faculty: "Social Sciences", levels: [939_500, 924_500, 928_000, 1_066_000, null, null] },
  { name: "Sociology", faculty: "Social Sciences", levels: [919_000, 904_000, 907_500, 990_500, null, null] },
  { name: "Hospitality and Tourism Management", faculty: "Social Sciences", levels: [943_000, 1_158_000, 931_500, 1_034_500, null, null] },
  { name: "Social Works", faculty: "Social Sciences", levels: [919_000, 904_000, 907_500, 990_500, null, null] },
  { name: "Public Administration", faculty: "Social Sciences", levels: [899_000, 884_000, 887_500, 990_500, null, null] },

  // I. FACULTY OF COMPUTING AND DIGITAL TECHNOLOGIES
  { name: "Computer Science", faculty: "Computing and Digital Technologies", levels: [973_250, 911_000, 914_500, 1_017_500, null, null] },
  { name: "Cyber-Security", faculty: "Computing and Digital Technologies", levels: [973_250, 911_000, 914_500, 1_017_500, null, null] },
  { name: "Information Technology", faculty: "Computing and Digital Technologies", levels: [973_250, 911_000, 914_500, 1_017_500, null, null] },
];
