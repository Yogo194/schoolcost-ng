/**
 * Unverified AAUA annual figures reported by Admission Trend for 2026/2027.
 * This is a community report, not an AAUA fee circular. Keep it out of lowest
 * cost claims and verified comparisons until supported by direct evidence.
 */
export const AAUA_SLUG = "adekunle-ajasin-university";
export const AAUA_SESSION = "2026/2027";
export const AAUA_SOURCE =
  "https://admissiontrend.com.ng/adekunle-ajasin-university-school-fees-for-all-courses/";

const REPORTED_150K = [
  "Accounting", "Architecture", "Animal and Environmental Biology",
  "Agricultural Economics and Extension", "Agronomy", "Animal Science",
  "Banking and Finance", "Biochemistry", "Business Administration",
  "Chemical Sciences", "Computer Science", "Criminology and Security Studies",
  "Cyber Security", "Economics", "English Studies", "Earth Sciences",
  "Estate Management", "Forestry and Wildlife Management", "Fisheries and Aquaculture",
  "Geography and Planning Science", "Guidance and Counseling",
  "History and International Studies", "Industrial Chemistry",
  "Linguistics and Languages", "Mathematics Sciences", "Mass Communication",
  "Microbiology", "Performing Arts", "Philosophy", "Physics and Electronics",
  "Physical and Health Education", "Plant Science and Biotechnology",
  "Political Science and Public Administration", "Pure and Applied Psychology",
  "Public Health", "Quantity Surveying", "Religion and African Culture",
  "Sociology", "Software Engineering", "Urban and Regional Planning", "Law",
] as const;

const REPORTED_100K = [
  "Adult Education", "Arts Education", "Science Education", "Educational Management",
  "Human Kinetics and Health Education", "Social Science Education",
  "Vocational and Technical Education", "English Education", "Biology Education", "Health Education",
] as const;

export const AAUA_REPORTED_FEES = [
  ...REPORTED_150K.map((name) => ({ name, amount: 150_000 })),
  ...REPORTED_100K.map((name) => ({ name, amount: 100_000 })),
  { name: "Medical Laboratory Science", amount: 650_000 },
  { name: "Nursing", amount: 800_000 },
] as const;
