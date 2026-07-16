"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Info, Plus, X } from "lucide-react";
import type { FeeDetailRecord } from "@/lib/mock/fee-detail";
import {
  getCourseCompareColumns,
  type CourseCompareColumn,
} from "@/lib/mock/course-compare";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import {
  ConfidenceDisplay,
  parseConfidenceLevel,
} from "@/components/public/ConfidenceDisplay";
import { SourceBadge } from "@/components/public/SourceBadge";

interface FeeCourseCompareMatrixProps {
  record: FeeDetailRecord;
  level: string;
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

const METRICS: Array<{
  key: MetricKey;
  label: string;
  note?: string;
  money?: boolean;
  highlightLowest?: boolean;
}> = [
  { key: "course", label: "Course" },
  { key: "level", label: "Level" },
  { key: "session", label: "Session" },
  {
    key: "firstYearTotal",
    label: "First-year total",
    note: "100 Level · including one-time charges",
    money: true,
    highlightLowest: true,
  },
  {
    key: "returningYearTotal",
    label: "Returning-year total",
    note: "Per session after first year",
    money: true,
    highlightLowest: true,
  },
  {
    key: "compulsoryTotal",
    label: "Selected level total",
    note: "Compulsory for the level in this compare",
    money: true,
    highlightLowest: true,
  },
  {
    key: "accommodationTotal",
    label: "Accommodation",
    note: "Hostel, optional",
    money: true,
    highlightLowest: true,
  },
  {
    key: "estimatedDegreeTotal",
    label: "Estimated degree cost",
    note: "Compulsory, whole programme",
    money: true,
    highlightLowest: true,
  },
  { key: "paymentLabel", label: "Payment" },
  { key: "lastReviewedLabel", label: "Last reviewed" },
  { key: "sourceLabel", label: "Source" },
  {
    key: "confidenceLabel",
    label: "Data confidence",
    note: "How sure we are about these figures",
  },
];

export function FeeCourseCompareMatrix({
  record,
  level,
}: FeeCourseCompareMatrixProps) {
  const allColumns = useMemo(
    () => getCourseCompareColumns(record, level),
    [record, level]
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setSelectedIds(allColumns.slice(0, 2).map((column) => column.id));
  }, [allColumns]);

  const columns = allColumns.filter((column) =>
    selectedIds.includes(column.id)
  );
  const availableColumns = allColumns.filter(
    (column) => !selectedIds.includes(column.id)
  );
  const canAdd = columns.length < 3 && availableColumns.length > 0;

  function removeColumn(id: string) {
    setSelectedIds((ids) => ids.filter((selectedId) => selectedId !== id));
  }

