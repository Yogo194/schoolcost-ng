/**
 * Re-seed Babcock only so instructional totals match the official table.
 *
 *   npx tsx scripts/seed-babcock-fees.ts
 */
import {
  BABCOCK_MEDICINE,
  BABCOCK_MISC,
  BABCOCK_PROGRAMMES,
  BABCOCK_SESSION,
  BABCOCK_SLUG,
  BABCOCK_SOURCE,
} from "../lib/seed/babcock-fees";
import {
  getInstitution,
  insertCourse,
  insertFeeRecord,
  type SeedLine,
  upsertSession,
  wipeInstitutionFees,
} from "../lib/seed/seed-rest";

async function main() {
  const institution = await getInstitution(BABCOCK_SLUG);
  const wiped = await wipeInstitutionFees(institution.id);
  const session = await upsertSession(
    institution.id,
    BABCOCK_SESSION,
    2025,
    2026,
    true
  );
  console.log(
    `\n${institution.name}: removed ${wiped.feesRemoved} fees / ${wiped.coursesRemoved} courses`
  );

  for (const programme of BABCOCK_PROGRAMMES) {
    const course = await insertCourse({
      institutionId: institution.id,
      name: programme.name,
      durationYears: programme.duration_years,
    });

    for (const row of programme.levels) {
      const misc = BABCOCK_MISC[row.level] ?? 0;
      const lines: SeedLine[] = [
        {
          name: "Instructional fees",
          category: "tuition",
          amount: row.instructional,
          is_compulsory: true,
          frequency: "recurring",
          applies_to: "all_students",
          description:
            "Official full-year instructional total (tuition, registration, library, development).",
        },
      ];
      if (misc > 0) {
        lines.push({
          name: "Miscellaneous charges",
          category: "other",
          amount: misc,
          is_compulsory: false,
          frequency: "recurring",
          applies_to: "all_students",
          description:
            "Official miscellaneous band (PCF, BUSA, departmental, etc.). Listed separately from instructional on the Babcock fees page.",
        });
      }

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
        adminNote: `${BABCOCK_SESSION} instructional fees match the official undergraduate table. Misc optional so listed totals match Instructional column.`,
        evidenceUrl: BABCOCK_SOURCE,
        evidenceNote: "Official Babcock tuition and fees page.",
        evidenceDate: "2025-09-01",
      });

      console.log(
        `  - ${programme.name} (${row.level}): N${total.toLocaleString("en-NG")}`
      );
    }
  }

  const medicine = await insertCourse({
    institutionId: institution.id,
    name: "Medicine and Surgery",
    durationYears: 6,
  });
  for (const row of BABCOCK_MEDICINE) {
    const total = await insertFeeRecord({
      institutionId: institution.id,
      courseId: medicine.id,
      sessionId: session.id,
      level: row.level,
      studentType: row.level === "100L" ? "fresh" : "returning",
      lines: [
        {
          name: "Undergraduate medical package (incl. accommodation and feeding)",
          category: "tuition",
          amount: row.amount,
          is_compulsory: true,
          frequency: "recurring",
          applies_to: "all_students",
          description: "Official medical student full-year package.",
        },
      ],
      durationYears: 6,
      confidence: "high",
      sourceType: "official_school_source",
      adminNote: `${BABCOCK_SESSION} medical package includes accommodation and feeding per official note.`,
      evidenceUrl: BABCOCK_SOURCE,
      evidenceNote: "Official Babcock tuition and fees page (medical bill).",
      evidenceDate: "2025-09-01",
    });
    console.log(
      `  - Medicine and Surgery (${row.level}): N${total.toLocaleString("en-NG")}`
    );
  }

  console.log("\nDone. Babcock instructional totals re-seeded.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
