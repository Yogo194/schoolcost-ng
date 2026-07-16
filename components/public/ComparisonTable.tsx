import Link from "next/link";
import { Check, AlertCircle } from "lucide-react";
import type { FeeRecord } from "@/types/fee";
import type { Institution, AcademicSession, Course } from "@/types/institution";
import { VerificationBadge, SourceBadge } from "./SourceBadge";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

export interface CompareColumn {
  institution: Institution;
  course?: Course | null;
  session?: AcademicSession | null;
  record?: FeeRecord | null;
}

interface ComparisonTableProps {
  columns: CompareColumn[];
}

const ROWS: Array<{
  label: string;
  key: keyof Pick<
    FeeRecord,
    | "first_year_total"
    | "returning_year_total"
    | "accommodation_total"
    | "optional_total"
    | "estimated_degree_total"
  >;
  note?: string;
  highlight?: boolean;
}> = [
  { label: "First Year", key: "first_year_total", highlight: true },
  { label: "Per Year (Returning)", key: "returning_year_total" },
  { label: "Accommodation", key: "accommodation_total", note: "Separate" },
  { label: "Optional Fees", key: "optional_total", note: "If applicable" },
  {
    label: "Est. Degree Total",
    key: "estimated_degree_total",
    note: "Estimate",
  },
];

export function ComparisonTable({ columns }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[500px] border border-gray-200 rounded-xl overflow-hidden text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 w-36">
              &nbsp;
            </th>
            {columns.map((col) => (
              <th
                key={col.institution.id}
                className="px-4 py-3 text-center min-w-[180px]"
              >
                <Link
                  href={`/schools/${col.institution.slug}`}
                  className="font-semibold text-gray-900 hover:text-primary transition-colors text-sm"
                >
                  {col.institution.abbreviation || col.institution.name}
                </Link>
                {col.course && (
                  <p className="text-xs text-gray-500 mt-0.5 font-normal">
                    {col.course.name}
                  </p>
                )}
                {col.session && (
                  <p className="text-xs text-gray-400 font-normal">
                    {col.session.name}
                  </p>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, idx) => {
            const values = columns.map((col) =>
              col.record ? col.record[row.key] : null
            );
            const min = Math.min(
              ...(values.filter((v) => v != null) as number[])
            );

            return (
              <tr
                key={row.key}
                className={cn(
                  "border-b border-gray-100",
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                )}
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-700 text-xs">{row.label}</p>
                  {row.note && (
                    <p className="text-xs text-gray-400">{row.note}</p>
                  )}
                </td>
                {columns.map((col) => {
                  const val = col.record ? col.record[row.key] : null;
                  const isLowest = val != null && val === min && values.filter(v => v != null).length > 1;
                  return (
                    <td key={col.institution.id} className="px-4 py-3 text-center">
                      {val != null ? (
                        <div className="inline-flex flex-col items-center gap-1">
                          <span
                            className={cn(
                              "font-semibold tabular-nums",
                              row.highlight
                                ? isLowest
                                  ? "text-primary text-base"
                                  : "text-gray-900 text-base"
                                : "text-gray-700"
                            )}
                          >
                            {formatCurrency(
                              val,
                              col.record?.currency || "NGN"
                            )}
                          </span>
                          {isLowest && row.highlight && (
                            <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                              Lowest
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 flex items-center justify-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          N/A
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}

          {/* Verification status row */}
          <tr className="bg-white">
            <td className="px-4 py-3">
              <p className="font-medium text-gray-700 text-xs">Source</p>
            </td>
            {columns.map((col) => (
              <td key={col.institution.id} className="px-4 py-3 text-center">
                {col.record ? (
                  <div className="inline-flex flex-col items-center gap-1">
                    <VerificationBadge status={col.record.verification_status} />
                    <SourceBadge sourceType={col.record.source_type} />
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">-</span>
                )}
              </td>
            ))}
          </tr>

          {/* Last reviewed row */}
          <tr className="bg-gray-50/40">
            <td className="px-4 py-3">
              <p className="font-medium text-gray-700 text-xs">Last Reviewed</p>
            </td>
            {columns.map((col) => (
              <td key={col.institution.id} className="px-4 py-3 text-center text-xs text-gray-500">
                {col.record?.last_reviewed_at
                  ? formatDate(col.record.last_reviewed_at)
                  : "-"}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