  function addColumn(id: string) {
    setSelectedIds((ids) => [...ids, id].slice(0, 3));
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#e5ebe5] bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-brand-ink/45">
              Schools in this compare
            </p>
            <p className="mt-1 text-sm tracking-[-0.02em] text-brand-ink/65">
              {record.course} · {level} · up to 3 schools
            </p>
          </div>
          <p className="text-sm tracking-[-0.02em] text-brand-ink/50">
            {columns.length}/3 selected
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {columns.map((col) => (
            <SchoolChip
              key={col.id}
              column={col}
              onRemove={
                col.isCurrent ? undefined : () => removeColumn(col.id)
              }
            />
          ))}

          {canAdd ? (
            <label className="relative flex min-h-[72px] min-w-[220px] flex-1 items-center gap-3 rounded-2xl border border-dashed border-[#355955]/35 bg-brand-lime-light/40 px-4 py-3 transition-colors hover:border-[#355955]/55 hover:bg-brand-lime-light/70 sm:max-w-[280px]">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#355955]/25 bg-white text-brand-ink">
                <Plus className="size-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium tracking-[-0.02em] text-brand-ink">
                  Add a school
                </span>
                <span className="mt-0.5 block text-xs tracking-[-0.02em] text-brand-ink/55">
                  Same course · {level}
                </span>
              </span>
              <ChevronDown
                className="size-4 shrink-0 text-brand-ink/40"
                aria-hidden
              />
              <select
                value=""
                aria-label={`Add a school offering ${record.course}`}
                onChange={(event) => {
                  if (event.target.value) addColumn(event.target.value);
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
          ) : availableColumns.length === 0 ? (
            <div className="flex min-h-[72px] items-center rounded-2xl border border-[#e5ebe5] bg-[#fafafa] px-4 py-3 text-sm tracking-[-0.02em] text-brand-ink/50">
              No more schools available for this course and level.
            </div>
          ) : null}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#e5ebe5] bg-white">
        <table className="w-full min-w-[940px] border-collapse text-left">
          <thead>
            <tr>
              <th className="h-14 w-[280px] min-w-[280px] bg-[#f2ac5b] px-5 text-left text-[18px] font-medium tracking-[-0.25px] text-[#002c15]">
                Metric
              </th>
              {columns.map((col) => (
                <th
                  key={col.id}
                  className="h-14 min-w-[200px] bg-[#f2ac5b] px-4 text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-lime text-xs font-semibold text-brand-ink">
                      {(col.abbreviation || col.schoolName.slice(0, 2)).slice(
                        0,
                        2
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-base font-medium tracking-[-0.02em] text-[#002c15]">
                        {col.abbreviation || col.schoolName}
                      </p>
                      <p className="truncate text-xs font-normal tracking-[-0.02em] text-[#002c15]/65">
                        {col.schoolName}
                      </p>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {METRICS.map((metric) => {
              const moneyValues = metric.money
                ? columns.map((col) => Number(col[metric.key]))
                : [];
              const lowest =
                moneyValues.length > 1 ? Math.min(...moneyValues) : null;

              return (
                <tr key={metric.key} className="border-t border-[#e5ebe5]">
                  <td className="w-[280px] min-w-[280px] px-5 py-4 align-middle">
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
                      Number(col[metric.key]) === lowest;

                    return (
                      <td
                        key={`${col.id}-${metric.key}`}
                        className={cn(
                          "px-4 py-4 align-middle",
                          isLowest && "bg-[rgba(228,246,126,0.35)]"
                        )}
                      >
                        <MetricCell
                          column={col}
                          metricKey={metric.key}
                          money={metric.money}
                          isLowest={Boolean(isLowest)}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            <tr className="border-t border-[#e5ebe5] bg-[#fef8f0]">
              <td className="w-[280px] min-w-[280px] px-5 py-4" />
              {columns.map((col) => (
                <td key={`${col.id}-action`} className="px-4 py-4">
                  {col.isCurrent ? (
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

      <div className="flex items-start gap-3 rounded-2xl border border-[#e5ebe5] bg-white px-4 py-3.5">
        <Info
          className="mt-0.5 size-4 shrink-0 text-brand-ink/50"
          aria-hidden
        />
        <p className="text-sm leading-[1.5] tracking-[-0.02em] text-brand-ink/70">
          Lowest cost is not the same as best fit. Check hostel options,
          payment rules, and how recently each figure was reviewed before you
          decide.
        </p>
      </div>
    </div>
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
    <div className="flex min-h-[72px] min-w-[220px] flex-1 items-start gap-3 rounded-2xl border border-[#e5ebe5] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(3,48,42,0.04)] sm:max-w-[300px]">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-lime text-sm font-semibold text-brand-ink">
        {(column.abbreviation || column.schoolName.slice(0, 2)).slice(0, 2)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium tracking-[-0.02em] text-brand-ink">
            {column.schoolName}
          </p>
          {column.isCurrent && (
            <span className="rounded-[8px] bg-brand-lime px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-brand-ink">
              Current
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs tracking-[-0.02em] text-brand-ink/55">
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

function MetricCell({
  column,
  metricKey,
  money,
  isLowest,
}: {
  column: CourseCompareColumn;
  metricKey: MetricKey;
  money?: boolean;
  isLowest: boolean;
}) {
  const value = column[metricKey];

  if (money) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-base font-semibold tracking-[-0.25px] text-[#355955]">
          {formatCurrency(Number(value))}
        </span>
        {isLowest && (
          <span className="rounded-[8px] bg-brand-lime px-2 py-0.5 text-xs font-semibold tracking-[-0.02em] text-brand-ink">
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
    const isMostRecent = column.lastReviewedLabel === "12 July 2026";
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
