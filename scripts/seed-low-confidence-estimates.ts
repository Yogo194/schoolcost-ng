import { loadEnvConfig } from "@next/env";
import { slugify } from "../lib/utils/format";

loadEnvConfig(process.cwd());

type Estimate = {
  name: string;
  slug: string;
  min: number;
  max: number;
  note?: string;
  institution?: {
    abbreviation: string | null;
    ownership_type: "federal" | "state" | "private";
    state: string;
    city: string | null;
    website_url: string | null;
  };
};

const ESTIMATES: Estimate[] = [
  {
    name: "Anchor University",
    slug: "anchor-university",
    min: 507_500,
    max: 2_126_563,
  },
  {
    name: "Augustine University",
    slug: "augustine-university",
    min: 976_650,
    max: 1_700_000,
  },
  {
    name: "Caleb University",
    slug: "caleb-university",
    min: 700_000,
    max: 1_500_000,
  },
  {
    name: "Ekiti State University",
    slug: "ekiti-state-university",
    min: 250_000,
    max: 1_100_000,
    note: "Upper value was listed as over this amount in the planning range.",
  },
  {
    name: "Federal University of Agriculture, Abeokuta",
    slug: "federal-university-of-agriculture-abeokuta",
    min: 107_500,
    max: 205_000,
  },
  {
    name: "Federal University of Technology, Akure",
    slug: "federal-university-of-technology-akure",
    min: 50_000,
    max: 80_000,
  },
  {
    name: "Ladoke Akintola University of Technology",
    slug: "ladoke-akintola-university-of-technology",
    min: 100_000,
    max: 200_000,
  },
  {
    name: "Lagos State University",
    slug: "lagos-state-university",
    min: 90_000,
    max: 300_000,
  },
  {
    name: "Mountain Top University",
    slug: "mountain-top-university",
    min: 400_000,
    max: 900_000,
  },
  {
    name: "Olabisi Onabanjo University",
    slug: "olabisi-onabanjo-university",
    min: 190_000,
    max: 350_000,
  },
  {
    name: "Osun State University",
    slug: "osun-state-university",
    min: 95_000,
    max: 1_350_000,
  },
  {
    name: "Tai Solarin University of Education",
    slug: "tai-solarin-university-of-education",
    min: 76_500,
    max: 96_500,
  },
  {
    name: "Elizade University",
    slug: "elizade-university",
    min: 1_030_000,
    max: 2_460_000,
    institution: {
      abbreviation: null,
      ownership_type: "private",
      state: "Ondo",
      city: "Ilara-Mokin",
      website_url: "https://www.elizadeuniversity.edu.ng",
    },
  },
];

function requireEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return { url, key };
}

