import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  label: string;
  render: (row: T) => React.ReactNode;
  className?: string;
}

interface AdminTableProps<T extends { id: string }> {
  columns: Column<T>[];
  rows: T[];
  emptyMessage?: string;
}

export function AdminTable<T extends { id: string }>({
  columns,
  rows,
  emptyMessage = "No records found.",
}: AdminTableProps<T>) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "text-left px-4 py-3 text-xs font-medium text-gray-500 whitespace-nowrap",
                    col.className
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors",
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn("px-4 py-3", col.className)}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
