/**
 * Godfrey Okoye University 2025/2026 fee structure from official PDF.
 * Programme amounts are tuition + accommodation as published.
 * Other/professional fees are noted separately and not folded into totals.
 */
import type { WebsiteSchoolSeed } from "./website-fees-batch1";

export const GOUNI_FEE_SEED: WebsiteSchoolSeed = {
  slug: "godfrey-okoye-university",
  session: "2025/2026",
  startYear: 2025,
  endYear: 2026,
  sourceUrl:
    "https://gouni.edu.ng/new/wp-content/uploads/2025/07/GOUNI-FEES-STRUCTURE-2025.2026-1.pdf",
  evidenceDate: "2026-07-30",
  adminNote:
    "From Godfrey Okoye University official 2025/2026 session fees structure PDF (local copy: /evidence/fees/gouni-2025-2026-fees-structure.pdf). Programme amounts are tuition and accommodation only. Other fees (about ₦201,500 fresh / ₦137,000 returning for most faculties; Law and Medicine/Nursing have separate other-fee bands) plus professional levies are not included. Acceptance ₦30,000 and matriculation ₦20,000 are not included. Confirm on the GOUNI ERP before paying.",
  fees: [
    // Faculty of Management & Social Sciences
    { name: "Accounting", amount: 750_000, returningAmount: 750_000, durationYears: 4 },
    { name: "Banking and Finance", amount: 750_000, returningAmount: 750_000, durationYears: 4 },
    { name: "Management", amount: 750_000, returningAmount: 750_000, durationYears: 4 },
    { name: "Marketing", amount: 750_000, returningAmount: 750_000, durationYears: 4 },
    { name: "Public Administration", amount: 750_000, returningAmount: 750_000, durationYears: 4 },
    { name: "Economics", amount: 750_000, returningAmount: 750_000, durationYears: 4 },
    { name: "Political Science", amount: 750_000, returningAmount: 750_000, durationYears: 4 },
    { name: "International Relations", amount: 750_000, returningAmount: 750_000, durationYears: 4 },
    { name: "Mass Communications", amount: 770_000, returningAmount: 770_000, durationYears: 4 },
    {
      name: "Philosophy",
      amount: 750_000,
      returningAmount: 750_000,
      durationYears: 4,
      note: "Faculty of Management & Social Sciences band. Arts Philosophy is listed separately at a lower rate.",
    },
    { name: "Psychology", amount: 750_000, returningAmount: 750_000, durationYears: 4 },
    { name: "Religious Studies", amount: 750_000, returningAmount: 750_000, durationYears: 4 },
    { name: "Sociology", amount: 750_000, returningAmount: 750_000, durationYears: 4 },
    // Faculty of Natural Sciences & Environmental Studies
    { name: "Applied Biology", amount: 820_000, returningAmount: 790_000, durationYears: 4 },
    { name: "Biotechnology", amount: 820_000, returningAmount: 790_000, durationYears: 4 },
    { name: "Microbiology", amount: 820_000, returningAmount: 790_000, durationYears: 4 },
    { name: "Chemistry", amount: 820_000, returningAmount: 790_000, durationYears: 4 },
    { name: "Biochemistry", amount: 820_000, returningAmount: 790_000, durationYears: 4 },
    { name: "Industrial Chemistry", amount: 820_000, returningAmount: 790_000, durationYears: 4 },
    { name: "Physics", amount: 820_000, returningAmount: 790_000, durationYears: 4 },
    { name: "Architecture", amount: 870_000, returningAmount: 870_000, durationYears: 4 },
    { name: "Industrial Design", amount: 870_000, returningAmount: 870_000, durationYears: 4 },
    // Faculty of Computing and Information Technology
    { name: "Computer Science", amount: 1_220_000, returningAmount: 1_120_000, durationYears: 4 },
    { name: "Mathematics", amount: 820_000, returningAmount: 790_000, durationYears: 4 },
    { name: "Statistics and Demography", amount: 820_000, returningAmount: 790_000, durationYears: 4 },
    // Faculty of Education
    { name: "Biology Education", amount: 631_200, returningAmount: 631_200, durationYears: 4 },
    { name: "Chemistry Education", amount: 631_200, returningAmount: 631_200, durationYears: 4 },
    { name: "Mathematics Education", amount: 631_200, returningAmount: 631_200, durationYears: 4 },
    { name: "Physics Education", amount: 631_200, returningAmount: 631_200, durationYears: 4 },
    {
      name: "English and Literary Studies Education",
      amount: 651_200,
      returningAmount: 651_200,
      durationYears: 4,
    },
    {
      name: "History and International Studies Education",
      amount: 631_200,
      returningAmount: 631_200,
      durationYears: 4,
    },
    { name: "Economics Education", amount: 631_200, returningAmount: 631_200, durationYears: 4 },
    {
      name: "Political Science and Government Education",
      amount: 631_200,
      returningAmount: 631_200,
      durationYears: 4,
    },
    { name: "Social Studies Education", amount: 631_200, returningAmount: 631_200, durationYears: 4 },
    { name: "Business Education", amount: 631_200, returningAmount: 631_200, durationYears: 4 },
    { name: "Computer Science Education", amount: 631_200, returningAmount: 631_200, durationYears: 4 },
    // Faculty of Arts
    {
      name: "History, International Relations and Diplomacy",
      amount: 631_200,
      returningAmount: 631_200,
      durationYears: 4,
    },
    { name: "Music", amount: 631_200, returningAmount: 631_200, durationYears: 4 },
    {
      name: "English and Literary Studies",
      amount: 651_200,
      returningAmount: 651_200,
      durationYears: 4,
    },
    {
      name: "Philosophy (Arts)",
      amount: 631_200,
      returningAmount: 631_200,
      durationYears: 4,
      note: "Faculty of Arts band on the GOUNI PDF.",
    },
    // Faculty of Law
    {
      name: "Jurisprudence and International Law",
      amount: 1_700_000,
      returningAmount: 1_300_000,
      durationYears: 5,
      note: "300L–500L tuition+accommodation listed as ₦1,165,000 on source.",
    },
    {
      name: "Public Law",
      amount: 1_700_000,
      returningAmount: 1_300_000,
      durationYears: 5,
      note: "300L–500L tuition+accommodation listed as ₦1,165,000 on source.",
    },
    {
      name: "Private and Business Law",
      amount: 1_700_000,
      returningAmount: 1_300_000,
      durationYears: 5,
      note: "300L–500L tuition+accommodation listed as ₦1,165,000 on source.",
    },
    // College of Medicine and Nursing Sciences
    {
      name: "Medicine and Surgery",
      amount: 4_600_000,
      returningAmount: 4_050_000,
      durationYears: 6,
      note: "Other fees ~₦223,500 fresh / ₦159,000 returning plus DNALC not included.",
    },
    {
      name: "Nursing Sciences",
      amount: 1_902_000,
      returningAmount: 1_854_000,
      durationYears: 5,
      note: "PDF lists 100L/200L tuition+accommodation only. Other + nursing-specific fees (~₦421,000 / ₦436,500) not included.",
    },
  ],
};
