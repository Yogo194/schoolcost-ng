/**
 * Lightweight course option used by the contribute fee form.
 * Matches the shape we need from Supabase `courses` without dragging
 * the full row type through the UI.
 */
export interface SubmitCourseOption {
  id: string;
  institution_id: string;
  name: string;
}

/**
 * Mock courses keyed to mock institution ids from schools-directory.
 * Schools with an empty list intentionally simulate a new / uncatalogued school.
 */
const COURSES_BY_SCHOOL_ID: Record<string, string[]> = {
  "mock-unilag": [
    "Computer Science",
    "Law",
    "Nursing Science",
    "Business Administration",
    "Mass Communication",
  ],
  "mock-ui": [
    "Medicine and Surgery",
    "Computer Science",
    "Law",
    "Economics",
  ],
  "mock-oau": [
    "Electrical Engineering",
    "Medicine and Surgery",
    "Law",
    "Computer Science",
  ],
  "mock-lasu": [
    "Law",
    "Mass Communication",
    "Accounting",
    "Computer Science",
  ],
  "mock-covenant": [
    "Nursing Science",
    "Computer Science",
    "Accounting",
    "Architecture",
  ],
  "mock-babcock": [
    "Accounting",
    "Nursing Science",
    "Computer Science",
    "Medicine and Surgery",
  ],
  "mock-abuad": [
    "Law",
    "Medicine and Surgery",
    "Computer Science",
    "Nursing Science",
  ],
  "mock-uniben": [
    "Pharmacy",
    "Medicine and Surgery",
    "Computer Science",
    "Law",
  ],
  "mock-rsu": [
    "Mass Communication",
    "Law",
    "Computer Science",
    "Engineering",
  ],
  "mock-abu": [
    "Medicine and Surgery",
    "Law",
    "Computer Science",
    "Agriculture",
  ],
  "mock-unizik": [
    "Law",
    "Computer Science",
    "Medicine and Surgery",
    "Pharmacy",
  ],
  "mock-landmark": [
    "Business Administration",
    "Computer Science",
    "Accounting",
    "Agriculture",
  ],
  // Intentionally empty: polytechnics / others act as "new school" free-text path.
  "mock-yabatech": [],
  "mock-funaab": ["Agriculture", "Computer Science", "Food Science"],
  "mock-laspotech": [],
};

function slugifyCourse(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function getMockCoursesForSubmit(): SubmitCourseOption[] {
  return Object.entries(COURSES_BY_SCHOOL_ID).flatMap(
    ([institutionId, names]) =>
      names.map((name) => ({
        id: `${institutionId}-${slugifyCourse(name)}`,
        institution_id: institutionId,
        name,
      }))
  );
}
