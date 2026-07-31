"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronDown, ExternalLink, FileText, Info } from "lucide-react";
import {
  dueLabel,
  lineAmountForPlan,
  linesForLevel,
  semesterTotals,
  studentTypeForLevel,
  type FeeBreakdownLine,
  type FeeDetailRecord,
} from "@/lib/mock/fee-detail";
import { formatCurrency } from "@/lib/utils/format";
import { FeeCourseCompareMatrix } from "@/components/public/FeeCourseCompareMatrix";
import type { CourseCompareColumn } from "@/lib/mock/course-compare";
import { InfoPrompt } from "@/components/public/InfoPrompt";
import {
  DetailViewTabs,
  VerificationActions,
  type FeeDetailView,
} from "@/components/public/FeeDetailSidebarActions";
import { ConfidenceDisplay } from "@/components/public/ConfidenceDisplay";
import { SourceBadge } from "@/components/public/SourceBadge";
import { SourceTypeInfo } from "@/components/public/SourceTypeInfo";
import { cn } from "@/lib/utils";
import { isCommunityReport } from "@/lib/fees/trust";
import type { ReactNode } from "react";

interface FeeDetailBreakdownProps {
  record: FeeDetailRecord;
  /** Real peers for the same course. Empty renders the current school alone. */
  peerColumns?: CourseCompareColumn[];
}

interface VerificationRow {
  label: string;
  note?: string;
  value: ReactNode;
  /** Optional affordance rendered beside the label, e.g. an info tooltip. */
  info?: ReactNode;
}

