import { cn } from "@/lib/utils";
import type { FeeItem } from "@/types/fee";
import { FEE_CATEGORY_LABELS, FEE_FREQUENCY_LABELS } from "@/types/fee";
import { formatCurrency } from "@/lib/utils/format";

interface FeeBreakdownTableProps {
  items: FeeItem[];
  currency?: string;
  showTotals?: boolean;
  compulsoryTotal?: number;
  optionalTotal?: number;
  accommodationTotal?: number;
}

export function FeeBreakdownTable({
  items,
  currency = "NGN",
  showTotals = true,
  compulsoryTotal,
  optionalTotal,
  accommodationTotal,
}: FeeBreakdownTableProps) {
  const compulsoryItems = items.filter(
    (i) => i.is_compulsory && i.category !== "accommodation"
  );
  const optionalItems = items.filter(
    (i) => !i.is_compulsory && i.category !== "accommodation"
  );
  const accommodationItems = items.filter((i) => i.category === "accommodation");

  return (
    <div className="space-y-6">
      {compulsoryItems.length > 0 && (
        <FeeSection
          title="Compulsory Fees"
          items={compulsoryItems}
          currency={currency}
          total={compulsoryTotal}
          totalLabel="Compulsory Total"
          highlight
        />
      )}

      {accommodationItems.length > 0 && (
        <FeeSection
          title="Accommodation"
          items={accommodationItems}
          currency={currency}
          total={accommodationTotal}
          totalLabel="Accommodation Total"
        />
      )}

      {optionalItems.length > 0 && (
        <FeeSection
          title="Optional Fees"
          items={optionalItems}
          currency={currency}
          total={optionalTotal}
          totalLabel="Optional Total"
        />
      )}
    </div>
  );
}

interface FeeSectionProps {
  title: string;
  items: FeeItem[];
  currency: string;
  total?: number;
  totalLabel?: string;
  highlight?: boolean;
}

function FeeSection({
  title,
  items,
  currency,
  total,
  totalLabel,
  highlight,
}: FeeSectionProps) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        {title}
      </h4>

      {/* Mobile: card layout */}
      <div className="sm:hidden space-y-2">
        {items.map((item) => (
          <div key={item.id} className="border border-gray-100 rounded-lg p-3 bg-white">
            <div className="flex justify-between items-start gap-2">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {FEE_CATEGORY_LABELS[item.category]} ·{" "}
                  {FEE_FREQUENCY_LABELS[item.frequency]}
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-900 shrink-0">
                {formatCurrency(item.amount, currency)}
              </p>
            </div>
          </div>
        ))}
        {total !== undefined && (
          <div
            className={cn(
              "flex justify-between items-center p-3 rounded-lg font-semibold text-sm",
              highlight ? "bg-primary/5 border border-primary/20" : "bg-gray-50"
            )}
          >
            <span>{totalLabel}</span>
            <span className={highlight ? "text-primary" : "text-gray-900"}>
              {formatCurrency(total, currency)}
            </span>
          </div>
        )}
      </div>

      {/* Desktop: table layout */}
      <div className="hidden sm:block border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 w-full">
                Fee
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 whitespace-nowrap">
                Type
              </th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-gray-500 whitespace-nowrap">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr
                key={item.id}
                className={cn(
                  "border-b border-gray-100 last:border-0",
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                )}
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  {item.description && (
                    <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                  {FEE_FREQUENCY_LABELS[item.frequency]}
                </td>
                <td className="px-4 py-3 text-right font-medium text-gray-900 whitespace-nowrap">
                  {formatCurrency(item.amount, currency)}
                </td>
              </tr>
            ))}
          </tbody>
          {total !== undefined && (
            <tfoot>
              <tr
                className={cn(
                  "border-t border-gray-200",
                  highlight ? "bg-primary/5" : "bg-gray-50"
                )}
              >
                <td colSpan={2} className="px-4 py-3 font-semibold text-sm">
                  {totalLabel}
                </td>
                <td
                  className={cn(
                    "px-4 py-3 text-right font-semibold text-sm",
                    highlight ? "text-primary" : "text-gray-900"
                  )}
                >
                  {formatCurrency(total, currency)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
