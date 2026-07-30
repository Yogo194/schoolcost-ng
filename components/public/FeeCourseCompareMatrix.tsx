"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  Repeat2,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import type { FeeDetailRecord } from "@/lib/mock/fee-detail";
import {
  getCourseCompareColumns,
  type CourseCompareColumn,
} from "@/lib/mock/course-compare";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import { InfoPrompt } from "@/components/public/InfoPrompt";
import {
  ConfidenceDisplay,
  parseConfidenceLevel,
} from "@/components/public/ConfidenceDisplay";
import { SourceBadge } from "@/components/public/SourceBadge";

interface FeeCourseCompareMatrixProps {
  record: FeeDetailRecord;
  level: string;
  /** Live comparison rows from Supabase. Omit only for legacy detail-page demos. */
  comparisonColumns?: CourseCompareColumn[];
  /**
   * Standalone compare page: start with no schools selected (slot-based
   * empty state) and let every column be removed. Embedded contexts (fee
   * detail page) keep the pre-filled behavior with the current school pinned.
  */
  startEmpty?: boolean;
  /** Returns the standalone comparison flow to its course picker. */
  onChangeCourse?: () => void;
  showExamples?: boolean;
}

type MetricKey =
  | "course"
  | "level"
  | "session"
  | "firstYearTotal"
  | "returningYearTotal"
  | "compulsoryTotal"
  | "accommodationTotal"
  | "estimatedDegreeTotal"
  | "paymentLabel"
  | "lastReviewedLabel"
  | "sourceLabel"
  | "confidenceLabel";

type MetricBand = "money" | "details" | "trust";

const BAND_LABELS: Record<MetricBand, string> = {
  money: "What you'll pay",
  details: "The details",
  trust: "Can you trust these numbers?",
};

const METRICS: Array<{
  key: MetricKey;
  label: string;
  note?: string;
  money?: boolean;
  highlightLowest?: boolean;
  band: MetricBand;
}> = [
  {
    key: "firstYearTotal",
    label: "What you'll pay in Year 1",
    note: "All compulsory charges, including one-time fees",
    money: true,
    highlightLowest: true,
    band: "money",
  },
  {
    key: "returningYearTotal",
    label: "What you'll pay each year after",
    note: "From Year 2 upward, per session",
    money: true,
    highlightLowest: true,
    band: "money",
  },
  {
    key: "accommodationTotal",
    label: "Hostel (optional)",
    note: "Only if you choose school accommodation",
    money: true,
    highlightLowest: true,
    band: "money",
  },
  {
    key: "estimatedDegreeTotal",
    label: "Total for the whole programme",
    note: "All compulsory charges, start to finish",
    money: true,
    highlightLowest: true,
    band: "money",
  },
  { key: "course", label: "Course", band: "details" },
  { key: "level", label: "Level", band: "details" },
  { key: "session", label: "Session", band: "details" },
  { key: "paymentLabel", label: "How you can pay", band: "details" },
  { key: "sourceLabel", label: "Where this comes from", band: "trust" },
  { key: "lastReviewedLabel", label: "Last checked", band: "trust" },
  {
    key: "confidenceLabel",
    label: "How sure are we?",
    note: "Based on source strength and how recent the review is",
    band: "trust",
  },
];

const MOBILE_METRICS = METRICS.filter((metric) => metric.band === "money");

const MAX_SCHOOLS = 3;

export function FeeCourseCompareMatrix({
  record,
  level,
  comparisonColumns,
  startEmpty = false,
  onChangeCourse,
  showExamples = true,
}: FeeCourseCompareMatrixProps) {
  const generatedColumns = useMemo(
    () => getCourseCompareColumns(record, level),
    [record, level]
  );
  const allColumns = comparisonColumns ?? generatedColumns;

  return (
    <FeeCourseCompareContent
      key={`${record.id}-${level}`}
      record={record}
      level={level}
      allColumns={allColumns}
      startEmpty={startEmpty}
      onChangeCourse={onChangeCourse}
      showExamples={showExamples}
    />
  );
}

