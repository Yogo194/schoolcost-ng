/**
 * Seed Codex-list schools with greenlit official sources.
 *
 *   npm run seed:codex-fees
 *
 * Seeds:
 * - Tech-U 2025/2026 programme fees (official PDF)
 * - Lead City newly-admitted programme fees (official page)
 * - Adeleke residential faculty bands (official PDF)
 * - Bells category bands (official PDFs)
 *
 * Held (no solid public schedule yet): EKSU, TASUED, Redeemer's (image PDF),
 * Caleb, Achievers, Mountain Top, Anchor, Augustine, Chrisland.
 */
import {
  ADELEKE_BANDS,
  ADELEKE_SESSION,
  ADELEKE_SLUG,
  ADELEKE_SOURCE,
} from "../lib/seed/adeleke-fees";
import {
  BELLS_BANDS,
  BELLS_PDF_100,
  BELLS_SESSION,
  BELLS_SHARED,
  BELLS_SLUG,
  BELLS_SOURCE,
  type BellsBand,
} from "../lib/seed/bells-fees";
import {
  LEAD_CITY_ACCEPTANCE,
  LEAD_CITY_DEPARTMENTAL,
  LEAD_CITY_DEVELOPMENT,
  LEAD_CITY_MATRICULATION,
  LEAD_CITY_PROGRAMMES,
  LEAD_CITY_SESSION,
  LEAD_CITY_SLUG,
  LEAD_CITY_SOURCE,
} from "../lib/seed/lead-city-fees";
import {
  getInstitution,
  insertCourse,
  insertFeeRecord,
  type SeedLine,
  upsertSession,
  wipeInstitutionFees,
} from "../lib/seed/seed-rest";
import {
  TECH_U_ADMISSION,
  TECH_U_HOSTEL,
  TECH_U_MUNICIPAL,
  TECH_U_PROGRAMMES,
  TECH_U_SESSION,
  TECH_U_SLUG,
  TECH_U_SOURCE,
} from "../lib/seed/tech-u-fees";

async function seedTechU() {
  const institution = await getInstitution(TECH_U_SLUG);
  const wiped = await wipeInstitutionFees(institution.id);
  const session = await upsertSession(
    institution.id,
    TECH_U_SESSION,
    2025,
    2026,
    true
  );
  console.log(
    `\n${institution.name}: removed ${wiped.feesRemoved} fees / ${wiped.coursesRemoved} courses`
  );

  for (const programme of TECH_U_PROGRAMMES) {
    const course = await insertCourse({
      institutionId: institution.id,
      name: programme.name,
      durationYears: programme.duration_years,
    });

    for (const row of [
      { level: "100L", studentType: "fresh" as const, includeAdmission: true },
      { level: "200L+", studentType: "returning" as const, includeAdmission: false },
    ]) {
      const lines: SeedLine[] = [];
      if (row.includeAdmission) {
        lines.push({
          name: "Admission charges",
          category: "acceptance_fee",
          amount: TECH_U_ADMISSION,
          is_compulsory: true,
          frequency: "one_time",
          applies_to: "fresh_only",
          description: "Official Tech-U PDF column for freshers only.",
        });
      }
      lines.push(
        {
          name: "Tuition / academic charges",
          category: "tuition",
          amount: programme.tuition,
          is_compulsory: true,
          frequency: "recurring",
          applies_to: "all_students",
          description: "Official Tech-U PDF tuition/academic column for this programme.",
        },
        {
          // Kept as "other" so the listed compulsory total matches the PDF package
          // (accommodation category is excluded from compulsory/first-year helpers).
          name: "Hostel",
          category: "other",
          amount: TECH_U_HOSTEL,
          is_compulsory: true,
          frequency: "recurring",
          applies_to: "all_students",
          description: "Official Tech-U PDF hostel column included in published package totals.",
        },
        {
          name: "Municipal services",
          category: "other",
          amount: TECH_U_MUNICIPAL,
          is_compulsory: true,
          frequency: "recurring",
          applies_to: "all_students",
          description: "Official Tech-U PDF municipal services column.",
        }
      );

      const total = await insertFeeRecord({
        institutionId: institution.id,
        courseId: course.id,
        sessionId: session.id,
        level: row.level,
        studentType: row.studentType,
        lines,
        durationYears: programme.duration_years,
        confidence: "high",
        sourceType: "official_fee_circular",
        adminNote: `${TECH_U_SESSION} official Tech-U PDF line items (admission, tuition, hostel, municipal). Published TOTAL columns on the PDF are about ₦500–₦1,000 above the sum of named columns; we store the named columns as printed.`,
        evidenceUrl: TECH_U_SOURCE,
        evidenceNote: "Official Tech-U fees payable PDF for 2025/2026.",
        evidenceDate: "2025-12-01",
      });

      console.log(
        `  - ${programme.name} (${row.level}): N${total.toLocaleString("en-NG")}`
      );
    }
  }
}

