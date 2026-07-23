/**
 * First Technical University (Tech-U / Abiola Ajimobi Technical University)
 * official programme fees, 2025/2026.
 *
 * Source:
 * https://tech-u.edu.ng/newwebsite/wp-content/uploads/2025/12/New-Tech-U-Fees-and-Charges-Freshers-and-returning-Students.pdf
 *
 * Official columns: admission (freshers), tuition/academic, hostel, and
 * municipal services. Published TOTAL columns on the PDF are about ₦500–₦1,000
 * above the sum of those named columns; we seed the named columns as printed.
 */

export const TECH_U_SLUG = "first-technical-university";
export const TECH_U_SESSION = "2025/2026";
export const TECH_U_SOURCE =
  "https://tech-u.edu.ng/newwebsite/wp-content/uploads/2025/12/New-Tech-U-Fees-and-Charges-Freshers-and-returning-Students.pdf";

export const TECH_U_ADMISSION = 220_000;
export const TECH_U_HOSTEL = 350_000;
export const TECH_U_MUNICIPAL = 127_000;

export type TechUProgramme = {
  name: string;
  tuition: number;
  fresh_total: number;
  returning_total: number;
  duration_years: number;
};

export const TECH_U_PROGRAMMES: TechUProgramme[] = [
  { name: "Biochemistry", tuition: 822_000, fresh_total: 1_519_500, returning_total: 1_299_500, duration_years: 4 },
  { name: "Industrial Chemistry", tuition: 822_000, fresh_total: 1_519_500, returning_total: 1_299_500, duration_years: 4 },
  { name: "Mathematics", tuition: 822_000, fresh_total: 1_519_500, returning_total: 1_299_500, duration_years: 4 },
  { name: "Microbiology", tuition: 822_000, fresh_total: 1_519_500, returning_total: 1_299_500, duration_years: 4 },
  { name: "Physics with Electronics", tuition: 822_000, fresh_total: 1_519_500, returning_total: 1_299_500, duration_years: 4 },
  { name: "Statistics", tuition: 822_000, fresh_total: 1_519_500, returning_total: 1_299_500, duration_years: 4 },
  { name: "Biotechnology", tuition: 972_500, fresh_total: 1_670_500, returning_total: 1_450_000, duration_years: 4 },
  { name: "Computer Science", tuition: 972_500, fresh_total: 1_670_500, returning_total: 1_450_000, duration_years: 4 },
  { name: "Forensic Science", tuition: 972_500, fresh_total: 1_670_500, returning_total: 1_450_000, duration_years: 4 },
  { name: "Science Laboratory Technology", tuition: 972_500, fresh_total: 1_670_500, returning_total: 1_450_000, duration_years: 5 },
  { name: "Cyber Security", tuition: 1_172_500, fresh_total: 1_870_000, returning_total: 1_650_000, duration_years: 4 },
  { name: "Software Engineering", tuition: 1_172_500, fresh_total: 1_870_000, returning_total: 1_650_000, duration_years: 4 },
  { name: "Agricultural Engineering", tuition: 822_000, fresh_total: 1_519_500, returning_total: 1_299_500, duration_years: 5 },
  { name: "Food Science and Technology", tuition: 822_000, fresh_total: 1_519_500, returning_total: 1_299_500, duration_years: 5 },
  { name: "Chemical Engineering", tuition: 972_500, fresh_total: 1_670_500, returning_total: 1_450_000, duration_years: 5 },
  { name: "Civil Engineering", tuition: 972_500, fresh_total: 1_670_500, returning_total: 1_450_000, duration_years: 5 },
  { name: "Computer Engineering", tuition: 972_500, fresh_total: 1_670_500, returning_total: 1_450_000, duration_years: 5 },
  { name: "Electrical and Electronic Engineering", tuition: 972_500, fresh_total: 1_670_500, returning_total: 1_450_000, duration_years: 5 },
  { name: "Industrial and Production Engineering", tuition: 972_500, fresh_total: 1_670_500, returning_total: 1_450_000, duration_years: 5 },
  { name: "Mechanical Engineering", tuition: 972_500, fresh_total: 1_670_500, returning_total: 1_450_000, duration_years: 5 },
  { name: "Biomedical Engineering", tuition: 1_172_500, fresh_total: 1_870_000, returning_total: 1_650_000, duration_years: 5 },
  { name: "Mechatronics Engineering", tuition: 1_172_500, fresh_total: 1_870_000, returning_total: 1_650_000, duration_years: 5 },
  { name: "Petroleum Engineering", tuition: 1_172_500, fresh_total: 1_870_000, returning_total: 1_650_000, duration_years: 5 },
  { name: "Building Technology", tuition: 822_000, fresh_total: 1_519_500, returning_total: 1_299_500, duration_years: 5 },
  { name: "Estate Management", tuition: 822_000, fresh_total: 1_519_500, returning_total: 1_299_500, duration_years: 5 },
  { name: "Quantity Surveying", tuition: 822_000, fresh_total: 1_519_500, returning_total: 1_299_500, duration_years: 5 },
  { name: "Urban and Regional Planning", tuition: 822_000, fresh_total: 1_519_500, returning_total: 1_299_500, duration_years: 5 },
  { name: "Surveying and Geoinformatics", tuition: 972_500, fresh_total: 1_670_500, returning_total: 1_450_000, duration_years: 5 },
  { name: "Architecture", tuition: 1_172_500, fresh_total: 1_870_000, returning_total: 1_650_000, duration_years: 5 },
];