async function rest<T>(
  path: string,
  options: { method?: string; body?: unknown; prefer?: string } = {}
): Promise<T> {
  const { url, key } = requireEnv();
  const response = await fetch(`${url}${path}`, {
    method: options.method ?? "GET",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(options.prefer ? { Prefer: options.prefer } : {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (!response.ok) {
    throw new Error(
      `${options.method ?? "GET"} ${path} -> ${response.status}: ${await response.text()}`
    );
  }

  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

async function ensureInstitution(estimate: Estimate) {
  const existing = await rest<Array<{ id: string; name: string }>>(
    `/rest/v1/institutions?slug=eq.${encodeURIComponent(estimate.slug)}&select=id,name`
  );
  if (existing[0]) return existing[0];
  if (!estimate.institution) {
    throw new Error(`Institution ${estimate.name} is missing and no draft metadata was provided.`);
  }

  const created = await rest<Array<{ id: string; name: string }>>(
    "/rest/v1/institutions",
    {
      method: "POST",
      prefer: "return=representation",
      body: [
        {
          name: estimate.name,
          slug: estimate.slug,
          abbreviation: estimate.institution.abbreviation,
          logo_url: null,
          institution_type: "university",
          ownership_type: estimate.institution.ownership_type,
          state: estimate.institution.state,
          city: estimate.institution.city,
          website_url: estimate.institution.website_url,
          description:
            "Added from the initial low-confidence coverage list. Fee records should be replaced with verified school-source data.",
          is_active: true,
        },
      ],
    }
  );
  if (!created[0]) throw new Error(`Could not create ${estimate.name}`);
  return created[0];
}

async function ensureSession(institutionId: string) {
  const sessions = await rest<Array<{ id: string }>>(
    "/rest/v1/academic_sessions?on_conflict=institution_id,name",
    {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=representation",
      body: [
        {
          institution_id: institutionId,
          name: "Reported estimate",
          start_year: 2026,
          end_year: 2027,
          is_current: false,
        },
      ],
    }
  );
  if (!sessions[0]) throw new Error("Could not create reported estimate session");
  return sessions[0];
}

async function ensureCourse(institutionId: string) {
  const name = "General undergraduate fee estimate";
  const courses = await rest<Array<{ id: string }>>(
    "/rest/v1/courses?on_conflict=institution_id,slug",
    {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=representation",
      body: [
        {
          institution_id: institutionId,
          faculty_id: null,
          name,
          slug: slugify(name),
          duration_years: 4,
          qualification: "Bachelors",
          is_active: true,
        },
      ],
    }
  );
  if (!courses[0]) throw new Error("Could not create estimate course");
  return courses[0];
}

async function deletePriorEstimateRecords(institutionId: string) {
  const records = await rest<Array<{ id: string }>>(
    `/rest/v1/fee_records?institution_id=eq.${institutionId}&source_type=eq.community_reported&confidence_level=eq.low&admin_note=ilike.*low-confidence%20reported%20range%20from%20the%20initial%20Figma%20planning%20list*&select=id`
  );
  for (const record of records) {
    await rest(`/rest/v1/evidence?fee_record_id=eq.${record.id}`, {
      method: "DELETE",
      prefer: "return=minimal",
    });
    await rest(`/rest/v1/fee_items?fee_record_id=eq.${record.id}`, {
      method: "DELETE",
      prefer: "return=minimal",
    });
  }
  if (records.length) {
    await rest(
      `/rest/v1/fee_records?id=in.(${records.map((record) => record.id).join(",")})`,
      { method: "DELETE", prefer: "return=minimal" }
    );
  }
}

async function insertEstimateRecord(input: {
  estimate: Estimate;
  institutionId: string;
  courseId: string;
  sessionId: string;
  amount: number;
  level: string;
}) {
  const range = `NGN ${input.estimate.min.toLocaleString("en-NG")} - ${input.estimate.max.toLocaleString("en-NG")}`;
  const note = [
    `Low-confidence reported range from the initial Figma planning list: ${range}.`,
    "No primary school source has been confirmed yet.",
    "Use this only as a placeholder until an official fee circular, portal page, or student evidence is reviewed.",
    input.estimate.note,
  ]
    .filter(Boolean)
    .join(" ");

  const records = await rest<Array<{ id: string }>>("/rest/v1/fee_records", {
    method: "POST",
    prefer: "return=representation",
    body: [
      {
        institution_id: input.institutionId,
        course_id: input.courseId,
        academic_session_id: input.sessionId,
        level: input.level,
        student_type: "fresh",
        currency: "NGN",
        compulsory_total: input.amount,
        optional_total: 0,
        accommodation_total: 0,
        first_year_total: input.amount,
        returning_year_total: input.amount,
        estimated_degree_total: input.amount * 4,
        verification_status: "reported",
        confidence_level: "low",
        source_type: "community_reported",
        last_reviewed_at: new Date().toISOString(),
        review_due_at: null,
        is_published: true,
        admin_note: note,
      },
    ],
  });
  const record = records[0];
  if (!record) throw new Error(`Could not insert ${input.estimate.name} ${input.level}`);

  await rest("/rest/v1/fee_items", {
    method: "POST",
    prefer: "return=minimal",
    body: [
      {
        fee_record_id: record.id,
        name: input.level,
        original_label: "Reported estimate",
        category: "tuition",
        amount: input.amount,
        is_compulsory: true,
        frequency: "recurring",
        applies_to: "all_students",
        description: note,
      },
    ],
  });

  await rest("/rest/v1/evidence", {
    method: "POST",
    prefer: "return=minimal",
    body: [
      {
        fee_record_id: record.id,
        submission_id: null,
        source_type: "public_school_notice",
        source_url: null,
        file_url: null,
        evidence_date: null,
        review_status: "pending",
        submitted_by_email: null,
        admin_note: note,
      },
    ],
  });
}

async function main() {
  for (const estimate of ESTIMATES) {
    const institution = await ensureInstitution(estimate);
    const session = await ensureSession(institution.id);
    const course = await ensureCourse(institution.id);
    await deletePriorEstimateRecords(institution.id);
    await insertEstimateRecord({
      estimate,
      institutionId: institution.id,
      courseId: course.id,
      sessionId: session.id,
      amount: estimate.min,
      level: "Reported lower estimate",
    });
    if (estimate.max !== estimate.min) {
      await insertEstimateRecord({
        estimate,
        institutionId: institution.id,
        courseId: course.id,
        sessionId: session.id,
        amount: estimate.max,
        level: "Reported upper estimate",
      });
    }
    console.log(
      `${estimate.name}: added low-confidence reported estimate ${estimate.min.toLocaleString("en-NG")} - ${estimate.max.toLocaleString("en-NG")}`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

