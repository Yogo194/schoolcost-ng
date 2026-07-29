import type { FeeRecord } from "@/types/fee";
import { formatCurrency } from "@/lib/utils/format";
import { VerificationBadge } from "./SourceBadge";
import { InfoPrompt } from "@/components/public/InfoPrompt";

interface FeeSummaryCardProps {
  record: Pick<
    FeeRecord,
    | "first_year_total"
    | "returning_year_total"
    | "estimated_degree_total"
    | "accommodation_total"
    | "optional_total"
    | "currency"
    | "student_type"
    | "verification_status"
  >;
}

export function FeeSummaryCard({ record }: FeeSummaryCardProps) {
  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
      {/* Primary figure */}
      <div className="p-6 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          {record.student_type === "fresh" ? "First Year Total" : "Per Year Total"}
        </p>
        <p className="text-4xl font-bold text-gray-900 tabular-nums">
          {formatCurrency(
            record.student_type === "fresh"
              ? record.first_year_total
              : record.returning_year_total,
            record.currency
          )}
        </p>
        <div className="mt-2">
          <VerificationBadge status={record.verification_status} />
        </div>
      </div>

      {/* Secondary figures */}
      <div className="divide-y divide-gray-100">
        {record.student_type === "fresh" && (
          <SummaryRow
            label="Returning Year"
            value={formatCurrency(record.returning_year_total, record.currency)}
          />
        )}
        {record.accommodation_total > 0 && (
          <SummaryRow
            label="Accommodation"
            value={formatCurrency(record.accommodation_total, record.currency)}
            note="Separate"
          />
        )}
        {record.optional_total > 0 && (
          <SummaryRow
            label="Optional Fees"
            value={formatCurrency(record.optional_total, record.currency)}
            note="If applicable"
          />
        )}
        <SummaryRow
          label="Estimated Degree Total"
          value={formatCurrency(record.estimated_degree_total, record.currency)}
          note="Estimate"
          highlight
        />
      </div>

      {/* Disclaimer */}
      <div className="p-4">
        <InfoPrompt
          title="Degree total is an estimate"
          description="Based on current fees. Actual costs may vary by session."
        />
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  note,
  highlight,
}: {
  label: string;
  value: string;
  note?: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-3">
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        {note && <p className="text-xs text-gray-400">{note}</p>}
      </div>
      <p
        className={`text-sm font-semibold tabular-nums ${
          highlight ? "text-primary" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
