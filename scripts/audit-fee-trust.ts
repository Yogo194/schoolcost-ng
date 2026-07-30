/**
 * End-to-end consistency check for published fee records.
 *
 *   npx --yes tsx scripts/audit-fee-trust.ts --strict
 *
 * Flags:
 * - schools with published fees but no approved source URL
 * - trust labels that disagree with the evidence host
 * - stale sessions still marked as current (not outdated)
 * - price-comparable rows with zero/missing first-year totals
 * - directory "empty" lie: published fees that cannot show a from-price
 */
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

type Row = {
  id: string;
  institution_id: string;
  first_year_total: number | null;
  compulsory_total: number | null;
  level: string | null;
  student_type: string | null;
  verification_status: string;
  confidence_level: string;
  source_type: string;
  is_published: boolean;
  institutions: {
    name: string;
    slug: string;
    website_url: string | null;
    is_active: boolean;
  } | null;
  academic_sessions: { name: string; end_year: number | null } | null;
  courses: { name: string; is_active: boolean } | null;
  evidence: Array<{
    review_status: string;
    source_url: string | null;
  }>;
};

function requireEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return { url, key };
}

async function fetchAll(): Promise<Row[]> {
  const { url, key } = requireEnv();
  const pageSize = 1000;
  const rows: Row[] = [];
  for (let offset = 0; ; offset += pageSize) {
    const response = await fetch(
      `${url}/rest/v1/fee_records?is_published=eq.true` +
        `&select=id,institution_id,first_year_total,compulsory_total,level,student_type,verification_status,confidence_level,source_type,is_published,institutions(name,slug,website_url,is_active),academic_sessions(name,end_year),courses(name,is_active),evidence(review_status,source_url)` +
        `&order=id.asc&limit=${pageSize}&offset=${offset}`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    );
    if (!response.ok) throw new Error(`${response.status}: ${await response.text()}`);
    const page = (await response.json()) as Row[];
    rows.push(...page);
    if (page.length < pageSize) break;
  }
  return rows;
}

function canUseForPriceComparison(status: string, confidence: string): boolean {
  return (
    confidence !== "low" &&
    (status === "officially_verified" || status === "community_verified")
  );
}

