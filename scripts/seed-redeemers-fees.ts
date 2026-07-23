/**
 * Seed Redeemer's University (RUN) obligatory school fees.
 *
 *   npx tsx scripts/seed-redeemers-fees.ts
 *
 * One all-inclusive obligatory total per programme x level (the schedule gives
 * no component breakdown). French 300L is intentionally held (source typo).
 */
import {
  REDEEMERS_PROGRAMMES,
  REDEEMERS_SESSION,
  REDEEMERS_SLUG,
  REDEEMERS_SOURCE,
} from "../lib/seed/redeemers-fees";
import {
  getInstitution,
  insertCourse,
  insertFeeRecord,
  type SeedLine,
  upsertSession,
  wipeInstitutionFees,
} from "../lib/seed/seed-rest";

const LEVELS = ["100L", "200L", "300L", "400L", "500L"] as const;

async function main() {
  const institution = await getInstitution(REDEEMERS_SLUG);
  const wiped = await wipeInstitutionFees(institution.id);
  const session = await upsertSession(
    institution.id,
    REDEEMERS_SESSION,
    2025,
    2026,
    true
  );
  console.log(
    `\n${institution.name}: removed ${wiped.feesRemoved} fees / ${wiped.coursesRemoved} courses`
  );

  let count = 0;
  for (const programme of REDEEMERS_PROGRAMMES) {
    // levels tuple order: [100L, 200L, 300L, 400L, 500L, _pad]
    const amounts = [
      programme.levels[0],
      programme.levels[1],
      programme.levels[2],
      programme.levels[3],
      programme.levels[4],
    ];
    const hasFive = amounts[4] != null;
    const durationYears = hasFive ? 5 : 4;

    const course = await insertCourse({
      institutionId: institution.id,
      name: programme.name,
      durationYears,
    });

    for (let i = 0; i < LEVELS.length; i += 1) {
      const amount = amounts[i];
      if (amount == null) continue;
      const level = LEVELS[i];
      const lines: SeedLine[] = [
        {
          name: "School fees (obligatory total)",
          category: "tuition",
          amount,
          is_compulsory: true,
          frequency: "recurring",
          applies_to: "all_students",
          description:
            "All-inclusive obligatory school fees for this level, as published on the official RUN 2025/2026 fee schedule (no component breakdown provided).",
        },
      ];
      const total = await insertFeeRecord({
        institutionId: institution.id,
        courseId: course.id,
        sessionId: session.id,
        level,
        studentType: level === "100L" ? "fresh" : "returning",
        lines,
        durationYears,
        confidence: "high",
        sourceType: "official_fee_circular",
        adminNote:
          `${REDEEMERS_SESSION} obligatory school fees for ${programme.name} (Faculty of ${programme.faculty}). ` +
          `Official RUN fee schedule gives a single total per level (no breakdown). ` +
          `A separate 200L Direct Entry price exists on the schedule but is not seeded here.` +
          (programme.name === "French"
            ? " French 300L is omitted: the source prints N133,500, a probable typo versus sibling programmes' N860,500."
            : ""),
        evidenceUrl: REDEEMERS_SOURCE,
        evidenceNote: "Official Redeemer's University 2025/2026 fee schedule PDF.",
        evidenceDate: "2025-11-01",
      });
      count += 1;
      console.log(
        `  - ${programme.name} (${level}): N${total.toLocaleString("en-NG")}`
      );
    }
  }

  console.log(
    `\nDone. Redeemer's: ${REDEEMERS_PROGRAMMES.length} programmes, ${count} fee records seeded.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
