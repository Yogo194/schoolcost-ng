/**
 * Seed next-batch schools with greenlit official sources.
 *
 *   npm run seed:batch2-fees
 *
 * Seeds: ABUAD, Babcock, Chrisland, Bowen.
 */
import {
  ABUAD_MEDICAL_SCREENING,
  ABUAD_PROGRAMMES,
  ABUAD_PTCF,
  ABUAD_SESSION,
  ABUAD_SLUG,
  ABUAD_SOURCE,
  ABUAD_SOUVENIR,
} from "../lib/seed/abuad-fees";
import {
  BABCOCK_MEDICINE,
  BABCOCK_MISC,
  BABCOCK_PROGRAMMES,
  BABCOCK_SESSION,
  BABCOCK_SLUG,
  BABCOCK_SOURCE,
} from "../lib/seed/babcock-fees";
import {
  BOWEN_PROGRAMMES,
  BOWEN_SESSION,
  BOWEN_SLUG,
  BOWEN_SOURCE,
} from "../lib/seed/bowen-fees";
import {
  CHRISLAND_BANDS,
  CHRISLAND_SESSION,
  CHRISLAND_SLUG,
  CHRISLAND_SOURCE,
} from "../lib/seed/chrisland-fees";
import {
  getInstitution,
  insertCourse,
  insertFeeRecord,
  type SeedLine,
  upsertSession,
  wipeInstitutionFees,
} from "../lib/seed/seed-rest";

async function seedAbuad() {
  const institution = await getInstitution(ABUAD_SLUG);
  const wiped = await wipeInstitutionFees(institution.id);
  const session = await upsertSession(
    institution.id,
    ABUAD_SESSION,
    2025,
    2026,
    true
  );
  console.log(
    `\n${institution.name}: removed ${wiped.feesRemoved} fees / ${wiped.coursesRemoved} courses`
  );

  for (const programme of ABUAD_PROGRAMMES) {
    const course = await insertCourse({
      institutionId: institution.id,
      name: programme.name,
      durationYears: programme.duration_years,
    });

    for (const row of programme.levels) {
      const isFresh = row.level === "100L";
      const lines: SeedLine[] = [
        {
          name: "Official school fees sub-total",
          category: "tuition",
          amount: row.amount,
          is_compulsory: true,
          frequency: "recurring",
          applies_to: "all_students",
          description: "Official ABUAD portal programme sub-total for this level.",
        },
      ];
      if (isFresh) {
        lines.push(
          {
            name: "PTCF levy",
            category: "other",
            amount: ABUAD_PTCF,
            is_compulsory: true,
            frequency: "recurring",
            applies_to: "all_students",
            description: "Listed on the official ABUAD school fees portal.",
          },
          {
            name: "Medical screening",
            category: "medical_fee",
            amount: ABUAD_MEDICAL_SCREENING,
            is_compulsory: true,
            frequency: "one_time",
            applies_to: "fresh_only",
            description: "Listed on the official ABUAD school fees portal.",
          },
          {
            name: "ABUAD souvenir",
            category: "other",
            amount: ABUAD_SOUVENIR,
            is_compulsory: true,
            frequency: "one_time",
            applies_to: "fresh_only",
            description: "Fresh students only, per official portal.",
          }
        );
      } else {
        lines.push({
          name: "PTCF levy",
          category: "other",
          amount: ABUAD_PTCF,
          is_compulsory: true,
          frequency: "recurring",
          applies_to: "all_students",
          description: "Listed on the official ABUAD school fees portal.",
        });
      }

      const total = await insertFeeRecord({
        institutionId: institution.id,
        courseId: course.id,
        sessionId: session.id,
        level: row.level,
        studentType: isFresh ? "fresh" : "returning",
        lines,
        durationYears: programme.duration_years,
        confidence: "high",
        sourceType: "official_school_source",
        adminNote: `${ABUAD_SESSION} official portal sub-total. Hostel room options omitted (optional).`,
        evidenceUrl: ABUAD_SOURCE,
        evidenceNote: "Official ABUAD e-portal school fees schedule.",
        evidenceDate: "2026-01-01",
      });

      console.log(
        `  - ${programme.name} (${row.level}): N${total.toLocaleString("en-NG")}`
      );
    }
  }
}

async function seedBabcock() {
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
            "Official miscellaneous band (PCF, BUSA, departmental, etc.). Listed separately from instructional on the Babcock fees page. Feeding and hostel are separate options.",
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
        adminNote: `${BABCOCK_SESSION} instructional fees match the official undergraduate table. Misc kept optional so listed totals match the Instructional column; feeding/hostel omitted.`,
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
}

