"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronDown, ExternalLink, FileText } from "lucide-react";
import {
  defaultLevelForStudentType,
  dueLabel,
  lineAmountForPlan,
  linesForLevel,
  semesterTotals,
  studentTypeForLevel,
  type FeeDetailRecord,
  type StudentType,
} from "@/lib/mock/fee-detail";
import { formatCurrency } from "@/lib/utils/format";
import { FeeCourseCompareMatrix } from "@/components/public/FeeCourseCompareMatrix";
import {
  DetailViewTabs,
  VerificationActions,
  type FeeDetailView,
} from "@/components/public/FeeDetailSidebarActions";
import { ConfidenceDisplay } from "@/components/public/ConfidenceDisplay";
import { SourceBadge } from "@/components/public/SourceBadge";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface FeeDetailBreakdownProps {
  record: FeeDetailRecord;
}

export function FeeDetailBreakdown({ record }: FeeDetailBreakdownProps) {
  const [studentType, setStudentType] = useState<StudentType>(() =>
    studentTypeForLevel(record.defaultLevel || "100L")
  );
  const [paymentPlan, setPaymentPlan] = useState(
    record.paymentPlans[0]?.value ?? "full"
  );
  const [activeView, setActiveView] = useState<FeeDetailView>("breakdown");

  const level = defaultLevelForStudentType(record, studentType);
  const lines = useMemo(() => linesForLevel(record, level), [record, level]);
  const totals = record.totalsByLevel[level] ?? record.totalsByLevel["100L"];
  const compulsoryLines = lines.filter((line) => line.category === "compulsory");
  const optionalLines = lines.filter((line) => line.category === "optional");
  const semTotals = useMemo(
    () => semesterTotals(compulsoryLines),
    [compulsoryLines]
  );

  const isFresh = studentType === "fresh";
  const heroLabel = isFresh ? "First-year total" : "Returning-year total";
  const heroAmount = isFresh
    ? record.firstYearTotal
    : record.returningYearTotal;

  const verificationRows: Array<{
    label: string;
    note?: string;
    value: ReactNode;
  }> = [
    {
      label: "Verification status",
      value: formatStatus(record.verification_status),
    },
    {
      label: "Data confidence",
      note: "How sure we are about these figures",
      value: (
        <ConfidenceDisplay
          level={record.confidence_level}
          compact
          align="center"
        />
      ),
    },
    {
      label: "Student type",
      value: isFresh ? "Fresh" : "Returning",
    },
    { label: "Academic session", value: record.session },
    { label: "Programme duration", value: record.programmeDuration },
    { label: "Last reviewed", value: record.lastReviewedLabel },
    {
      label: "Source type",
      value: <SourceBadge sourceType={record.source_type} compact />,
    },
    {
      label: "Students confirmed",
      value: String(record.confirmationsCount ?? 0),
    },
  ];

  return (
    <section className="bg-brand-lime-light px-4 pb-16 pt-10 sm:px-10 sm:pb-20 sm:pt-12 lg:px-20">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-8 flex justify-center">
          <DetailViewTabs activeView={activeView} onChange={setActiveView} />
        </div>

        {activeView === "breakdown" ? (
          <>
            <div id="overview" className="scroll-mt-28">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-brand-ink/50">
                  {heroLabel}
                </p>
                <h2 className="mt-2 text-[2rem] font-semibold leading-[1.2] tracking-[-0.04em] text-brand-ink sm:text-[40px]">
                  {formatCurrency(
                    paymentPlan === "semester"
                      ? Math.max(semTotals.first, semTotals.second)
                      : heroAmount
                  )}
                </h2>
                <p className="mt-2 max-w-2xl text-base tracking-[-0.02em] text-brand-ink/80 sm:text-lg">
                  {isFresh ? (
                    <>
                      Estimated first-year compulsory fees for {record.course}{" "}
                      at {record.schoolName}, including one-time fresh charges.
                      Session {record.session}. Hostel and feeding are not
                      included.
                    </>
                  ) : (
                    <>
                      Estimated returning-year compulsory fees for{" "}
                      {record.course} at {record.schoolName}. Session{" "}
                      {record.session}. Hostel and feeding are not included.
                    </>
                  )}
                </p>
                {paymentPlan === "semester" && (
                  <p className="mt-2 text-sm tracking-[-0.02em] text-brand-ink/60">
                    Per-semester view: 1st sem{" "}
                    {formatCurrency(semTotals.first)} · 2nd sem{" "}
                    {formatCurrency(semTotals.second)}. Amount above shows the
                    higher semester load.
                  </p>
                )}
              </div>

              <div className="mt-6 grid w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-2">
                <FilterSelect
                  label="I am a"
                  value={studentType}
                  onChange={(value) => setStudentType(value as StudentType)}
                  options={[
                    { value: "fresh", label: "Fresh student" },
                    { value: "returning", label: "Returning student" },
                  ]}
                />
                <FilterSelect
                  label="Payment plan"
                  value={paymentPlan}
                  onChange={setPaymentPlan}
                  options={record.paymentPlans}
                />
              </div>
            </div>

            <div
              id="breakdown"
              className="mt-8 overflow-x-auto rounded-2xl border border-[#e5ebe5] bg-white"
            >
              <table className="w-full min-w-[840px] border-collapse text-left">
                <thead>
                  <tr>
                    {(
                      ["Fee item", "Category", "Due", "Amount"] as const
                    ).map((heading, i) => (
                      <th
                        key={heading}
                        className={cn(
                          "h-14 bg-[#f2ac5b] px-4 text-[18px] font-medium tracking-[-0.25px] text-[#002c15]",
                          i === 0 ? "text-left" : "text-center"
                        )}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compulsoryLines.map((line) => (
                    <tr
                      key={line.id}
                      className="h-[72px] border-t border-[#e5ebe5]"
                    >
                      <td className="px-4 py-4 align-middle">
                        <p className="text-lg font-medium leading-[1.2] tracking-[-0.04em] text-[#355955]">
                          {line.name}
                        </p>
                        <p className="mt-0.5 text-base leading-[1.4] tracking-[-0.02em] text-brand-ink/80">
                          {line.note}
                          {paymentPlan === "semester" && line.due === "both"
                            ? " · shown per semester"
                            : ""}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-center text-base tracking-[-0.02em] text-brand-ink/80">
                        Compulsory
                      </td>
                      <td className="px-4 py-4 text-center text-base tracking-[-0.02em] text-brand-ink/80">
                        {dueLabel(line.due)}
                      </td>
                      <td className="px-4 py-4 text-center text-base font-semibold tracking-[-0.25px] text-[#355955]">
                        {formatCurrency(
                          lineAmountForPlan(
                            line.amount,
                            line.due,
                            paymentPlan
                          )
                        )}
                      </td>
                    </tr>
                  ))}

                  <tr className="h-[72px] border-t border-[#e5ebe5] bg-[rgba(242,172,91,0.09)]">
                    <td className="px-4 py-4 align-middle">
                      <p className="text-lg font-medium leading-[1.2] tracking-[-0.04em] text-[#355955]">
                        {paymentPlan === "semester"
                          ? "Semester totals"
                          : heroLabel}
                      </p>
                      <p className="mt-0.5 text-base font-semibold tracking-[-0.02em] text-brand-ink/80">
                        {paymentPlan === "semester"
                          ? `1st ${formatCurrency(semTotals.first)} · 2nd ${formatCurrency(semTotals.second)}`
                          : isFresh
                            ? "Fresh student"
                            : "Returning student"}
                      </p>
                    </td>
                    <td />
                    <td />
                    <td className="px-4 py-4 text-center text-base font-semibold tracking-[-0.25px] text-[#355955]">
                      {formatCurrency(
                        paymentPlan === "semester"
                          ? semTotals.first + semTotals.second
                          : heroAmount
                      )}
                    </td>
                  </tr>

                  {optionalLines.length > 0 && (
                    <tr className="h-[52px] border-t border-[#e5ebe5] bg-[#fef8f0]">
                      <td colSpan={4} className="px-4 py-3">
                        <p className="text-sm uppercase tracking-[0.07em] text-brand-ink/80">
                          Feeding and accommodation charges
                        </p>
                      </td>
                    </tr>
                  )}

                  {optionalLines.map((line) => (
                    <tr
                      key={line.id}
                      className="h-[72px] border-t border-[#e5ebe5]"
                    >
                      <td className="px-4 py-4 align-middle">
                        <p className="text-lg font-medium leading-[1.2] tracking-[-0.04em] text-[#355955]">
                          {line.name}
                        </p>
                        <p className="mt-0.5 text-base leading-[1.4] tracking-[-0.02em] text-brand-ink/80">
                          {line.note}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-center text-base tracking-[-0.02em] text-brand-ink/80">
                        Accommodation
                      </td>
                      <td className="px-4 py-4 text-center text-base tracking-[-0.02em] text-brand-ink/80">
                        {dueLabel(line.due)}
                      </td>
                      <td className="px-4 py-4 text-center text-base font-semibold tracking-[-0.25px] text-[#355955]">
                        {formatCurrency(line.amount)}
                      </td>
                    </tr>
                  ))}

                  <tr className="h-[72px] border-t border-[#e5ebe5] bg-[#fef8f0]">
                    <td className="px-4 py-4 align-middle">
                      <p className="text-xl font-semibold leading-[1.2] tracking-[-0.04em] text-[#355955]">
                        Total with accommodation
                      </p>
                    </td>
                    <td />
                    <td />
                    <td className="px-4 py-4 text-center text-xl font-semibold tracking-[-0.25px] text-[#355955]">
                      {formatCurrency(
                        (paymentPlan === "semester"
                          ? semTotals.first + semTotals.second
                          : heroAmount) + (totals?.accommodation ?? 0)
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : activeView === "verification" ? (
          <>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-brand-ink/50">
                Trust and source check
              </p>
              <h2 className="mt-2 text-[2rem] font-semibold leading-[1.2] tracking-[-0.04em] text-brand-ink sm:text-[40px]">
                Verification stats
              </h2>
              <p className="mt-2 max-w-2xl text-base tracking-[-0.02em] text-brand-ink/80 sm:text-lg">
                How we verified {record.course} fees at {record.schoolName} for
                this {isFresh ? "fresh" : "returning"} student record,{" "}
                {record.session}.{" "}
                <Link
                  href="/how-it-works"
                  className="font-medium text-primary hover:underline"
                >
                  How verification works
                </Link>
              </p>
            </div>

            <div className="mt-8 overflow-x-auto rounded-2xl border border-[#e5ebe5] bg-white">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr>
                    {(["Detail", "Value"] as const).map((heading, i) => (
                      <th
                        key={heading}
                        className={cn(
                          "h-14 bg-[#f2ac5b] px-4 text-[18px] font-medium tracking-[-0.25px] text-[#002c15]",
                          i === 0 ? "text-left" : "text-center"
                        )}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {verificationRows.map((row) => (
                    <tr key={row.label} className="border-t border-[#e5ebe5]">
                      <td className="px-4 py-4 align-middle">
                        <p className="text-lg font-medium leading-[1.2] tracking-[-0.04em] text-[#355955]">
                          {row.label}
                        </p>
                        {row.note && (
                          <p className="mt-0.5 text-base leading-[1.4] tracking-[-0.02em] text-brand-ink/80">
                            {row.note}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center align-middle text-base font-semibold tracking-[-0.25px] text-[#355955]">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {(record.evidence || record.reviewerNote) && (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {record.evidence && (
                  <a
                    href={record.evidence.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-2xl border border-[#e5ebe5] bg-white p-4 transition-colors hover:border-primary/30"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-lime-light text-brand-ink">
                      <FileText className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium tracking-[-0.02em] text-brand-ink">
                        Supporting evidence
                      </span>
                      <span className="mt-0.5 block truncate text-sm text-brand-ink/65">
                        {record.evidence.title} · {record.evidence.typeLabel}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary">
                      View
                      <ExternalLink className="size-3.5" aria-hidden />
                    </span>
                  </a>
                )}
                {record.reviewerNote && (
                  <div className="rounded-2xl border border-[#e5ebe5] bg-white p-4">
                    <p className="text-sm font-medium tracking-[-0.02em] text-brand-ink">
                      Reviewer note
                    </p>
                    <p className="mt-1 text-sm leading-[1.5] tracking-[-0.02em] text-brand-ink/70">
                      {record.reviewerNote}
                    </p>
                  </div>
                )}
              </div>
            )}

            <VerificationActions record={record} level={level} />
          </>
        ) : (
          <>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-brand-ink/50">
                Same course, other schools
              </p>
              <h2 className="mt-2 text-[2rem] font-semibold leading-[1.2] tracking-[-0.04em] text-brand-ink sm:text-[40px]">
                Compare {record.course}
              </h2>
              <p className="mt-2 max-w-2xl text-base tracking-[-0.02em] text-brand-ink/80 sm:text-lg">
                Side-by-side first-year, returning-year, and degree estimates for{" "}
                {record.course}, with {record.schoolName} as your starting
                school.
              </p>
            </div>

            <div className="mt-8">
              <FeeCourseCompareMatrix record={record} level={level} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function formatStatus(status: FeeDetailRecord["verification_status"]): string {
  if (status === "officially_verified") return "Officially verified";
  if (status === "community_verified") return "Community verified";
  if (status === "reported") return "Reported";
  if (status === "outdated") return "Possibly outdated";
  return "Disputed";
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1.5 text-left">
      <span className="text-sm uppercase tracking-[0.07em] text-brand-ink/80">
        {label}
      </span>
      <span className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full appearance-none rounded-[10px] border border-[#355955] bg-white px-3 pr-10 text-base font-medium tracking-[-0.02em] text-brand-ink/80 outline-none shadow-[0_1px_0.75px_rgba(44,54,53,0.03)] transition-[box-shadow] focus:shadow-[0_0_0_3px_rgba(3,48,42,0.08)]"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-brand-ink/50"
          aria-hidden
        />
      </span>
    </label>
  );
}