async function seedLeadCity() {
  const institution = await getInstitution(LEAD_CITY_SLUG);
  const wiped = await wipeInstitutionFees(institution.id);
  const session = await upsertSession(
    institution.id,
    LEAD_CITY_SESSION,
    2025,
    2026,
    true
  );
  console.log(
    `\n${institution.name}: removed ${wiped.feesRemoved} fees / ${wiped.coursesRemoved} courses`
  );

  for (const programme of LEAD_CITY_PROGRAMMES) {
    const course = await insertCourse({
      institutionId: institution.id,
      name: programme.name,
      durationYears: programme.duration_years,
    });

    const lines: SeedLine[] = [
      {
        name: "Programme fee (newly admitted)",
        category: "tuition",
        amount: programme.fee,
        is_compulsory: true,
        frequency: "recurring",
        applies_to: "all_students",
        description: "Official newly-admitted programme fee from LCU all-courses page.",
      },
      {
        name: "Acceptance fee",
        category: "acceptance_fee",
        amount: LEAD_CITY_ACCEPTANCE,
        is_compulsory: true,
        frequency: "one_time",
        applies_to: "fresh_only",
        description: "Listed on the same official LCU fees page.",
      },
      {
        name: "Departmental fee",
        category: "other",
        amount: LEAD_CITY_DEPARTMENTAL,
        is_compulsory: true,
        frequency: "one_time",
        applies_to: "fresh_only",
        description: "Listed on the same official LCU fees page.",
      },
      {
        name: "Development levy",
        category: "development_levy",
        amount: LEAD_CITY_DEVELOPMENT,
        is_compulsory: true,
        frequency: "one_time",
        applies_to: "fresh_only",
        description: "Listed on the same official LCU fees page.",
      },
      {
        name: "Matriculation fee",
        category: "other",
        amount: LEAD_CITY_MATRICULATION,
        is_compulsory: true,
        frequency: "one_time",
        applies_to: "fresh_only",
        description: "Listed on the same official LCU fees page.",
      },
    ];

    const total = await insertFeeRecord({
      institutionId: institution.id,
      courseId: course.id,
      sessionId: session.id,
      level: "100L",
      studentType: "fresh",
      lines,
      durationYears: programme.duration_years,
      confidence: "high",
      sourceType: "official_school_source",
      adminNote: `${LEAD_CITY_SESSION} newly-admitted fees only (page note). Returning schedule not published on this page. Hostel/feeding omitted.`,
      evidenceUrl: LEAD_CITY_SOURCE,
      evidenceNote: "Official Lead City University all-courses fees page.",
      evidenceDate: "2025-09-01",
    });

    console.log(`  - ${programme.name}: N${total.toLocaleString("en-NG")}`);
  }
}

async function seedAdeleke() {
  const institution = await getInstitution(ADELEKE_SLUG);
  const wiped = await wipeInstitutionFees(institution.id);
  const session = await upsertSession(
    institution.id,
    ADELEKE_SESSION,
    2025,
    2026,
    true
  );
  console.log(
    `\n${institution.name}: removed ${wiped.feesRemoved} fees / ${wiped.coursesRemoved} courses`
  );

  for (const band of ADELEKE_BANDS) {
    const course = await insertCourse({
      institutionId: institution.id,
      name: band.name,
      durationYears: band.duration_years,
    });

    for (const row of band.rows) {
      const lines: SeedLine[] = [
        {
          name: "Approved residential session bill",
          category: "tuition",
          amount: row.session_bill,
          is_compulsory: true,
          frequency: "recurring",
          applies_to: "all_students",
          description:
            "Official Adeleke residential SESSION BILL for this faculty band and level. The PDF also lists semester and instalment payment schedules, but does not split tuition vs hostel or other fee types.",
        },
      ];

      const total = await insertFeeRecord({
        institutionId: institution.id,
        courseId: course.id,
        sessionId: session.id,
        level: row.level,
        studentType: row.student_type,
        lines,
        durationYears: band.duration_years,
        confidence: "high",
        sourceType: "official_fee_circular",
        adminNote: `${ADELEKE_SESSION} official residential faculty-band session bill. Source does not publish fee-type component amounts. Non-residential/conversion/part-time omitted.`,
        evidenceUrl: ADELEKE_SOURCE,
        evidenceNote: "Official Adeleke University 2025/2026 approved summary bill PDF.",
        evidenceDate: "2025-08-01",
      });

      console.log(
        `  - ${band.name} (${row.level}): N${total.toLocaleString("en-NG")}`
      );
    }
  }
}

function bellsReturningLines(band: BellsBand): SeedLine[] {
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

function bellsFresherLines(band: BellsBand): SeedLine[] {
  const s = BELLS_SHARED;
  return [
    ...bellsReturningLines(band),
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

async function seedBells() {
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
        lines: bellsFresherLines(band),
        expected: band.fresher_total,
      },
      {
        level: "200L-500L",
        studentType: "returning" as const,
        lines: bellsReturningLines(band),
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
        adminNote: `${BELLS_SESSION} official PDF line-item breakdown. Expected ₦${row.expected.toLocaleString("en-NG")}.`,
        evidenceUrl: BELLS_PDF_100,
        evidenceNote: `Official Bells fee PDFs linked from ${BELLS_SOURCE}`,
        evidenceDate: "2025-09-01",
      });

      console.log(
        `  - ${band.name} (${row.level}): N${total.toLocaleString("en-NG")} [${row.lines.length} lines]`
      );
    }
  }
}

async function main() {
  await seedTechU();
  await seedLeadCity();
  await seedAdeleke();
  await seedBells();
  console.log(
    "\nDone. Held: EKSU, TASUED, Redeemer's, Caleb, Achievers, Mountain Top, Anchor, Augustine, Chrisland."
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
