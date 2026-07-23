/**
 * Re-seed Bells with PDF line-item breakdown (not one muddled total).
 *
 *   npx tsx scripts/seed-bells-fees.ts
 */
import {
  BELLS_BANDS,
  BELLS_PDF_100,
  BELLS_SESSION,
  BELLS_SHARED,
  BELLS_SLUG,
  type BellsBand,
} from "../lib/seed/bells-fees";
import {
  getInstitution,
  insertCourse,
  insertFeeRecord,
  type SeedLine,
  upsertSession,
  wipeInstitutionFees,
} from "../lib/seed/seed-rest";

function returningLines(band: BellsBand): SeedLine[] {
  const s = BELLS_SHARED;
  const lines: SeedLine[] = [];
  if (band.tuition > 0) {
    lines.push({
      name: "Tuition",
      category: "tuition",
      amount: band.tuition,
      is_compulsory: true,
      frequency: "recurring",
      applies_to: "all_students",
      description: "Official Bells tuition line for this band.",
    });
  }
  lines.push(
    {
      name: "Library development",
      category: "other",
      amount: s.library_development,
      is_compulsory: true,
      frequency: "recurring",
      applies_to: "all_students",
      description: "Official schedule line.",
    },
    {
      name: "Examination fee",
      category: "other",
      amount: s.examination_fee,
      is_compulsory: true,
      frequency: "recurring",
      applies_to: "all_students",
      description: "Official schedule line.",
    },
    {
      name: "ICT fees",
      category: "other",
      amount: band.ict_fees,
      is_compulsory: true,
      frequency: "recurring",
      applies_to: "all_students",
      description: "Official schedule line for this band.",
    },
    {
      name: "Infrastructural development fee",
      category: "development_levy",
      amount: s.infrastructural_dev_fee,
      is_compulsory: true,
      frequency: "recurring",
      applies_to: "all_students",
      description: "Official schedule line.",
    },
    {
      name: "Laboratory, studio and workshop",
      category: "other",
      amount: band.laboratory_studio_workshop,
      is_compulsory: true,
      frequency: "recurring",
      applies_to: "all_students",
      description: "Official schedule line for this band.",
    },
    {
      // Kept as "other" so the listed compulsory total matches the PDF package
      // (accommodation category is excluded from compulsory/first-year helpers).
      name: "Accommodation",
      category: "other",
      amount: s.accommodation,
      is_compulsory: true,
      frequency: "recurring",
      applies_to: "all_students",
      description: "Official accommodation line on the Bells schedule.",
    },
    {
      name: "E-Library + Kortext",
      category: "other",
      amount: s.e_library_kortext,
      is_compulsory: true,
      frequency: "recurring",
      applies_to: "all_students",
      description: "Official schedule line.",
    },
    {
      name: "BUSA fees",
      category: "other",
      amount: s.busa_fees,
      is_compulsory: true,
      frequency: "recurring",
      applies_to: "all_students",
      description: "Official schedule line.",
    },
    {
      name: "New Horizon",
      category: "other",
      amount: s.new_horizon,
      is_compulsory: true,
      frequency: "recurring",
      applies_to: "all_students",
      description: "Official schedule line.",
    },
    {
      name: "Maintenance",
      category: "other",
      amount: s.maintenance,
      is_compulsory: true,
      frequency: "recurring",
      applies_to: "all_students",
      description: "Official schedule line.",
    },
    {
      name: "Sport",
      category: "other",
      amount: s.sport,
      is_compulsory: true,
      frequency: "recurring",
      applies_to: "all_students",
      description: "Official schedule line.",
    },
    {
      name: "BUPF",
      category: "other",
      amount: s.bupf,
      is_compulsory: true,
      frequency: "recurring",
      applies_to: "all_students",
      description: "Official schedule line.",
    },
    {
      name: "HMO",
      category: "medical_fee",
      amount: s.hmo,
      is_compulsory: true,
      frequency: "recurring",
      applies_to: "all_students",
      description: "Official schedule line.",
    }
  );
  return lines;
}

function fresherLines(band: BellsBand): SeedLine[] {
  const s = BELLS_SHARED;
  return [
    ...returningLines(band),
    {
      name: "Acceptance fee",
      category: "acceptance_fee",
      amount: s.acceptance_fee,
      is_compulsory: true,
      frequency: "one_time",
      applies_to: "fresh_only",
      description: "Official 100L acceptance fee.",
    },
    {
      name: "Tablet",
      category: "other",
      amount: s.tablet,
      is_compulsory: true,
      frequency: "one_time",
      applies_to: "fresh_only",
      description: "Official 100L tablet charge.",
    },
    {
      name: "Medical screening",
      category: "medical_fee",
      amount: s.medical_screening,
      is_compulsory: true,
      frequency: "one_time",
      applies_to: "fresh_only",
      description: "Official 100L medical screening fee.",
    },
  ];
}

async function main() {
  const institution = await getInstitution(BELLS_SLUG);
  const wiped = await wipeInstitutionFees(institution.id);
  const session = await upsertSession(
    institution.id,
    BELLS_SESSION,
    2025,
    2026,
    true
  );
  console.log(
    `\n${institution.name}: removed ${wiped.feesRemoved} fees / ${wiped.coursesRemoved} courses`
  );

  for (const band of BELLS_BANDS) {
    const course = await insertCourse({
      institutionId: institution.id,
      name: band.name,
      durationYears: band.duration_years,
    });

    for (const row of [
      {
        level: "100L",
        studentType: "fresh" as const,
        lines: fresherLines(band),
        expected: band.fresher_total,
      },
      {
        level: "200L-500L",
        studentType: "returning" as const,
        lines: returningLines(band),
        expected: band.returning_total,
      },
    ]) {
      const total = await insertFeeRecord({
        institutionId: institution.id,
        courseId: course.id,
        sessionId: session.id,
        level: row.level,
        studentType: row.studentType,
        lines: row.lines,
        durationYears: band.duration_years,
        confidence: "high",
        sourceType: "official_fee_circular",
        adminNote: `${BELLS_SESSION} official PDF line-item breakdown. Expected package total ₦${row.expected.toLocaleString("en-NG")}.`,
        evidenceUrl: BELLS_PDF_100,
        evidenceNote: "Official Bells 2025/2026 school fees schedule PDFs.",
        evidenceDate: "2025-09-01",
      });

      if (Math.abs(total - row.expected) > 0.5) {
        throw new Error(
          `${band.name} ${row.level}: got ${total}, expected ${row.expected}`
        );
      }

      console.log(
        `  - ${band.name} (${row.level}): N${total.toLocaleString("en-NG")} [${row.lines.length} lines]`
      );
    }
  }

  console.log("\nDone. Bells re-seeded with PDF line-item breakdown.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