function FeeCourseCompareContent({
  record,
  level,
  allColumns,
  startEmpty,
  onChangeCourse,
  showExamples,
}: {
  record: FeeDetailRecord;
  level: string;
  allColumns: CourseCompareColumn[];
  startEmpty: boolean;
  onChangeCourse?: () => void;
  showExamples: boolean;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    startEmpty ? [] : allColumns.slice(0, 1).map((column) => column.id)
  );
  const stickySentinelRef = useRef<HTMLDivElement>(null);
  const [headerStuck, setHeaderStuck] = useState(false);

  const columns = allColumns.filter((column) =>
    selectedIds.includes(column.id)
  );
  const availableColumns = allColumns.filter(
    (column) => !selectedIds.includes(column.id)
  );
  const isEmpty = columns.length === 0;

  useEffect(() => {
    const sentinel = stickySentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeaderStuck(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [columns.length]);

  function removeColumn(id: string) {
    setSelectedIds((ids) => ids.filter((selectedId) => selectedId !== id));
  }

  function addColumn(id: string) {
    setSelectedIds((ids) => [...ids, id].slice(0, MAX_SCHOOLS));
  }

  function loadExample(ids: string[]) {
    setSelectedIds(ids.slice(0, MAX_SCHOOLS));
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="rounded-2xl border border-[#e5ebe5] bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-brand-ink/45">
              Schools in this comparison
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1.5">
              <p className="text-[15px] tracking-[-0.02em] text-brand-ink/65">
                {record.course} · {level} · up to {MAX_SCHOOLS} schools
              </p>
              {onChangeCourse && (
                <button
                  type="button"
                  onClick={onChangeCourse}
                  className="inline-flex items-center gap-1.5 text-[15px] font-semibold tracking-[-0.02em] text-[#c56d20] transition-colors hover:text-[#8f4d16]"
                >
                  <Repeat2 className="size-3.5" aria-hidden />
                  Switch course
                </button>
              )}
            </div>
          </div>
          <p className="text-[15px] tracking-[-0.02em] text-brand-ink/50">
            {columns.length}/{MAX_SCHOOLS} added
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {Array.from({ length: MAX_SCHOOLS }).map((_, index) => {
            const column = columns[index];
            if (column) {
              return (
                <SchoolChip
                  key={column.id}
                  column={column}
                  onRemove={
                    startEmpty || !column.isCurrent
                      ? () => removeColumn(column.id)
                      : undefined
                  }
                />
              );
            }

            const isFirstEmpty = index === columns.length;
            if (availableColumns.length === 0) return null;

            return (
              <AddSchoolSlot
                key={`slot-${index}`}
                course={record.course}
                level={level}
                availableColumns={availableColumns}
                onAdd={addColumn}
                primary={isFirstEmpty}
                className={cn(!isFirstEmpty && "hidden sm:flex")}
              />
            );
          })}
        </div>

        {isEmpty && showExamples && (
          <div className="mt-5 border-t border-[#edf0ed] pt-4">
            <p className="flex items-center gap-1.5 text-sm font-medium tracking-[-0.02em] text-brand-ink/70">
              <Sparkles className="size-4 text-brand-ink/50" aria-hidden />
              New here? See a ready-made example:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <ExampleChip
                label={`${record.course}: UNILAG vs UI vs OAU`}
                onClick={() =>
                  loadExample([record.id, "demo-ui-cs", "demo-oau-cs"])
                }
              />
              <ExampleChip
                label={`${record.course}: UNILAG vs LASU`}
                onClick={() => loadExample([record.id, "demo-lasu-cs"])}
              />
            </div>
          </div>
        )}
      </div>

      <MobileComparison columns={columns} />

      {columns.length > 0 && (
        <div className="relative hidden max-w-full rounded-2xl border border-[#e5ebe5] bg-white motion-reduce:animate-none md:block animate-compare-table-flow [--compare-sticky-top:var(--public-header-height,0px)] [--compare-school-row-height:4rem]">
          {/* Sentinel: when this leaves the viewport, the School header is stuck.
              Absolutely positioned so it doesn't push the header down and expose
              the card's rounded corners. */}
          <div
            ref={stickySentinelRef}
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            aria-hidden
          />
          <table className="w-full table-fixed border-separate border-spacing-0 text-left">
            <thead>
              <tr>
                <th
                  className={cn(
                    "sticky top-[var(--compare-sticky-top)] z-20 h-16 w-[min(280px,28%)] rounded-tl-2xl bg-[#F2AC5B] px-5 text-left text-[18px] font-medium tracking-[-0.25px] text-brand-ink",
                    headerStuck && "rounded-tl-none"
                  )}
                >
                  School
                </th>
                {columns.map((col, index) => (
                  <th
                    key={col.id}
                    className={cn(
                      "sticky top-[var(--compare-sticky-top)] z-20 h-16 bg-[#F2AC5B] px-4 text-left",
                      index === columns.length - 1 && "rounded-tr-2xl",
                      headerStuck && index === columns.length - 1 && "rounded-tr-none"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      {col.logoUrl ? (
                        <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
                          <Image
                            src={col.logoUrl}
                            alt=""
                            width={32}
                            height={32}
                            className="size-full object-contain"
                          />
                        </span>
                      ) : (
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-lime text-xs font-semibold text-brand-ink">
                          {(col.abbreviation || col.schoolName.slice(0, 2)).slice(
                            0,
                            2
                          )}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-base font-medium tracking-[-0.02em] text-[#002c15]">
                          {col.abbreviation || col.schoolName}
                        </p>
                        <p className="truncate text-xs font-normal tracking-[-0.02em] text-[#002c15]/70">
                          {col.schoolName}
                        </p>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {METRICS.map((metric, metricIndex) => {
                const moneyValues = metric.money
                  ? columns.map((col) => Number(col[metric.key])).filter((value) => value > 0)
                  : [];
                const lowest =
                  moneyValues.length > 1 ? Math.min(...moneyValues) : null;

                const isBandStart =
                  metricIndex === 0 ||
                  METRICS[metricIndex - 1].band !== metric.band;

                return (
                  <BandedRow
                    key={metric.key}
                    metric={metric}
                    columns={columns}
                    lowest={lowest}
                    showBandHeader={isBandStart}
                  />
                );
              })}

              <tr className="border-t border-[#e5ebe5] bg-white">
                <td className="rounded-bl-2xl px-5 py-4" />
                {columns.map((col, index) => (
                  <td
                    key={`${col.id}-action`}
                    className={cn(
                      "px-4 py-4",
                      index === columns.length - 1 && "rounded-br-2xl"
                    )}
                  >
                    {!startEmpty && col.isCurrent ? (
                      <span className="text-base font-medium tracking-[-0.02em] text-brand-ink/50">
                        Viewing now
                      </span>
                    ) : (
                      <Link
                        href={`/schools/${col.schoolSlug}/fees/${col.feeRecordId}`}
                        className="text-base font-medium tracking-[-0.02em] text-primary transition-colors hover:underline"
                      >
                        View breakdown →
                      </Link>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {columns.length > 0 && (
        <InfoPrompt
          title="Lowest cost is not the same as best fit"
          description="Check hostel options, payment rules, and how recently each figure was reviewed before you decide."
        />
      )}
    </div>
  );
}

/** Empty slot that adds a school. Primary style for the first empty slot. */
function AddSchoolSlot({
  course,
  level,
  availableColumns,
  onAdd,
  primary,
  className,
}: {
  course: string;
  level: string;
  availableColumns: CourseCompareColumn[];
  onAdd: (id: string) => void;
  primary: boolean;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "relative flex min-h-[72px] cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 transition-colors",
        primary
          ? "border border-[#355955]/45 bg-brand-lime-light/60 hover:border-[#355955]/70 hover:bg-brand-lime-light"
          : "border border-dashed border-[#355955]/35 bg-white hover:border-[#355955]/55",
        className
      )}
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full",
          primary
            ? "bg-brand-lime text-brand-ink"
            : "border border-[#355955]/25 bg-white text-brand-ink/60"
        )}
      >
        <Plus className="size-4" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium tracking-[-0.02em] text-brand-ink">
          {primary ? "Add a school" : "Add another school"}
        </span>
        <span className="mt-0.5 block text-[13px] tracking-[-0.02em] text-brand-ink/70">
          {course} · {level}
        </span>
      </span>
      <ChevronDown className="size-4 shrink-0 text-brand-ink/40" aria-hidden />
      <select
        value=""
        aria-label={`Add a school offering ${course}`}
        onChange={(event) => {
          if (event.target.value) onAdd(event.target.value);
        }}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        <option value="">Add a school</option>
        {availableColumns.map((column) => (
          <option key={column.id} value={column.id}>
            {column.schoolName}
          </option>
        ))}
      </select>
    </label>
  );
}

function ExampleChip({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-[#edcfac] bg-[#fef8f0] px-3.5 py-2 text-sm font-medium tracking-[-0.02em] text-brand-ink transition-colors hover:border-[#e7b77e] hover:bg-[#fcebd7]"
    >
      {label}
    </button>
  );
}

function BandedRow({
  metric,
  columns,
  lowest,
  showBandHeader,
}: {
  metric: (typeof METRICS)[number];
  columns: CourseCompareColumn[];
  lowest: number | null;
  showBandHeader: boolean;
}) {
  return (
    <>
      {showBandHeader && (
        <tr className="bg-[#fafbf8]">
          <StickyBandLabel
            label={BAND_LABELS[metric.band]}
            colSpan={columns.length + 1}
          />
        </tr>
      )}
      <tr>
        <td className="border-t border-[#e5ebe5] px-5 py-4 align-middle">
          <p className="text-lg font-medium leading-[1.2] tracking-[-0.04em] text-[#355955]">
            {metric.label}
          </p>
          {metric.note && (
            <p className="mt-0.5 text-base leading-[1.4] tracking-[-0.02em] text-brand-ink/80">
              {metric.note}
            </p>
          )}
        </td>
        {columns.map((col) => {
          const isLowest =
            metric.highlightLowest &&
            lowest != null &&
            Number(col[metric.key]) > 0 &&
            Number(col[metric.key]) === lowest;

          return (
            <td
              key={`${col.id}-${metric.key}`}
              className={cn(
                "border-t border-[#e5ebe5] px-4 py-4 align-middle",
                isLowest && "bg-[#fcffe7]/45"
              )}
            >
              <MetricCell
                column={col}
                columns={columns}
                metricKey={metric.key}
                money={metric.money}
                isLowest={Boolean(isLowest)}
              />
            </td>
          );
        })}
      </tr>
    </>
  );
}

/** Band label that only shows a drop shadow while it is the actively pinned sticky band. */
function StickyBandLabel({
  label,
  colSpan,
}: {
  label: string;
  colSpan: number;
}) {
  const cellRef = useRef<HTMLTableCellElement>(null);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (!cellRef.current || typeof IntersectionObserver === "undefined") return;
    const node: HTMLTableCellElement = cellRef.current;

    let observer: IntersectionObserver | null = null;

    function connect() {
      observer?.disconnect();

      const schoolRowHeight =
        getComputedStyle(node)
          .getPropertyValue("--compare-school-row-height")
          .trim() || "4rem";
      const probe = document.createElement("div");
      probe.style.height = schoolRowHeight;
      probe.style.position = "absolute";
      probe.style.visibility = "hidden";
      document.body.appendChild(probe);
      const pin = probe.getBoundingClientRect().height;
      document.body.removeChild(probe);

      const bottomCut = Math.max(window.innerHeight - pin - 2, 0);
      observer = new IntersectionObserver(
        ([entry]) => {
          setPinned(entry.isIntersecting);
        },
        {
          // 2px detection line exactly at the band sticky offset under the School row.
          rootMargin: `-${pin}px 0px -${bottomCut}px 0px`,
          threshold: 0,
        }
      );
      observer.observe(node);
    }

    connect();
    window.addEventListener("resize", connect);
    return () => {
      window.removeEventListener("resize", connect);
      observer?.disconnect();
    };
  }, []);

  return (
    <td
      ref={cellRef}
      colSpan={colSpan}
      className={cn(
        "sticky top-[calc(var(--compare-sticky-top)+var(--compare-school-row-height))] z-10 border-0 bg-[#fafbf8] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-brand-ink/55",
        pinned && "shadow-[inset_0_-1px_0_0_rgba(3,48,42,0.08),0_3px_8px_rgba(3,48,42,0.08)]"
      )}
    >
      {label}
    </td>
  );
}

function MobileComparison({ columns }: { columns: CourseCompareColumn[] }) {
  if (columns.length === 0) return null;

  return (
    <div className="animate-compare-table-flow space-y-3 motion-reduce:animate-none md:hidden">
      <div className="rounded-2xl border border-[#e5ebe5] bg-white px-4 py-4">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-brand-ink/45">
          Compare at a glance
        </p>
        <p className="mt-1 text-sm leading-5 text-brand-ink/65">
          The money comes first. Open each card to see where the difference
          comes from.
        </p>
      </div>

      {MOBILE_METRICS.map((metric) => (
        <MobileMetricCard key={metric.key} metric={metric} columns={columns} />
      ))}

      <div className="rounded-2xl border border-[#e5ebe5] bg-white p-4">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-brand-ink/45">
          Can you trust these numbers?
        </p>
        <div className="mt-3 space-y-3">
          {columns.map((column) => (
            <div
              key={column.id}
              className="rounded-xl border border-[#edf0ed] bg-[#fafcfa] p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-brand-ink">
                    {column.schoolName}
                  </p>
                  <p className="mt-0.5 text-xs text-brand-ink/55">
                    {column.session} · last checked {column.lastReviewedLabel}
                  </p>
                </div>
                <SourceBadge sourceType={column.source_type} compact />
              </div>
              <div className="mt-3">
                <ConfidenceDisplay
                  level={parseConfidenceLevel(column.confidenceLabel)}
                  compact
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileMetricCard({
  metric,
  columns,
}: {
  metric: (typeof METRICS)[number];
  columns: CourseCompareColumn[];
}) {
  const values = columns
    .map((column) => Number(column[metric.key]))
    .filter((value) => value > 0);
  const lowest = values.length > 1 ? Math.min(...values) : null;

  return (
    <section className="overflow-hidden rounded-2xl border border-[#e5ebe5] bg-white">
      <div className="border-b border-[#edf0ed] bg-[#fafbf8] px-4 py-3.5">
        <p className="text-base font-semibold tracking-[-0.03em] text-brand-ink">
          {metric.label}
        </p>
        {metric.note && (
          <p className="mt-0.5 text-sm leading-5 text-brand-ink/65">
            {metric.note}
          </p>
        )}
      </div>

      <div className="divide-y divide-[#edf0ed]">
        {columns.map((column) => {
          const value = Number(column[metric.key]);
          const isLowest = value > 0 && lowest != null && value === lowest;

          return (
            <div
              key={column.id}
              className={cn(
                "flex items-center justify-between gap-4 px-4 py-4",
                isLowest && "bg-[#fcffe7]/45"
              )}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-lime text-xs font-semibold text-brand-ink">
                  {(column.abbreviation || column.schoolName.slice(0, 2))
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-brand-ink">
                    {column.schoolName}
                  </p>
                  <p className="mt-0.5 text-xs text-brand-ink/55">
                    {column.abbreviation || column.state}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-base font-semibold tracking-[-0.03em] text-[#355955]">
                  {value > 0 ? formatCurrency(value) : "Not listed"}
                </p>
                {isLowest && (
                  <span className="mt-1 inline-flex rounded-[8px] border border-[#d8ec8c] bg-white px-2 py-0.5 text-[11px] font-semibold text-brand-ink">
                    Lowest
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SchoolChip({
  column,
  onRemove,
}: {
  column: CourseCompareColumn;
  onRemove?: () => void;
}) {
  return (
    <div className="flex min-h-[72px] items-start gap-3 rounded-2xl border border-[#e5ebe5] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(3,48,42,0.04)]">
      {column.logoUrl ? (
        <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
          <Image
            src={column.logoUrl}
            alt=""
            width={40}
            height={40}
            className="size-full object-contain p-1"
          />
        </span>
      ) : (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-lime text-sm font-semibold text-brand-ink">
          {(column.abbreviation || column.schoolName.slice(0, 2)).slice(0, 2)}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[15px] font-medium tracking-[-0.02em] text-brand-ink">
            {column.schoolName}
          </p>
          {column.isCurrent && !onRemove && (
            <span className="rounded-[8px] bg-brand-lime px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.04em] text-brand-ink">
              Current
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[13px] tracking-[-0.02em] text-brand-ink/55">
          {[column.abbreviation, column.ownership, column.state]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-[#e5ebe5] text-brand-ink/50 transition-colors hover:border-brand-ink/20 hover:text-brand-ink"
          aria-label={`Remove ${column.schoolName} from comparison`}
        >
          <X className="size-3.5" aria-hidden />
        </button>
      )}
    </div>
  );
}

function parseReviewDate(label: string): number {
  const time = Date.parse(label);
  return Number.isNaN(time) ? 0 : time;
}

function MetricCell({
  column,
  columns,
  metricKey,
  money,
  isLowest,
}: {
  column: CourseCompareColumn;
  columns: CourseCompareColumn[];
  metricKey: MetricKey;
  money?: boolean;
  isLowest: boolean;
}) {
  const value = column[metricKey];

  if (money) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-base font-semibold tracking-[-0.25px] text-[#355955]">
          {Number(value) > 0 ? formatCurrency(Number(value)) : "Not listed"}
        </span>
        {isLowest && (
          <span className="rounded-[8px] border border-[#d8ec8c] bg-white px-2 py-0.5 text-xs font-semibold tracking-[-0.02em] text-brand-ink">
            Lowest
          </span>
        )}
      </div>
    );
  }

  if (metricKey === "sourceLabel") {
    return <SourceBadge sourceType={column.source_type} compact />;
  }

  if (metricKey === "confidenceLabel") {
    return (
      <ConfidenceDisplay
        level={parseConfidenceLevel(String(value))}
        compact
      />
    );
  }

  if (metricKey === "lastReviewedLabel") {
    const times = columns.map((col) => parseReviewDate(col.lastReviewedLabel));
    const newest = Math.max(...times);
    const isMostRecent =
      columns.length > 1 &&
      newest > 0 &&
      parseReviewDate(column.lastReviewedLabel) === newest;

    return (
      <span className="inline-flex flex-wrap items-center gap-2 text-base tracking-[-0.02em] text-[#355955]">
        {String(value)}
        {isMostRecent && (
          <span className="rounded-[8px] bg-[#fcffe7] px-2 py-0.5 text-xs font-semibold tracking-[-0.02em] text-brand-ink">
            Most recent
          </span>
        )}
      </span>
    );
  }

  return (
    <span className="text-base tracking-[-0.02em] text-[#355955]">
      {String(value)}
    </span>
  );
}
