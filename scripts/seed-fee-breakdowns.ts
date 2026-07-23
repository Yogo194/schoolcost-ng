/**
 * Re-seed schools with official fee-component breakdowns (selling point).
 *
 *   npx tsx scripts/seed-fee-breakdowns.ts
 *
 * Seeds:
 * - Tech-U (admission, tuition, hostel, municipal)
 * - Chrisland (tuition, accommodation, Classera, SRC, New Horizons, clinical)
 * - Bowen (academic, accommodation, other, bench, New Horizon)
 * - Covenant (single national package with clearer coverage note)
 * - Adeleke (session bill; source has no fee-type split)
 */
import {
  ADELEKE_BANDS,
  ADELEKE_SESSION,
  ADELEKE_SLUG,
  ADELEKE_SOURCE,
} from "../lib/seed/adeleke-fees";
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
  COVENANT_PROGRAMMES,
  COVENANT_SESSION,
  COVENANT_SLUG,
  COVENANT_SOURCE,
} from "../lib/seed/covenant-fees";
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
      {
        level: "200L+",
        studentType: "returning" as const,
        includeAdmission: false,
      },
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
          description:
            "Official Tech-U PDF tuition/academic column for this programme.",
        },
        {
          name: "Hostel",
          category: "other",
          amount: TECH_U_HOSTEL,
          is_compulsory: true,
          frequency: "recurring",
          applies_to: "all_students",
          description:
            "Official Tech-U PDF hostel column included in published package totals.",
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

function chrislandLines(
  row: (typeof CHRISLAND_BANDS)[number]["levels"][number]
): SeedLine[] {
  const lines: SeedLine[] = [
    {
      name: "Tuition",
      category: "tuition",
      amount: row.tuition,
      is_compulsory: true,
      frequency: "recurring",
      applies_to: "all_students",
      description:
        "Official Chrisland schedule tuition line for this band and level.",
    },
    {
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

function bowenLines(
  row: (typeof BOWEN_PROGRAMMES)[number]["levels"][number]
): SeedLine[] {
  const lines: SeedLine[] = [
    {
      name: "Academic fees",
      category: "tuition",
      amount: row.academic,
      is_compulsory: true,
      frequency: "recurring",
      applies_to: "all_students",
      description:
        "Official Bowen Academic Fees (newfee) column for this programme and level.",
    },
    {
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

async function seedCovenant() {
  const institution = await getInstitution(COVENANT_SLUG);
  const wiped = await wipeInstitutionFees(institution.id);
  const session = await upsertSession(
    institution.id,
    COVENANT_SESSION,
    2025,
    2026,
    true
  );
  console.log(
    `\n${institution.name}: removed ${wiped.feesRemoved} fees / ${wiped.coursesRemoved} courses`
  );

  for (const programme of COVENANT_PROGRAMMES) {
    const course = await insertCourse({
      institutionId: institution.id,
      name: programme.name,
      durationYears: programme.duration_years,
    });

    const total = await insertFeeRecord({
      institutionId: institution.id,
      courseId: course.id,
      sessionId: session.id,
      level: "Undergraduate",
      studentType: "fresh",
      lines: [
        {
          name: "Approved national school fees package",
          category: "tuition",
          amount: programme.national_fee,
          is_compulsory: true,
          frequency: "recurring",
          applies_to: "all_students",
          description:
            "Official PDF annual NATIONAL package. Note lists coverage (no separate amounts): tuition, examination, accommodation, sport, medicals registration, medical registration access, ICT facility access, identity card, EDS practical.",
        },
      ],
      durationYears: programme.duration_years,
      confidence: "high",
      sourceType: "official_fee_circular",
      adminNote: `${COVENANT_SESSION} national fee from Covenant admissions PDF (${programme.college}). Source does not publish component Naira amounts or level/returning splits. International columns omitted.`,
      evidenceUrl: COVENANT_SOURCE,
      evidenceNote: "Official Covenant University approved school fees PDF.",
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
      const total = await insertFeeRecord({
        institutionId: institution.id,
        courseId: course.id,
        sessionId: session.id,
        level: row.level,
        studentType: row.student_type,
        lines: [
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
        ],
        durationYears: band.duration_years,
        confidence: "high",
        sourceType: "official_fee_circular",
        adminNote: `${ADELEKE_SESSION} official residential faculty-band session bill. Source does not publish fee-type component amounts. Non-residential/conversion/part-time omitted.`,
        evidenceUrl: ADELEKE_SOURCE,
        evidenceNote:
          "Official Adeleke University 2025/2026 approved summary bill PDF.",
        evidenceDate: "2025-08-01",
      });

      console.log(
        `  - ${band.name} (${row.level}): N${total.toLocaleString("en-NG")}`
      );
    }
  }
}

async function main() {
  await seedTechU();
  await seedChrisland();
  await seedBowen();
  await seedCovenant();
  await seedAdeleke();
  console.log(
    "\nDone. Breakdown reseed: Tech-U, Chrisland, Bowen, Covenant, Adeleke."
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