export function FeeDetailBreakdown({
  record,
  peerColumns,
}: FeeDetailBreakdownProps) {
  const [level, setLevel] = useState(record.defaultLevel || "100L");
  const [paymentPlan, setPaymentPlan] = useState(
    record.paymentPlans[0]?.value ?? "full"
  );
  const [activeView, setActiveView] = useState<FeeDetailView>("breakdown");

  const studentType = studentTypeForLevel(level);
  const lines = useMemo(() => linesForLevel(record, level), [record, level]);
  const totals = record.totalsByLevel[level] ?? record.totalsByLevel["100L"];
  const compulsoryLines = lines.filter((line) => line.category === "compulsory");
  const optionalLines = lines.filter((line) => line.category === "optional");
  const semTotals = useMemo(
    () => semesterTotals(compulsoryLines),
    [compulsoryLines]
  );

  const isFresh = studentType === "fresh";
  const heroLabel = "Estimated fees";
  const heroAmount = totals?.compulsory ?? 0;
  const needsConfirmation = isCommunityReport(
    record.verification_status,
    record.confidence_level
  );
  const heroHelpText = needsConfirmation
    ? "Shown for planning only until stronger evidence is reviewed. Confirm before paying."
    : "Includes compulsory fees for this level. Hostel and feeding are not included.";

  const verificationRows: VerificationRow[] = [
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
          className="items-end text-right [&>p]:hidden md:items-center md:text-center md:[&>p]:block"
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
      info: <SourceTypeInfo />,
    },
    {
      label: "Students confirmed",
      value: String(record.confirmationsCount ?? 0),
    },
  ];

  return (
    <section className="bg-brand-lime-light px-4 pb-14 pt-8 sm:px-10 sm:pb-20 sm:pt-12 lg:px-20">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-8 flex justify-center">
          <DetailViewTabs activeView={activeView} onChange={setActiveView} />
        </div>

        {activeView === "breakdown" ? (
          <>
            <div id="overview" className="scroll-mt-28">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-brand-ink/50">
                    {heroLabel}
                  </p>
                  <span className="group relative inline-flex">
                    <button
                      type="button"
                      aria-label={`About ${heroLabel.toLowerCase()}`}
                      className="inline-flex size-5 items-center justify-center rounded-full border border-brand-ink/15 bg-white/70 text-brand-ink/55 transition hover:border-brand-ink/25 hover:text-brand-ink focus:outline-none focus:ring-2 focus:ring-[#f2ac5b]/45"
                    >
                      <Info className="size-3.5" aria-hidden />
                    </button>
                    <span
                      role="tooltip"
                      className="pointer-events-none absolute left-1/2 top-7 z-20 w-[230px] -translate-x-1/2 rounded-lg bg-brand-ink px-3 py-2 text-xs font-normal leading-5 text-white opacity-0 shadow-[0_8px_20px_rgba(0,44,21,0.14)] transition group-hover:opacity-100 group-focus-within:opacity-100 sm:left-0 sm:translate-x-0"
                    >
                      {heroHelpText}
                    </span>
                  </span>
                </div>
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
                      Published compulsory fees for {record.course} at{" "}
                      {record.schoolName}, including one-time fresh charges.
                      Session {record.session}. Hostel and feeding are not
                      included.
                    </>
                  ) : (
                    <>
                      Published compulsory fees for {level} {record.course} at{" "}
                      {record.schoolName}. Session {record.session}. Hostel
                      and feeding are not included.
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
                  label="Academic level"
                  value={level}
                  onChange={setLevel}
                  options={record.levels}
                />
                <FilterSelect
                  label="Payment plan"
                  value={paymentPlan}
                  onChange={setPaymentPlan}
                  options={record.paymentPlans}
                />
              </div>
            </div>

            {needsConfirmation && (
              <InfoPrompt
                className="mt-8"
                title="Community-reported fee. Confirm before you pay."
                description="Shown for planning only until stronger evidence is reviewed."
              />
            )}

            <div id="breakdown" className="mt-7 md:hidden">
              <MobileFeeBreakdown
                compulsoryLines={compulsoryLines}
                optionalLines={optionalLines}
                paymentPlan={paymentPlan}
                semTotals={semTotals}
                isFresh={isFresh}
                heroLabel={heroLabel}
                heroAmount={heroAmount}
                accommodationTotal={totals?.accommodation ?? 0}
              />
            </div>

            <div className="mt-8 hidden overflow-x-auto rounded-2xl border border-[#e5ebe5] bg-white md:block">
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
                  className="font-semibold text-[#c96d18] underline-offset-4 hover:text-[#a95812] hover:underline"
                >
                  How verification works
                </Link>
              </p>
            </div>

            <div className="mt-7 md:hidden">
              <MobileVerificationList rows={verificationRows} />
            </div>

            <div className="mt-8 hidden overflow-x-auto rounded-2xl border border-[#e5ebe5] bg-white md:block">
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
                        <p className="flex items-center gap-2 text-lg font-medium leading-[1.2] tracking-[-0.04em] text-[#355955]">
                          {row.label}
                          {row.info}
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
              <div className="mt-6 rounded-2xl border border-[#e5ebe5] bg-white p-4 sm:p-5">
                {record.evidence && (
                  <a
                    href={record.evidence.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-xl transition-colors"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-lime-light text-brand-ink">
                      <FileText className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-medium tracking-[-0.02em] text-brand-ink">
                        Supporting evidence
                      </span>
                      <span className="mt-0.5 block truncate text-[15px] text-brand-ink/65">
                        {record.evidence.title} · {record.evidence.typeLabel}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1 text-[15px] font-medium text-primary">
                      View
                      <ExternalLink className="size-3.5" aria-hidden />
                    </span>
                  </a>
                )}
                {record.evidence && record.reviewerNote && (
                  <div className="my-4 border-t border-[#e5ebe5]" />
                )}
                {record.reviewerNote && (
                  <div>
                    <p className="text-[15px] font-medium tracking-[-0.02em] text-brand-ink">
                      Reviewer note
                    </p>
                    <p className="mt-1 text-[15px] leading-[1.5] tracking-[-0.02em] text-brand-ink/70">
                      {renderReviewerNote(record.reviewerNote)}
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
              <FeeCourseCompareMatrix
                record={record}
                level={level}
                peerColumns={peerColumns}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function renderReviewerNote(note: string): ReactNode {
  const match = note.match(/Source:\s*(https?:\/\/\S+)/i);
  if (!match) return note;

  const url = match[1].replace(/[.,)]$/, "");
  const withoutSource = note
    .replace(match[0], "")
    .replace(/\s*Local copy:\s*\S+/i, "")
    .trim();

  return (
    <>
      {withoutSource} Source: {" "}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 font-medium text-[#c96d18] underline-offset-2 hover:text-[#a95812] hover:underline"
      >
        View source
        <ExternalLink className="size-3.5" aria-hidden />
      </a>
      .
    </>
  );
}

function formatStatus(status: FeeDetailRecord["verification_status"]): string {
  if (status === "officially_verified") return "Officially verified";
  if (status === "community_verified") return "Community verified";
  if (status === "reported") return "Reported";
  if (status === "outdated") return "Possibly outdated";
  return "Disputed";
}

function MobileFeeBreakdown({
  compulsoryLines,
  optionalLines,
  paymentPlan,
  semTotals,
  isFresh,
  heroLabel,
  heroAmount,
  accommodationTotal,
}: {
  compulsoryLines: FeeBreakdownLine[];
  optionalLines: FeeBreakdownLine[];
  paymentPlan: string;
  semTotals: { first: number; second: number };
  isFresh: boolean;
  heroLabel: string;
  heroAmount: number;
  accommodationTotal: number;
}) {
  const compulsoryTotal =
    paymentPlan === "semester"
      ? semTotals.first + semTotals.second
      : heroAmount;

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-2xl border border-[#e5ebe5] bg-white">
        <div className="border-b border-[#edf0ed] bg-[#fef8f0] px-5 py-4">
          <p className="text-base font-semibold tracking-[-0.03em] text-brand-ink">
            Compulsory fees
          </p>
          <p className="mt-1 text-sm text-brand-ink/65">
            Required charges for this {isFresh ? "fresh" : "returning"} student record
          </p>
        </div>
        <div className="divide-y divide-[#edf0ed]">
          {compulsoryLines.map((line) => (
            <MobileFeeLine
              key={line.id}
              line={line}
              category="Compulsory"
              amount={lineAmountForPlan(line.amount, line.due, paymentPlan)}
              note={
                paymentPlan === "semester" && line.due === "both"
                  ? `${line.note} · shown per semester`
                  : line.note
              }
            />
          ))}
        </div>
        <MobileFeeTotal
          label={paymentPlan === "semester" ? "Semester totals" : heroLabel}
          note={
            paymentPlan === "semester"
              ? `1st ${formatCurrency(semTotals.first)} · 2nd ${formatCurrency(semTotals.second)}`
              : isFresh
                ? "Fresh student"
                : "Returning student"
          }
          amount={compulsoryTotal}
          tone="amber"
        />
      </section>

      {optionalLines.length > 0 && (
        <section className="overflow-hidden rounded-2xl border border-[#e5ebe5] bg-white">
          <div className="border-b border-[#edf0ed] bg-[#fef8f0] px-5 py-4">
            <p className="text-base font-semibold tracking-[-0.03em] text-brand-ink">
              Accommodation and extras
            </p>
            <p className="mt-1 text-sm text-brand-ink/65">
              Optional costs not included in the required fees
            </p>
          </div>
          <div className="divide-y divide-[#edf0ed]">
            {optionalLines.map((line) => (
              <MobileFeeLine
                key={line.id}
                line={line}
                category="Optional"
                amount={line.amount}
                note={line.note}
              />
            ))}
          </div>
          <MobileFeeTotal
            label="Total with accommodation"
            note="Compulsory fees plus listed accommodation"
            amount={compulsoryTotal + accommodationTotal}
          />
        </section>
      )}
    </div>
  );
}

function MobileFeeLine({
  line,
  category,
  amount,
  note,
}: {
  line: FeeBreakdownLine;
  category: string;
  amount: number;
  note: string;
}) {
  return (
    <div className="px-5 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-base font-semibold leading-5 tracking-[-0.03em] text-[#355955]">
            {line.name}
          </p>
          <p className="mt-1 text-sm leading-5 text-brand-ink/65">{note}</p>
        </div>
        <p className="shrink-0 text-base font-semibold tracking-[-0.03em] text-[#355955]">
          {formatCurrency(amount)}
        </p>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs font-medium text-brand-ink/55">
        <span className="rounded-full bg-brand-lime-light px-2.5 py-1">
          {category}
        </span>
        <span>Due {dueLabel(line.due)}</span>
      </div>
    </div>
  );
}

function MobileFeeTotal({
  label,
  note,
  amount,
  tone = "cream",
}: {
  label: string;
  note: string;
  amount: number;
  tone?: "amber" | "cream";
}) {
  return (
    <div
      className={cn(
        "flex items-end justify-between gap-4 border-t border-[#edf0ed] px-5 py-4",
        tone === "amber" ? "bg-[rgba(242,172,91,0.09)]" : "bg-[#fef8f0]"
      )}
    >
      <div className="min-w-0">
        <p className="text-base font-semibold tracking-[-0.03em] text-[#355955]">
          {label}
        </p>
        <p className="mt-1 text-sm leading-5 text-brand-ink/65">{note}</p>
      </div>
      <p className="shrink-0 text-lg font-semibold tracking-[-0.03em] text-[#355955]">
        {formatCurrency(amount)}
      </p>
    </div>
  );
}

function MobileVerificationList({ rows }: { rows: VerificationRow[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e5ebe5] bg-white">
      <div className="border-b border-[#edf0ed] bg-[#fef8f0] px-5 py-4">
        <p className="text-base font-semibold tracking-[-0.03em] text-brand-ink">
          Record details
        </p>
        <p className="mt-1 text-sm text-brand-ink/65">
          The evidence and review context behind these figures
        </p>
      </div>
      <dl className="divide-y divide-[#edf0ed]">
        {rows.map((row) => (
          <div key={row.label} className="px-5 py-4">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
              <dt>
                <span className="flex items-center gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-[0.08em] text-brand-ink/45">
                    {row.label}
                  </span>
                  {row.info}
                </span>
                {row.note && (
                  <span className="mt-1 block text-sm leading-5 normal-case text-brand-ink/58">
                    {row.note}
                  </span>
                )}
              </dt>
              <dd className="text-right text-base font-semibold leading-6 tracking-[-0.02em] text-brand-ink">
                {row.value}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
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
