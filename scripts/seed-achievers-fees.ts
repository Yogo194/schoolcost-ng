/**
 * Seed Achievers University undergraduate fees (official admissions fees page).
 *
 *   npx tsx scripts/seed-achievers-fees.ts
 *
 * Only programme/level cells with complete data are seeded. Cells where the
 * page left tuition unfilled (0) or used placeholders are intentionally held
 * empty (the profile then shows the contribute CTA) rather than published with
 * an understated total.
 */
import {
  ACHIEVERS_FRESH_ONE_TIME,
  ACHIEVERS_PROGRAMMES,
  ACHIEVERS_SESSION,
  ACHIEVERS_SLUG,
  ACHIEVERS_SOURCE,
  type AchieversLevel,
} from "../lib/seed/achievers-fees";
import {
  getInstitution,
  insertCourse,
  insertFeeRecord,
  type SeedLine,
  upsertSession,
  wipeInstitutionFees,
} from "../lib/seed/seed-rest";

function buildLines(row: AchieversLevel): SeedLine[] {
  const lines: SeedLine[] = [];
  const push = (
    name: string,
    category: SeedLine["category"],
    amount: number,
    description: string
  ) => {
    if (amount > 0)
      lines.push({
        name,
        category,
        amount,
        is_compulsory: true,
        frequency: "recurring",
        applies_to: "all_students",
        description,
      });
  };

  push("Tuition", "tuition", row.tuition, "Official tuition for this level.");
  push(
    "Sundry fees",
    "other",
    row.sundry,
    "Registration (1st & 2nd semesters), Sports, ICT, NHIS, hostel membership, development levy, AUSA and departmental fees. Excludes feeding, indexing, matriculation, medical tests and professional exam fees."
  );
  push(
    "Clinical / practical fee",
    "other",
    row.clinical,
    "Clinical, laboratory or practical charge for this programme."
  );
  push("ICT fee", "ict_fee", row.ict, "ICT charge.");
  push(
    "Diploma / certificate fee",
    "other",
    row.dipCert,
    "Diploma/certificate charge shown for this level."
  );
  if (row.reconcile && row.reconcile > 0) {
    push(
      "Other approved charges",
      "other",
      row.reconcile,
      "Unitemised balance so the record matches the official published total for this level."
    );
  }
  return lines;
}

async function main() {
  const institution = await getInstitution(ACHIEVERS_SLUG);
  const wiped = await wipeInstitutionFees(institution.id);
  const session = await upsertSession(
    institution.id,
    ACHIEVERS_SESSION,
    2026,
    2027,
    true
  );
  console.log(
    `\n${institution.name}: removed ${wiped.feesRemoved} fees / ${wiped.coursesRemoved} courses`
  );

  const oneTimeNote =
    `Fresh students also pay one-time charges listed separately on the page: ` +
    `acceptance N${ACHIEVERS_FRESH_ONE_TIME.acceptance.toLocaleString("en-NG")}, ` +
    `matriculation N${ACHIEVERS_FRESH_ONE_TIME.matriculation.toLocaleString("en-NG")}, ` +
    `ID card N${ACHIEVERS_FRESH_ONE_TIME.idCard.toLocaleString("en-NG")} (not included in the level total).`;

  let count = 0;
  for (const programme of ACHIEVERS_PROGRAMMES) {
    const course = await insertCourse({
      institutionId: institution.id,
      name: programme.name,
      durationYears: programme.duration_years,
    });

    for (const row of programme.levels) {
      const lines = buildLines(row);
      const total = await insertFeeRecord({
        institutionId: institution.id,
        courseId: course.id,
        sessionId: session.id,
        level: row.level,
        studentType: row.level === "100L" ? "fresh" : "returning",
        lines,
        durationYears: programme.duration_years,
        confidence: "high",
        sourceType: "official_school_source",
        adminNote:
          `${ACHIEVERS_SESSION} official fees for ${programme.name} (${programme.college}). ` +
          `Level total N${row.total.toLocaleString("en-NG")} itemised from the official page. ` +
          (row.reconcile
            ? `Includes a N${row.reconcile.toLocaleString("en-NG")} unitemised balance to match the official total. `
            : "") +
          oneTimeNote,
        evidenceUrl: ACHIEVERS_SOURCE,
        evidenceNote: "Official Achievers University admissions fees page.",
        evidenceDate: "2026-07-23",
      });
      count += 1;
      console.log(
        `  - ${programme.name} (${row.level}): N${total.toLocaleString("en-NG")}`
      );
    }
  }

  console.log(
    `\nDone. Achievers: ${ACHIEVERS_PROGRAMMES.length} programmes, ${count} fee records seeded.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
