import type { ConfidenceLevel } from "@/types/database";
import {
  CONFIDENCE_LEVEL_LABELS,
  CONFIDENCE_LEVEL_SUMMARIES,
} from "@/types/fee";
import { cn } from "@/lib/utils";

const FILLED_BARS: Record<ConfidenceLevel, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

const SHORT_LABEL: Record<ConfidenceLevel, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

interface ConfidenceDisplayProps {
  level: ConfidenceLevel;
  /** Table cells: bars + short label + one-line meaning. */
  compact?: boolean;
  className?: string;
  align?: "left" | "center";
}

export function ConfidenceDisplay({
  level,
  compact = false,
  className,
  align = "left",
}: ConfidenceDisplayProps) {
  const filled = FILLED_BARS[level];

  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <span className="inline-flex items-center gap-2">
        <span
          className="flex items-center gap-1"
          aria-hidden
          title={`${CONFIDENCE_LEVEL_LABELS[level]}: ${CONFIDENCE_LEVEL_SUMMARIES[level]}`}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                "h-2 w-4 rounded-full",
                i < filled
                  ? level === "high"
                    ? "bg-primary"
                    : level === "medium"
                      ? "bg-[#f2ac5b]"
                      : "bg-brand-ink/35"
                  : "bg-brand-ink/10"
              )}
            />
          ))}
        </span>
        <span className="text-base font-semibold tracking-[-0.25px] text-[#355955]">
          {SHORT_LABEL[level]}
        </span>
      </span>
      <p
        className={cn(
          "tracking-[-0.02em] text-brand-ink/65",
          compact ? "text-sm leading-[1.35]" : "text-base leading-[1.4]"
        )}
      >
        {CONFIDENCE_LEVEL_SUMMARIES[level]}
      </p>
      <span className="sr-only">
        {CONFIDENCE_LEVEL_LABELS[level]}. {CONFIDENCE_LEVEL_SUMMARIES[level]}
      </span>
    </div>
  );
}

export function parseConfidenceLevel(
  value: string | ConfidenceLevel
): ConfidenceLevel {
  const normalized = value.trim().toLowerCase();
  if (normalized === "high" || normalized.startsWith("high")) return "high";
  if (normalized === "medium" || normalized.startsWith("medium")) return "medium";
  return "low";
}