function hostOf(raw: string | null | undefined): string {
  if (!raw) return "";
  try {
    return new URL(raw).host.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function rootOf(host: string): string {
  const parts = host.split(".");
  if (parts.length <= 2) return host;
  // keep last 3 for *.edu.ng style hosts
  if (host.endsWith(".edu.ng") || host.endsWith(".gov.ng")) {
    return parts.slice(-3).join(".");
  }
  return parts.slice(-2).join(".");
}

async function main() {
  const rows = await fetchAll();
  const issues: string[] = [];
  const warnings: string[] = [];

  type School = {
    name: string;
    slug: string;
    website: string;
    total: number;
    withApprovedLink: number;
    priceComparableFresh: number;
    trust: Set<string>;
    sessions: Set<string>;
    endYears: Set<number>;
    hosts: Set<string>;
    zeroFresh: number;
    inactiveCourse: number;
  };

  const bySchool = new Map<string, School>();

  for (const row of rows) {
    const slug = row.institutions?.slug ?? "unknown";
    const school = bySchool.get(slug) ?? {
      name: row.institutions?.name ?? slug,
      slug,
      website: row.institutions?.website_url ?? "",
      total: 0,
      withApprovedLink: 0,
      priceComparableFresh: 0,
      trust: new Set<string>(),
      sessions: new Set<string>(),
      endYears: new Set<number>(),
      hosts: new Set<string>(),
      zeroFresh: 0,
      inactiveCourse: 0,
    };

    school.total += 1;
    school.trust.add(
      `${row.verification_status}/${row.confidence_level}/${row.source_type}`
    );
    if (row.academic_sessions?.name) school.sessions.add(row.academic_sessions.name);
    if (row.academic_sessions?.end_year) {
      school.endYears.add(row.academic_sessions.end_year);
    }

    if (row.courses && row.courses.is_active === false) school.inactiveCourse += 1;

    const approved = (row.evidence ?? []).some(
      (item) => item.review_status === "approved" && item.source_url
    );
    if (approved) school.withApprovedLink += 1;

    for (const item of row.evidence ?? []) {
      const host = hostOf(item.source_url);
      if (host) school.hosts.add(host);
    }

    const isFreshBand =
      row.level === "100L" ||
      row.level === "Undergraduate" ||
      row.student_type === "fresh" ||
      (row.level != null && row.level.toLowerCase().includes("fresh"));

    const amount = Number(row.first_year_total ?? row.compulsory_total);
    if (isFreshBand) {
      if (!Number.isFinite(amount) || amount <= 0) school.zeroFresh += 1;
      if (canUseForPriceComparison(row.verification_status, row.confidence_level)) {
        school.priceComparableFresh += 1;
      }
    }

    // Official label but only non-school hosts in evidence
    if (row.source_type.startsWith("official")) {
      const schoolHost = rootOf(hostOf(row.institutions?.website_url));
      const evidenceHosts = (row.evidence ?? [])
        .map((item) => hostOf(item.source_url))
        .filter(Boolean);
      if (evidenceHosts.length) {
        const anySchoolish = evidenceHosts.some((host) => {
          if (host.endsWith(".edu.ng") || host.endsWith(".edu")) return true;
          if (schoolHost && rootOf(host) === schoolHost) return true;
          return false;
        });
        if (!anySchoolish) {
          issues.push(
            `${school.name}: official source_type but evidence host(s) ${evidenceHosts.join(", ")}`
          );
        }
      }
    }

    bySchool.set(slug, school);
  }

  const schools = [...bySchool.values()].sort((a, b) => a.name.localeCompare(b.name));

  console.log(`Published fee rows: ${rows.length} across ${schools.length} schools\n`);

  let directoryLie = 0;
  let missingLink = 0;
  let staleNotMarked = 0;

  for (const school of schools) {
    if (school.withApprovedLink === 0) {
      missingLink += 1;
      issues.push(`${school.name}: ${school.total} published rows, 0 approved source links`);
    } else if (school.withApprovedLink < school.total) {
      warnings.push(
        `${school.name}: ${school.total - school.withApprovedLink}/${school.total} rows lack approved source URL`
      );
    }

    if (school.total > 0 && school.priceComparableFresh === 0) {
      directoryLie += 1;
      // Not an error after the UI fix, but still worth reporting.
      warnings.push(
        `${school.name}: has ${school.total} published fees but no price-comparable fresh row (directory shows "Fees listed · open to view")`
      );
    }

    const newestEnd = school.endYears.size ? Math.max(...school.endYears) : 0;
    const trustLine = [...school.trust].join(" ; ");
    const markedOutdated = [...school.trust].every((t) => t.startsWith("outdated/"));
    if (newestEnd > 0 && newestEnd < 2026 && !markedOutdated) {
      staleNotMarked += 1;
      issues.push(
        `${school.name}: session ends ${newestEnd} but trust is not outdated (${trustLine})`
      );
    }

    if (school.zeroFresh > 0) {
      issues.push(`${school.name}: ${school.zeroFresh} fresh/100L rows with zero/missing first-year total`);
    }

    if (school.inactiveCourse > 0) {
      warnings.push(
        `${school.name}: ${school.inactiveCourse} published fee rows point at inactive courses`
      );
    }

    if (school.trust.size > 1) {
      warnings.push(`${school.name}: mixed trust labels (${trustLine})`);
    }

    console.log(
      [
        school.name,
        `rows=${school.total}`,
        `links=${school.withApprovedLink}`,
        `priceFresh=${school.priceComparableFresh}`,
        `session=${[...school.sessions].join(",")}`,
        `hosts=${[...school.hosts].join(",") || "-"}`,
        `trust=${trustLine}`,
      ].join(" | ")
    );
  }

  console.log("\n--- Summary ---");
  console.log(`Schools with published fees: ${schools.length}`);
  console.log(`Schools missing any approved source link: ${missingLink}`);
  console.log(`Schools with fees but no directory "from" price: ${directoryLie}`);
  console.log(`Stale sessions not marked outdated: ${staleNotMarked}`);
  console.log(`Hard issues: ${issues.length}`);
  console.log(`Warnings: ${warnings.length}`);

  if (issues.length) {
    console.log("\nISSUES:");
    for (const issue of [...new Set(issues)].slice(0, 50)) console.log(`  - ${issue}`);
  }
  if (warnings.length) {
    console.log("\nWARNINGS:");
    for (const warning of [...new Set(warnings)].slice(0, 80)) {
      console.log(`  - ${warning}`);
    }
  }

  if (issues.length) process.exitCode = 1;
  else console.log("\nPASS: no hard consistency issues.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
