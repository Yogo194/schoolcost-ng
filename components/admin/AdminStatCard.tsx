import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface AdminStatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  note?: string;
  variant?: "default" | "warning" | "success";
}

export function AdminStatCard({
  label,
  value,
  icon: Icon,
  note,
  variant = "default",
}: AdminStatCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
          <p
            className={cn(
              "text-2xl font-bold tabular-nums",
              variant === "warning" && "text-amber-600",
              variant === "success" && "text-primary",
              variant === "default" && "text-gray-900"
            )}
          >
            {value}
          </p>
          {note && <p className="text-xs text-gray-400 mt-1">{note}</p>}
        </div>
        <div
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center",
            variant === "warning" && "bg-amber-50",
            variant === "success" && "bg-primary/10",
            variant === "default" && "bg-gray-100"
          )}
        >
          <Icon
            className={cn(
              "w-4 h-4",
              variant === "warning" && "text-amber-600",
              variant === "success" && "text-primary",
              variant === "default" && "text-gray-500"
            )}
          />
        </div>
      </div>
    </div>
  );
}