function chrislandLines(row: (typeof CHRISLAND_BANDS)[number]["levels"][number]): SeedLine[] {
  const lines: SeedLine[] = [
    {
      name: "Tuition",
      category: "tuition",
      amount: row.tuition,
      is_compulsory: true,
      frequency: "recurring",
      applies_to: "all_students",
      description: "Official Chrisland schedule tuition line for this band and level.",
    },
    {
      // Kept as "other" so the listed compulsory total matches the published package
      // (accommodation category is excluded from compulsory/first-year helpers).
      name: "Accommodation",
      category: "other",
      amount: row.accommodation,
      is_compulsory: true,
      frequency: "recurring",
      applies_to: "all_students",
      description: "Official Chrisland accommodation line on the schedule of fees.",
    },
    {
      name: "Classera",
      category: "other",
      amount: row.classera,
      is_compulsory: true,
      frequency: "recurring",
      applies_to: "all_students",
      description: "Official Chrisland Classera line.",
    },
    {
      name: "SRC",
      category: "other",
      amount: row.src,
      is_compulsory: true,
      frequency: "recurring",
      applies_to: "all_students",
      description: "Official Chrisland SRC line.",
    },
    {
      name: "New Horizons",
      category: "other",
      amount: row.new_horizon,
      is_compulsory: true,
      frequency: "recurring",
      applies_to: "all_students",
      description: "Official Chrisland New Horizons line.",
    },
  ];
  if (row.clinical > 0) {
    lines.push({
      name: "Clinical fee",
      category: "other",
      amount: row.clinical,
      is_compulsory: true,
      frequency: "recurring",
      applies_to: "all_students",
      description: "Official Chrisland clinical line for this level.",
    });
  }
  return lines;
}

async function seedChrisland() {
  const institution = await getInstitution(CHRISLAND_SLUG);
  const wiped = await wipeInstitutionFees(institution.id);
  const session = await upsertSession(
    institution.id,
    CHRISLAND_SESSION,
    2025,
    2026,
    true
  );
  console.log(
    `\n${institution.name}: removed ${wiped.feesRemoved} fees / ${wiped.coursesRemoved} courses`
  );

  for (const band of CHRISLAND_BANDS) {
    const course = await insertCourse({
      institutionId: institution.id,
      name: band.name,
      durationYears: band.duration_years,
    });

    for (const row of band.levels) {
      const total = await insertFeeRecord({
        institutionId: institution.id,
        courseId: course.id,
        sessionId: session.id,
        level: row.level,
        studentType: row.student_type,
        lines: chrislandLines(row),
        durationYears: band.duration_years,
        confidence: "high",
        sourceType: "official_school_source",
        adminNote: `${CHRISLAND_SESSION} official schedule-of-fees band with line-item breakdown. Not every course row.`,
        evidenceUrl: CHRISLAND_SOURCE,
        evidenceNote: "Official Chrisland University schedule of fees page.",
        evidenceDate: "2025-09-01",
      });
      console.log(
        `  - ${band.name} (${row.level}): N${total.toLocaleString("en-NG")}`
      );
    }
  }
}

function bowenLines(row: (typeof BOWEN_PROGRAMMES)[number]["levels"][number]): SeedLine[] {
  const lines: SeedLine[] = [
    {
      name: "Academic fees",
      category: "tuition",
      amount: row.academic,
      is_compulsory: true,
      frequency: "recurring",
      applies_to: "all_students",
      description: "Official Bowen Academic Fees (newfee) column for this programme and level.",
    },
    {
      // Kept as "other" so the listed compulsory total matches the published package
      // (accommodation category is excluded from compulsory/first-year helpers).
      name: "Accommodation",
      category: "other",
      amount: row.accommodation,
      is_compulsory: true,
      frequency: "recurring",
      applies_to: "all_students",
      description: "Official Bowen Accommodation column.",
    },
    {
      name: "Other fees",
      category: "other",
      amount: row.other_fees,
      is_compulsory: true,
      frequency: "recurring",
      applies_to: "all_students",
      description: "Official Bowen Other Fees column.",
    },
  ];
  if (row.bench_fee > 0) {
    lines.push({
      name: "Bench fee",
      category: "other",
      amount: row.bench_fee,
      is_compulsory: true,
      frequency: "recurring",
      applies_to: "all_students",
      description: "Official Bowen Bench Fee column for this level.",
    });
  }
  if (row.new_horizon && row.new_horizon > 0) {
    lines.push({
      name: "New Horizon",
      category: "other",
      amount: row.new_horizon,
      is_compulsory: true,
      frequency: "recurring",
      applies_to: "all_students",
      description: "Official Bowen New Horizon column for this level.",
    });
  }
  return lines;
}

async function seedBowen() {
  const institution = await getInstitution(BOWEN_SLUG);
  const wiped = await wipeInstitutionFees(institution.id);
  const session = await upsertSession(
    institution.id,
    BOWEN_SESSION,
    2026,
    2027,
    true
  );
  console.log(
    `\n${institution.name}: removed ${wiped.feesRemoved} fees / ${wiped.coursesRemoved} courses`
  );

  for (const programme of BOWEN_PROGRAMMES) {
    const course = await insertCourse({
      institutionId: institution.id,
      name: programme.name,
      durationYears: programme.duration_years,
    });

    for (const row of programme.levels) {
      const total = await insertFeeRecord({
        institutionId: institution.id,
        courseId: course.id,
        sessionId: session.id,
        level: row.level,
        studentType: row.level === "100L" ? "fresh" : "returning",
        lines: bowenLines(row),
        durationYears: programme.duration_years,
        confidence: "high",
        sourceType: "official_school_source",
        adminNote: `${BOWEN_SESSION} official Bowen fee page line items (academic, accommodation, other, bench, New Horizon where listed).`,
        evidenceUrl: BOWEN_SOURCE,
        evidenceNote: "Official Bowen University level fee pages.",
        evidenceDate: "2026-01-01",
      });
      console.log(
        `  - ${programme.name} (${row.level}): N${total.toLocaleString("en-NG")}`
      );
    }
  }
}

async function main() {
  await seedAbuad();
  await seedBabcock();
  await seedChrisland();
  await seedBowen();
  console.log("\nDone. Batch 2 seeded: ABUAD, Babcock, Chrisland, Bowen.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
