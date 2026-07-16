import { NIGERIA_STATES } from "@/types/institution";
import type { SearchSuggestion } from "./types";

interface MockSchool {
  name: string;
  slug: string;
  abbreviation: string | null;
  city: string | null;
  state: string;
  ownership: string;
}

interface MockCourse {
  name: string;
  schoolSlug: string;
  schoolName: string;
}

const MOCK_SCHOOLS: MockSchool[] = [
  {
    name: "University of Lagos",
    slug: "university-of-lagos",
    abbreviation: "UNILAG",
    city: "Lagos",
    state: "Lagos",
    ownership: "Federal",
  },
  {
    name: "Covenant University",
    slug: "covenant-university",
    abbreviation: "CU",
    city: "Ota",
    state: "Ogun",
    ownership: "Private",
  },
  {
    name: "University of Ibadan",
    slug: "university-of-ibadan",
    abbreviation: "UI",
    city: "Ibadan",
    state: "Oyo",
    ownership: "Federal",
  },
  {
    name: "Lagos State University",
    slug: "lagos-state-university",
    abbreviation: "LASU",
    city: "Ojo",
    state: "Lagos",
    ownership: "State",
  },
  {
    name: "Babcock University",
    slug: "babcock-university",
    abbreviation: "BU",
    city: "Ilishan-Remo",
    state: "Ogun",
    ownership: "Private",
  },
  {
    name: "Obafemi Awolowo University",
    slug: "obafemi-awolowo-university",
    abbreviation: "OAU",
    city: "Ile-Ife",
    state: "Osun",
    ownership: "Federal",
  },
  {
    name: "University of Benin",
    slug: "university-of-benin",
    abbreviation: "UNIBEN",
    city: "Benin City",
    state: "Edo",
    ownership: "Federal",
  },
  {
    name: "Rivers State University",
    slug: "rivers-state-university",
    abbreviation: "RSU",
    city: "Port Harcourt",
    state: "Rivers",
    ownership: "State",
  },
  {
    name: "Afe Babalola University",
    slug: "afe-babalola-university",
    abbreviation: "ABUAD",
    city: "Ado-Ekiti",
    state: "Ekiti",
    ownership: "Private",
  },
  {
    name: "Nnamdi Azikiwe University",
    slug: "nnamdi-azikiwe-university",
    abbreviation: "UNIZIK",
    city: "Awka",
    state: "Anambra",
    ownership: "Federal",
  },
  {
    name: "Ahmadu Bello University",
    slug: "ahmadu-bello-university",
    abbreviation: "ABU",
    city: "Zaria",
    state: "Kaduna",
    ownership: "Federal",
  },
  {
    name: "Landmark University",
    slug: "landmark-university",
    abbreviation: "LMU",
    city: "Omu-Aran",
    state: "Kwara",
    ownership: "Private",
  },
];

const MOCK_COURSES: MockCourse[] = [
  { name: "Computer Science", schoolSlug: "university-of-lagos", schoolName: "UNILAG" },
  { name: "Medicine and Surgery", schoolSlug: "university-of-ibadan", schoolName: "UI" },
  { name: "Nursing Science", schoolSlug: "covenant-university", schoolName: "Covenant" },
  { name: "Law", schoolSlug: "lagos-state-university", schoolName: "LASU" },
  { name: "Accounting", schoolSlug: "babcock-university", schoolName: "Babcock" },
  { name: "Electrical Engineering", schoolSlug: "obafemi-awolowo-university", schoolName: "OAU" },
  { name: "Pharmacy", schoolSlug: "university-of-benin", schoolName: "UNIBEN" },
  { name: "Mass Communication", schoolSlug: "rivers-state-university", schoolName: "RSU" },
  { name: "Biochemistry", schoolSlug: "ekiti-state-university", schoolName: "EKSU" },
  { name: "Business Administration", schoolSlug: "landmark-university", schoolName: "Landmark" },
];

function schoolMeta(school: MockSchool): string {
  return [school.abbreviation, school.city, school.ownership].filter(Boolean).join(" · ");
}

function scoreMatch(text: string, query: string): number {
  const hay = text.toLowerCase();
  const needle = query.toLowerCase().trim();
  if (!needle) return 0;
  if (hay === needle) return 100;
  if (hay.startsWith(needle)) return 80;
  if (hay.includes(needle)) return 60;
  return 0;
}

function bestScore(fields: string[], query: string): number {
  return Math.max(0, ...fields.map((field) => scoreMatch(field, query)));
}

export function getMockSearchSuggestions(
  query: string,
  limit = 8
): SearchSuggestion[] {
  const q = query.trim();
  if (q.length < 2) return [];

  const schoolHits = MOCK_SCHOOLS.map((school) => ({
    score: bestScore(
      [school.name, school.abbreviation ?? "", school.city ?? "", school.state],
      q
    ),
    suggestion: {
      id: `school-${school.slug}`,
      kind: "school" as const,
      label: school.name,
      meta: schoolMeta(school),
      href: `/schools/${school.slug}`,
    },
  })).filter((hit) => hit.score > 0);

  const courseHits = MOCK_COURSES.map((course) => ({
    score: bestScore([course.name, course.schoolName], q),
    suggestion: {
      id: `course-${course.schoolSlug}-${course.name.toLowerCase().replace(/\s+/g, "-")}`,
      kind: "course" as const,
      label: course.name,
      meta: course.schoolName,
      href: `/schools?q=${encodeURIComponent(course.name)}`,
    },
  })).filter((hit) => hit.score > 0);

  const stateHits = NIGERIA_STATES.map((state) => ({
    score: scoreMatch(state, q),
    suggestion: {
      id: `state-${state.toLowerCase().replace(/\s+/g, "-")}`,
      kind: "state" as const,
      label: state,
      meta: "Filter by state",
      href: `/schools?state=${encodeURIComponent(state)}`,
    },
  })).filter((hit) => hit.score > 0);

  const ranked = [...schoolHits, ...courseHits, ...stateHits]
    .sort(
      (a, b) =>
        b.score - a.score || a.suggestion.label.localeCompare(b.suggestion.label)
    )
    .map((hit) => hit.suggestion);

  const seen = new Set<string>();
  const unique: SearchSuggestion[] = [];
  for (const item of ranked) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    unique.push(item);
    if (unique.length >= limit) break;
  }

  return unique;
}
