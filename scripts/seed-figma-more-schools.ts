import { existsSync } from "node:fs";
import { loadEnvConfig } from "@next/env";
import { slugify } from "../lib/utils/format";

loadEnvConfig(process.cwd());

type OwnershipType = "federal" | "state" | "private";

type SchoolDraft = {
  name: string;
  aliases?: string[];
  abbreviation?: string | null;
  ownership_type?: OwnershipType;
  state?: string;
  city?: string | null;
};

const MIN_ESTIMATE = 20_000;
const MAX_ESTIMATE = 55_000;
const SESSION_NAME = "Figma reported estimate";
const COURSE_NAME = "General undergraduate fee estimate";
const ADMIN_NOTE_PREFIX =
  "Low-confidence reported range from the second Figma planning list";

const SCHOOLS: SchoolDraft[] = [
  { name: "Emmanuel Ayande University of Education", state: "Oyo" },
  { name: "Fountain University", state: "Osun", city: "Osogbo" },
  { name: "University of Ilorin", ownership_type: "federal", state: "Kwara" },
  { name: "Olabisi Onabanjo University", aliases: ["Olabisi Onabanjo University"] },
  { name: "Crawford University", state: "Ogun" },
  { name: "Hallmark University", state: "Ogun" },
  { name: "University of Medical Sciences, Ondo", ownership_type: "state", state: "Ondo" },
  { name: "University of Abuja", ownership_type: "federal", state: "FCT" },
  { name: "African University of Science and Technology", state: "FCT" },
  { name: "Baze University", state: "FCT" },
  { name: "Nile University of Nigeria", state: "FCT" },
  { name: "Veritas University", state: "FCT" },
  { name: "Joseph Sarwuan Tarka University", aliases: ["Joseph Sarwuan Tarka University (JOSTUM)"], ownership_type: "federal", state: "Benue" },
  { name: "Benue State University", aliases: ["Benue State University, Makurdi (BSU)"], ownership_type: "state", state: "Benue", city: "Makurdi" },
  { name: "University of Mkar", state: "Benue" },
  { name: "Federal University Lokoja", ownership_type: "federal", state: "Kogi" },
  { name: "Prince Abubakar Audu University", ownership_type: "state", state: "Kogi" },
  { name: "Salem University", state: "Kogi" },
  { name: "Kwara State University", ownership_type: "state", state: "Kwara" },
  { name: "Ahman Pategi University", state: "Kwara" },
  { name: "Al-Hikmah University", state: "Kwara" },
  { name: "Landmark University", state: "Kwara" },
  { name: "Summit University", state: "Kwara" },
  { name: "Federal University Lafia", ownership_type: "federal", state: "Nasarawa" },
  { name: "Nasarawa State University", aliases: ["Nasarawa State University, Keffi (NSUK)"], ownership_type: "state", state: "Nasarawa" },
  { name: "Ave Maria University", state: "Nasarawa" },
  { name: "Bingham University", state: "Nasarawa" },
  { name: "Mewar University", state: "Nasarawa" },
  { name: "University of Port Harcourt", ownership_type: "federal", state: "Rivers" },
  { name: "Rivers State University", aliases: ["Rivers State University (RSU)"], ownership_type: "state", state: "Rivers" },
  { name: "Madonna University", state: "Rivers" },
  { name: "PAMO University of Medical Sciences", state: "Rivers" },
  { name: "Benson Idahosa University", state: "Edo" },
  { name: "Igbinedion University", state: "Edo" },
  { name: "Mudiame University", state: "Edo" },
  { name: "Samuel Adegboyega University", state: "Edo" },
  { name: "Ambrose Alli University", ownership_type: "state", state: "Edo" },
  { name: "Edo State University", ownership_type: "state", state: "Edo" },
  { name: "University of Benin", ownership_type: "federal", state: "Edo" },
  { name: "Claretian University", state: "Imo" },
  { name: "Hezekiah University", state: "Imo" },
  { name: "Imo State University", ownership_type: "state", state: "Imo" },
  { name: "Kingsley Ozumba Mbadiwe University", ownership_type: "state", state: "Imo" },
  { name: "Alvan Ikoku Federal University of Education", ownership_type: "federal", state: "Imo" },
  { name: "Federal University of Technology, Owerri", aliases: ["Federal University of Technology Owerri", "Federal University of Technology, Owerri (FUTO)"], abbreviation: "FUTO", ownership_type: "federal", state: "Imo" },
  { name: "Renaissance University", state: "Enugu" },
  { name: "Peaceland University", state: "Enugu" },
  { name: "Godfrey Okoye University", state: "Enugu" },
  { name: "Coal City University", state: "Enugu" },
  { name: "Caritas University", state: "Enugu" },
  { name: "Enugu State University of Science and Technology", ownership_type: "state", state: "Enugu" },
  { name: "University of Nigeria, Nsukka", abbreviation: "UNN", ownership_type: "federal", state: "Enugu" },
  { name: "Evangel University, Akaeze", state: "Ebonyi" },
  { name: "Ebonyi State University", aliases: ["Ebonyi State University, Abakaliki (EBSU)"], ownership_type: "state", state: "Ebonyi" },
  { name: "Alex Ekwueme Federal University, Ndufu-Alike, Ikwo", aliases: ["Alex Ekwueme Federal University Ndufu Alike Ikwo", "Alex Ekwueme Federal University, Ndufu- Alike, Ikwo (AE-FUNAI)"], abbreviation: "AE-FUNAI", ownership_type: "federal", state: "Ebonyi" },
  { name: "Paul University", state: "Anambra" },
  { name: "Legacy University Okija", state: "Anambra" },
  { name: "Chukwuemeka Odumegwu Ojukwu University", aliases: ["Chukwuemeka Odumegwu Ojukwu University (COOU)"], ownership_type: "state", state: "Anambra" },
  { name: "Nnamdi Azikiwe University", abbreviation: "UNIZIK", ownership_type: "federal", state: "Anambra" },
  { name: "Clifford University", state: "Abia" },
  { name: "Gregory University", state: "Abia" },
  { name: "Rhema University", state: "Abia" },
  { name: "Abia State University", aliases: ["Abia State University, Uturu (ABSU)"], ownership_type: "state", state: "Abia" },
  { name: "Michael Okpara University of Agriculture, Umudike", aliases: ["Michael Okpara University of Agriculture, Umudike (MOUAU)"], abbreviation: "MOUAU", ownership_type: "federal", state: "Abia" },
  { name: "Federal University, Gusau", aliases: ["Federal University Gusau", "Federal University, Gusau (FUGUS)"], abbreviation: "FUGUS", ownership_type: "federal", state: "Zamfara" },
  { name: "Gombe State University of Science and Technology", abbreviation: "GSUST", ownership_type: "state", state: "Gombe" },
  { name: "Gombe State University", ownership_type: "state", state: "Gombe" },
  { name: "Delta State University", aliases: ["Delta State University, Abraka (DELSU)"], ownership_type: "state", state: "Delta" },
  { name: "Zamfara State University", ownership_type: "state", state: "Zamfara" },
  { name: "Moshood Abiola University of Science and Technology", abbreviation: "MAUSTECH", ownership_type: "state", state: "Ogun" },
  { name: "Kebbi State University of Science and Technology", ownership_type: "state", state: "Kebbi" },
  { name: "Bayelsa Medical University", abbreviation: "BMU", ownership_type: "state", state: "Bayelsa" },
  { name: "Bayero University, Kano", ownership_type: "federal", state: "Kano" },
  { name: "Federal University of Petroleum Resources, Effurun", abbreviation: "FUPRE", ownership_type: "federal", state: "Delta" },
  { name: "University of Calabar", abbreviation: "UNICAL", ownership_type: "federal", state: "Cross River" },
  { name: "Federal University, Dutse", abbreviation: "FUD", ownership_type: "federal", state: "Jigawa" },
  { name: "University of Jos", abbreviation: "UNIJOS", ownership_type: "federal", state: "Plateau" },
  { name: "Federal University, Dutsin-Ma", abbreviation: "FUDMA", ownership_type: "federal", state: "Katsina" },
  { name: "University of Maiduguri", abbreviation: "UNIMAID", ownership_type: "federal", state: "Borno" },
  { name: "University of Uyo", ownership_type: "federal", state: "Akwa Ibom" },
  { name: "Usmanu Danfodiyo University, Sokoto", abbreviation: "UDUSOK", ownership_type: "federal", state: "Sokoto" },
  { name: "Federal University, Wukari", abbreviation: "FUWUKARI", ownership_type: "federal", state: "Taraba" },
  { name: "Nigeria Maritime University, Okerenkoko", abbreviation: "NMU", ownership_type: "federal", state: "Delta" },
  { name: "Federal University, Birnin Kebbi", abbreviation: "FUBK", ownership_type: "federal", state: "Kebbi" },
  { name: "Air Force Institute of Technology, Kaduna", abbreviation: "AFIT", ownership_type: "federal", state: "Kaduna" },
  { name: "Nigerian Army University Biu", abbreviation: "NAUB", ownership_type: "federal", state: "Borno" },
  { name: "Federal University of Health Science, Otukpo", ownership_type: "federal", state: "Benue" },
  { name: "Modibbo Adama University of Technology, Yola", abbreviation: "MAUTEC", ownership_type: "federal", state: "Adamawa" },
  { name: "Federal University of Transportation Daura, Katsina", abbreviation: "FUTD", ownership_type: "federal", state: "Katsina" },
  { name: "National Open University of Nigeria", abbreviation: "NOUN", ownership_type: "federal", state: "FCT" },
  { name: "Nigerian Defence Academy, Kaduna", abbreviation: "NDA", ownership_type: "federal", state: "Kaduna" },
  { name: "Federal University of Technology, Babura", abbreviation: "FUTB", ownership_type: "federal", state: "Jigawa" },
  { name: "Federal University of Agriculture, Zuru", abbreviation: "FUAZ", ownership_type: "federal", state: "Kebbi" },
  { name: "Federal University of Technology, Ikot Abasi", abbreviation: "FUTIA", ownership_type: "federal", state: "Akwa Ibom" },
  { name: "Federal University of Health Sciences, Ila-Orangun", abbreviation: "FUHSI", ownership_type: "federal", state: "Osun" },
  { name: "David Umahi Federal University of Health Sciences", abbreviation: "DUFUHS", ownership_type: "federal", state: "Ebonyi" },
  { name: "Federal University of Education, Kano", abbreviation: "FUEK", ownership_type: "federal", state: "Kano" },
  { name: "Admiralty University of Nigeria, Ibusa", abbreviation: "ADUN", state: "Delta" },
  { name: "National University of Science and Technology", abbreviation: "NAUST", ownership_type: "federal", state: "FCT" },
  { name: "Adeyemi Federal University of Education", abbreviation: "AFUED", ownership_type: "federal", state: "Ondo" },
  { name: "Federal University of Medical and Health Sciences, Kwale", ownership_type: "federal", state: "Delta" },
  { name: "Federal University of Health Sciences, Katsina", ownership_type: "federal", state: "Katsina" },
  { name: "Federal University of Agriculture, Mubi", abbreviation: "FUAMB", ownership_type: "federal", state: "Adamawa" },
  { name: "Federal University of Education, Zaria", abbreviation: "FUEZ", ownership_type: "federal", state: "Kaduna" },
  { name: "Federal University of Agriculture, Bassambiri", abbreviation: "FUAB", ownership_type: "federal", state: "Bayelsa" },
  { name: "Olusegun Agagu University of Science and Technology", abbreviation: "OAUSTECH", ownership_type: "state", state: "Ondo" },
  { name: "Ibrahim Badamasi Babangida University, Lapai", abbreviation: "IBBU", ownership_type: "state", state: "Niger" },
  { name: "Yusuf Maitama Sule University, Kano", abbreviation: "YUMSUK", ownership_type: "state", state: "Kano" },
  { name: "Sokoto State University", abbreviation: "SSU", ownership_type: "state", state: "Sokoto" },
  { name: "Taraba State University, Jalingo", abbreviation: "TASU", ownership_type: "state", state: "Taraba" },
  { name: "University of Cross River State", abbreviation: "UNICROSS", ownership_type: "state", state: "Cross River" },
  { name: "Umaru Musa Yar'adua University Katsina", abbreviation: "UMYU", ownership_type: "state", state: "Katsina" },
  { name: "Yobe State University, Damaturu", abbreviation: "YSU", ownership_type: "state", state: "Yobe" },
  { name: "Plateau State University, Bokkos", abbreviation: "PLASU", ownership_type: "state", state: "Plateau" },
  { name: "Sa'adu Zungur University", abbreviation: "SAZU", ownership_type: "state", state: "Bauchi" },
  { name: "Niger Delta University", abbreviation: "NDU", ownership_type: "state", state: "Bayelsa" },
  { name: "Akwa Ibom State University", abbreviation: "AKSU", ownership_type: "state", state: "Akwa Ibom" },
  { name: "Adamawa State University, Mubi", abbreviation: "ADSU", ownership_type: "state", state: "Adamawa" },
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

function logoUrl(slug: string) {
  const path = `public/schools/logos/${slug}.png`;
  return existsSync(path) ? `/schools/logos/${slug}.png` : null;
}

function inferOwnership(school: SchoolDraft): OwnershipType {
  if (school.ownership_type) return school.ownership_type;
  if (/\bFederal\b|\bNational Open University\b|\bUniversity of (Ilorin|Abuja|Port Harcourt|Benin|Nigeria|Calabar|Jos|Maiduguri|Uyo)\b/i.test(school.name)) {
    return "federal";
  }
  if (/\bState University\b|\bUniversity of Medical Sciences\b|\bUniversity of Cross River State\b/i.test(school.name)) {
    return "state";
  }
  return "private";
}

async function findInstitution(slug: string, aliases: string[]) {
  const slugs = [slug, ...aliases.map(slugify)];
  const slugFilter = slugs.map((value) => `"${value}"`).join(",");
  const bySlug = await rest<Array<{ id: string; name: string; slug: string; logo_url: string | null }>>(
    `/rest/v1/institutions?slug=in.(${slugFilter})&select=id,name,slug,logo_url`
  );
  return bySlug[0] ?? null;
}

async function ensureInstitution(school: SchoolDraft) {
  const slug = slugify(school.name);
  const existing = await findInstitution(slug, school.aliases ?? []);
  const localLogoUrl = logoUrl(slug);

  if (existing) {
    if (!existing.logo_url && localLogoUrl) {
      await rest(`/rest/v1/institutions?id=eq.${existing.id}`, {
        method: "PATCH",
        prefer: "return=minimal",
        body: { logo_url: localLogoUrl },
      });
    }
    return { id: existing.id, slug: existing.slug, name: existing.name, created: false };
  }

  const created = await rest<Array<{ id: string; name: string; slug: string }>>(
    "/rest/v1/institutions",
    {
      method: "POST",
      prefer: "return=representation",
      body: [
        {
          name: school.name,
          slug,
          abbreviation: school.abbreviation ?? null,
          logo_url: localLogoUrl,
          institution_type: "university",
          ownership_type: inferOwnership(school),
          state: school.state ?? "Unknown",
          city: school.city ?? null,
          website_url: null,
          description:
            "Added from the second low-confidence Figma coverage list. Fee records should be replaced with verified school-source data.",
          is_active: true,
        },
      ],
    }
  );
  if (!created[0]) throw new Error(`Could not create ${school.name}`);
  return { ...created[0], created: true };
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
          name: SESSION_NAME,
          start_year: 2026,
          end_year: 2027,
          is_current: false,
        },
      ],
    }
  );
  if (!sessions[0]) throw new Error("Could not create Figma estimate session");
  return sessions[0];
}

