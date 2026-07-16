import type {
  Database,
  InstitutionType,
  OwnershipType,
} from "./database";

export type Institution =
  Database["public"]["Tables"]["institutions"]["Row"];

export type Faculty = Database["public"]["Tables"]["faculties"]["Row"];

export type Course = Database["public"]["Tables"]["courses"]["Row"];

export type AcademicSession =
  Database["public"]["Tables"]["academic_sessions"]["Row"];

export type InstitutionWithCourses = Institution & {
  courses: Course[];
  faculties: Faculty[];
};

export const INSTITUTION_TYPE_LABELS: Record<InstitutionType, string> = {
  university: "University",
  polytechnic: "Polytechnic",
  college_of_education: "College of Education",
  health_institution: "Health Institution",
};

export const OWNERSHIP_TYPE_LABELS: Record<OwnershipType, string> = {
  federal: "Federal",
  state: "State",
  private: "Private",
};

export const NIGERIA_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
] as const;

export type NigeriaState = (typeof NIGERIA_STATES)[number];
