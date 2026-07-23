/**
 * Lead City University programme fees for newly admitted undergraduates.
 *
 * Source (official course fees page):
 * https://lcu.edu.ng/index.php/all-courses
 *
 * Page note: stipulated fees for newly-admitted students only.
 * Separate official extras listed on the same page: acceptance ₦50,000,
 * departmental ₦5,000, development levy ₦20,000, matriculation ₦2,000.
 * Accommodation and feeding are listed separately and omitted from compulsory.
 */

export const LEAD_CITY_SLUG = "lead-city-university";
export const LEAD_CITY_SESSION = "2025/2026";
export const LEAD_CITY_SOURCE = "https://lcu.edu.ng/index.php/all-courses";

export const LEAD_CITY_ACCEPTANCE = 50_000;
export const LEAD_CITY_DEPARTMENTAL = 5_000;
export const LEAD_CITY_DEVELOPMENT = 20_000;
export const LEAD_CITY_MATRICULATION = 2_000;

export type LeadCityProgramme = {
  name: string;
  fee: number;
  duration_years: number;
};

export const LEAD_CITY_PROGRAMMES: LeadCityProgramme[] = [
  { name: "Civil Engineering", fee: 925_000, duration_years: 5 },
  { name: "Mechanical Engineering", fee: 925_000, duration_years: 5 },
  { name: "Software Engineering", fee: 1_575_000, duration_years: 4 },
  { name: "Electrical Electronics Engineering", fee: 925_000, duration_years: 5 },
  { name: "Medicine", fee: 6_525_000, duration_years: 6 },
  { name: "Wood Product Engineering", fee: 775_000, duration_years: 5 },
  { name: "Nursing Science", fee: 3_575_000, duration_years: 5 },
  { name: "Dentistry", fee: 2_525_000, duration_years: 6 },
  { name: "Physiotherapy", fee: 925_000, duration_years: 5 },
  { name: "Doctor of Pharmacy", fee: 3_575_000, duration_years: 6 },
  { name: "Biochemistry", fee: 775_000, duration_years: 4 },
  { name: "Law", fee: 2_575_000, duration_years: 5 },
  { name: "Computer Science with Economics", fee: 1_575_000, duration_years: 4 },
  { name: "Computer Science with Electronics", fee: 1_575_000, duration_years: 4 },
  { name: "Computer and Information Science", fee: 1_575_000, duration_years: 4 },
  { name: "Microbiology", fee: 775_000, duration_years: 4 },
  { name: "Accounting", fee: 925_000, duration_years: 4 },
  { name: "Business Administration", fee: 925_000, duration_years: 4 },
  { name: "Economics and Development Studies", fee: 775_000, duration_years: 4 },
  { name: "Politics and International Relations", fee: 925_000, duration_years: 4 },
  { name: "Public Administration", fee: 775_000, duration_years: 4 },
  { name: "Mass Communication and Media Technology", fee: 1_575_000, duration_years: 4 },
  { name: "Public Health", fee: 1_575_000, duration_years: 4 },
  { name: "Medical Laboratory Science", fee: 1_575_000, duration_years: 5 },
  { name: "Environmental Management and Toxicology", fee: 775_000, duration_years: 4 },
  { name: "Science Laboratory Technology", fee: 775_000, duration_years: 4 },
  { name: "Entrepreneurship", fee: 775_000, duration_years: 4 },
  { name: "Religious Studies", fee: 525_000, duration_years: 4 },
  { name: "Estate Management", fee: 775_000, duration_years: 5 },
  { name: "Architecture", fee: 1_575_000, duration_years: 4 },
  { name: "Banking and Finance", fee: 775_000, duration_years: 4 },
  { name: "Criminology and Security Studies", fee: 775_000, duration_years: 4 },
  { name: "Library and Information Science", fee: 775_000, duration_years: 4 },
  { name: "Performing Arts and Film Studies", fee: 775_000, duration_years: 4 },
  { name: "Human Anatomy", fee: 925_000, duration_years: 4 },
  { name: "Physiology", fee: 925_000, duration_years: 4 },
  { name: "Chemistry", fee: 525_000, duration_years: 4 },
  { name: "Physics with Electronics", fee: 625_000, duration_years: 4 },
  { name: "Biology", fee: 525_000, duration_years: 4 },
  { name: "Marketing", fee: 775_000, duration_years: 4 },
  { name: "Psychology", fee: 775_000, duration_years: 4 },
  { name: "Sociology", fee: 775_000, duration_years: 4 },
  { name: "Education Biology", fee: 525_000, duration_years: 4 },
  { name: "Education Chemistry", fee: 525_000, duration_years: 4 },
  { name: "Education Physics", fee: 525_000, duration_years: 4 },
  { name: "Education English", fee: 525_000, duration_years: 4 },
  { name: "Education Mathematics", fee: 525_000, duration_years: 4 },
  { name: "Computer Science Education", fee: 525_000, duration_years: 4 },
  { name: "Guidance and Counselling", fee: 525_000, duration_years: 4 },
  { name: "Educational Management", fee: 525_000, duration_years: 4 },
  { name: "Business Studies Education", fee: 525_000, duration_years: 4 },
  { name: "Social Studies Education", fee: 525_000, duration_years: 4 },
  { name: "Office and Information Management", fee: 525_000, duration_years: 4 },
  { name: "Human Kinetics and Sport Science", fee: 525_000, duration_years: 4 },
  { name: "Human Nutrition and Dietetics", fee: 775_000, duration_years: 4 },
  { name: "Industrial Relations and Personnel Management", fee: 775_000, duration_years: 4 },
  { name: "Information Science and Media Studies", fee: 875_000, duration_years: 4 },
  { name: "Radiography", fee: 1_575_000, duration_years: 5 },
  { name: "Health Information Management", fee: 775_000, duration_years: 4 },
  { name: "Community Health", fee: 775_000, duration_years: 4 },
  { name: "Environmental Health Science", fee: 775_000, duration_years: 4 },
  { name: "Information Systems", fee: 1_575_000, duration_years: 4 },
  { name: "Information Technology", fee: 1_575_000, duration_years: 4 },
  { name: "Forensic Science", fee: 775_000, duration_years: 4 },
  { name: "Cyber Security", fee: 1_575_000, duration_years: 4 },
  { name: "Tourism and Hospitality Management", fee: 775_000, duration_years: 4 },
  { name: "Social Work", fee: 775_000, duration_years: 4 },
  { name: "Geology", fee: 775_000, duration_years: 4 },
  { name: "Urban and Regional Planning", fee: 925_000, duration_years: 5 },
  { name: "Building", fee: 925_000, duration_years: 5 },
  { name: "Surveying and Geoinformatics", fee: 925_000, duration_years: 5 },
  { name: "English and Literary Studies", fee: 775_000, duration_years: 4 },
  { name: "Creative Arts and Design", fee: 775_000, duration_years: 4 },
  { name: "Fine Arts", fee: 775_000, duration_years: 4 },
  { name: "History and Diplomacy", fee: 625_000, duration_years: 4 },
  { name: "Yoruba", fee: 525_000, duration_years: 4 },
  { name: "Early Childhood Education", fee: 525_000, duration_years: 4 },
  { name: "Biomedical Engineering", fee: 925_000, duration_years: 5 },
  { name: "Mechatronics Engineering", fee: 925_000, duration_years: 5 },
  { name: "Biotechnology", fee: 775_000, duration_years: 4 },
  { name: "Dental Therapy", fee: 775_000, duration_years: 4 },
  { name: "Dental Technology", fee: 775_000, duration_years: 4 },
  { name: "Information Resources Management", fee: 775_000, duration_years: 4 },
  { name: "Geographical Information System", fee: 925_000, duration_years: 4 },
  { name: "Automobile Engineering", fee: 925_000, duration_years: 5 },
  { name: "English and French", fee: 775_000, duration_years: 4 },
  { name: "Microbiology and Parasitology", fee: 775_000, duration_years: 4 },
  { name: "Physics", fee: 525_000, duration_years: 4 },
  { name: "French", fee: 525_000, duration_years: 4 },
];
