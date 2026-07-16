import type { InstitutionType, OwnershipType } from "@/types/database";

export interface SchoolsDirectoryItem {
  id: string;
  name: string;
  slug: string;
  abbreviation: string | null;
  city: string | null;
  state: string;
  institution_type: InstitutionType;
  ownership_type: OwnershipType;
  logo_url: string | null;
  /** Lowest published first-year compulsory total, if known. */
  first_year_from: number | null;
}

/** Directory mock used when Supabase has no institutions yet. */
export const MOCK_SCHOOLS_DIRECTORY: SchoolsDirectoryItem[] = [
  {
    id: "mock-unilag",
    name: "University of Lagos",
    slug: "university-of-lagos",
    abbreviation: "UNILAG",
    city: "Akoka",
    state: "Lagos",
    institution_type: "university",
    ownership_type: "federal",
    logo_url: "/figma/school-unilag-crest.png",
    first_year_from: 285_000,
  },
  {
    id: "mock-ui",
    name: "University of Ibadan",
    slug: "university-of-ibadan",
    abbreviation: "UI",
    city: "Ibadan",
    state: "Oyo",
    institution_type: "university",
    ownership_type: "federal",
    logo_url: null,
    first_year_from: 228_000,
  },
  {
    id: "mock-oau",
    name: "Obafemi Awolowo University",
    slug: "obafemi-awolowo-university",
    abbreviation: "OAU",
    city: "Ile-Ife",
    state: "Osun",
    institution_type: "university",
    ownership_type: "federal",
    logo_url: null,
    first_year_from: 205_000,
  },
  {
    id: "mock-lasu",
    name: "Lagos State University",
    slug: "lagos-state-university",
    abbreviation: "LASU",
    city: "Ojo",
    state: "Lagos",
    institution_type: "university",
    ownership_type: "state",
    logo_url: null,
    first_year_from: 295_000,
  },
  {
    id: "mock-covenant",
    name: "Covenant University",
    slug: "covenant-university",
    abbreviation: "CU",
    city: "Ota",
    state: "Ogun",
    institution_type: "university",
    ownership_type: "private",
    logo_url: "/figma/logo-covenant.png",
    first_year_from: 1_250_000,
  },
  {
    id: "mock-babcock",
    name: "Babcock University",
    slug: "babcock-university",
    abbreviation: "BU",
    city: "Ilishan-Remo",
    state: "Ogun",
    institution_type: "university",
    ownership_type: "private",
    logo_url: "/figma/logo-babcock.png",
    first_year_from: 980_000,
  },
  {
    id: "mock-abuad",
    name: "Afe Babalola University",
    slug: "afe-babalola-university",
    abbreviation: "ABUAD",
    city: "Ado-Ekiti",
    state: "Ekiti",
    institution_type: "university",
    ownership_type: "private",
    logo_url: "/figma/logo-abuad.png",
    first_year_from: 1_100_000,
  },
  {
    id: "mock-uniben",
    name: "University of Benin",
    slug: "university-of-benin",
    abbreviation: "UNIBEN",
    city: "Benin City",
    state: "Edo",
    institution_type: "university",
    ownership_type: "federal",
    logo_url: null,
    first_year_from: 198_000,
  },
  {
    id: "mock-rsu",
    name: "Rivers State University",
    slug: "rivers-state-university",
    abbreviation: "RSU",
    city: "Port Harcourt",
    state: "Rivers",
    institution_type: "university",
    ownership_type: "state",
    logo_url: null,
    first_year_from: 240_000,
  },
  {
    id: "mock-abu",
    name: "Ahmadu Bello University",
    slug: "ahmadu-bello-university",
    abbreviation: "ABU",
    city: "Zaria",
    state: "Kaduna",
    institution_type: "university",
    ownership_type: "federal",
    logo_url: null,
    first_year_from: 175_000,
  },
  {
    id: "mock-unizik",
    name: "Nnamdi Azikiwe University",
    slug: "nnamdi-azikiwe-university",
    abbreviation: "UNIZIK",
    city: "Awka",
    state: "Anambra",
    institution_type: "university",
    ownership_type: "federal",
    logo_url: null,
    first_year_from: 188_000,
  },
  {
    id: "mock-landmark",
    name: "Landmark University",
    slug: "landmark-university",
    abbreviation: "LMU",
    city: "Omu-Aran",
    state: "Kwara",
    institution_type: "university",
    ownership_type: "private",
    logo_url: null,
    first_year_from: 720_000,
  },
  {
    id: "mock-yabatech",
    name: "Yaba College of Technology",
    slug: "yaba-college-of-technology",
    abbreviation: "YABATECH",
    city: "Yaba",
    state: "Lagos",
    institution_type: "polytechnic",
    ownership_type: "federal",
    logo_url: null,
    first_year_from: 95_000,
  },
  {
    id: "mock-funaab",
    name: "Federal University of Agriculture, Abeokuta",
    slug: "federal-university-of-agriculture-abeokuta",
    abbreviation: "FUNAAB",
    city: "Abeokuta",
    state: "Ogun",
    institution_type: "university",
    ownership_type: "federal",
    logo_url: null,
    first_year_from: 165_000,
  },
  {
    id: "mock-laspotech",
    name: "Lagos State Polytechnic",
    slug: "lagos-state-polytechnic",
    abbreviation: "LASPOTECH",
    city: "Ikorodu",
    state: "Lagos",
    institution_type: "polytechnic",
    ownership_type: "state",
    logo_url: null,
    first_year_from: 110_000,
  },
];

export const POPULAR_STATES = [
  "Lagos",
  "Oyo",
  "Ogun",
  "Osun",
  "Rivers",
  "Edo",
  "Anambra",
  "Kaduna",
  "Ekiti",
  "Kwara",
  "FCT",
] as const;

export function filterSchoolsDirectory(
  schools: SchoolsDirectoryItem[],
  params: {
    q?: string;
    state?: string;
    institution_type?: string;
    ownership_type?: string;
  }
): SchoolsDirectoryItem[] {
  const q = params.q?.trim().toLowerCase() ?? "";

  return schools.filter((school) => {
    if (params.state && school.state !== params.state) return false;
    if (params.institution_type && school.institution_type !== params.institution_type) {
      return false;
    }
    if (params.ownership_type && school.ownership_type !== params.ownership_type) {
      return false;
    }
    if (!q) return true;

    const hay = [
      school.name,
      school.abbreviation ?? "",
      school.city ?? "",
      school.state,
    ]
      .join(" ")
      .toLowerCase();

    return hay.includes(q);
  });
}