async function ensureCourse(institutionId: string) {
  const courses = await rest<Array<{ id: string }>>(
    "/rest/v1/courses?on_conflict=institution_id,slug",
    {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=representation",
      body: [
        {
          institution_id: institutionId,
          faculty_id: null,
          name: COURSE_NAME,
          slug: slugify(COURSE_NAME),
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
    `/rest/v1/fee_records?institution_id=eq.${institutionId}&source_type=eq.community_reported&confidence_level=eq.low&admin_note=ilike.*${encodeURIComponent(ADMIN_NOTE_PREFIX)}*&select=id`
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
  school: SchoolDraft;
  institutionId: string;
  courseId: string;
  sessionId: string;
  amount: number;
  level: string;
}) {
  const range = `NGN ${MIN_ESTIMATE.toLocaleString("en-NG")} - ${MAX_ESTIMATE.toLocaleString("en-NG")}`;
  const note = [
    `${ADMIN_NOTE_PREFIX}: ${range}.`,
    "No primary school source has been confirmed yet.",
    "This placeholder came from the Figma school coverage list and should be replaced after reviewing an official fee circular, portal page, or student evidence.",
  ].join(" ");

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
  if (!record) throw new Error(`Could not insert ${input.school.name} ${input.level}`);

  await rest("/rest/v1/fee_items", {
    method: "POST",
    prefer: "return=minimal",
    body: [
      {
        fee_record_id: record.id,
        name: input.level,
        original_label: "Figma reported estimate",
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

async function publishInsertedEstimateRecords() {
  await rest(`/rest/v1/fee_records?admin_note=ilike.*${encodeURIComponent(ADMIN_NOTE_PREFIX)}*`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: { is_published: true },
  });
}

async function main() {
  const seen = new Set<string>();
  let created = 0;
  let updated = 0;

  for (const school of SCHOOLS) {
    const slug = slugify(school.name);
    if (seen.has(slug)) continue;
    seen.add(slug);

    const institution = await ensureInstitution(school);
    const session = await ensureSession(institution.id);
    const course = await ensureCourse(institution.id);
    await deletePriorEstimateRecords(institution.id);
    await insertEstimateRecord({
      school,
      institutionId: institution.id,
      courseId: course.id,
      sessionId: session.id,
      amount: MIN_ESTIMATE,
      level: "Reported lower estimate",
    });
    await insertEstimateRecord({
      school,
      institutionId: institution.id,
      courseId: course.id,
      sessionId: session.id,
      amount: MAX_ESTIMATE,
      level: "Reported upper estimate",
    });

    if (institution.created) created += 1;
    else updated += 1;
    console.log(`${school.name}: added low-confidence Figma estimate`);
  }

  await publishInsertedEstimateRecords();
  console.log(`Done. Created ${created} institutions, updated ${updated} existing institutions.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
