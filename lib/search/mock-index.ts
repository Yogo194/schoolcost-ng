import { NIGERIA_STATES } from "@/types/institution";
import { createSchoolSearchIndex } from "./school-search";
import type { SearchSuggestion } from "./types";

interface MockSchool {
  name: string;
  slug: string;
  abbreviation: string | null;
  aliases?: readonly string[];
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

/* All three suggestion kinds share the ranked, typo-tolerant engine from
   school-search.ts. Indexes are built once at module load. */

const schoolIndex = createSchoolSearchIndex(MOCK_SCHOOLS);

const courseIndex = createSchoolSearchIndex(
  MOCK_COURSES.map((course) => ({
    ...course,
    // The engine matches on name and aliases; a course "aliases" its school.
    aliases: [course.schoolName],
  }))
);

const stateIndex = createSchoolSearchIndex(
  NIGERIA_STATES.map((state) => ({ name: state }))
);

export function getMockSearchSuggestions(
  query: string,
  limit = 8
): SearchSuggestion[] {
  const q = query.trim();
  if (q.length < 2) return [];

  const schoolHits = schoolIndex.searchScored(q).map(({ item, score }) => ({
    score,
    suggestion: {
      id: `school-${item.slug}`,
      kind: "school" as const,
      label: item.name,
      meta: schoolMeta(item),
      href: `/schools/${item.slug}`,
    },
  }));

  const courseHits = courseIndex.searchScored(q).map(({ item, score }) => ({
    score,
    suggestion: {
      id: `course-${item.schoolSlug}-${item.name.toLowerCase().replace(/\s+/g, "-")}`,
      kind: "course" as const,
      label: item.name,
      meta: item.schoolName,
      href: `/schools?q=${encodeURIComponent(item.name)}`,
    },
  }));

  const stateHits = stateIndex.searchScored(q).map(({ item, score }) => ({
    score,
    suggestion: {
      id: `state-${item.name.toLowerCase().replace(/\s+/g, "-")}`,
      kind: "state" as const,
      label: item.name,
      meta: "Filter by state",
      href: `/schools?state=${encodeURIComponent(item.name)}`,
    },
  }));

  const ranked = [...schoolHits, ...courseHits, ...stateHits]
    .filter((hit) => hit.score > 0)
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
