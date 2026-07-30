import { cn } from "@/lib/utils";
import type { SourceType, VerificationStatus, ConfidenceLevel } from "@/types/database";
import { SOURCE_TYPE_LABELS, VERIFICATION_STATUS_LABELS, CONFIDENCE_LEVEL_LABELS } from "@/types/fee";

const SOURCE_BADGE_STYLES: Record<SourceType, string> = {
  official_school_source: "bg-emerald-50 text-emerald-700 border-emerald-200",
  official_fee_circular: "bg-emerald-50 text-emerald-700 border-emerald-200",
  school_representative: "bg-emerald-50 text-emerald-700 border-emerald-200",
  student_portal_evidence: "bg-blue-50 text-blue-700 border-blue-200",
  payment_invoice: "bg-blue-50 text-blue-700 border-blue-200",
  community_reported: "bg-amber-50 text-amber-700 border-amber-200",
};

/**
 * Compact table badges. One word so the pill has a fixed width that fits any
 * column: the colour carries the tier and SourceTypeInfo explains it behind an
 * info tooltip. The longer phrase is kept in SOURCE_FULL_LABELS for the badge
 * tooltip and for screen readers, so nothing is lost.
 */
const SOURCE_COMPACT_LABELS: Record<SourceType, string> = {
  official_school_source: "Official",
  official_fee_circular: "Official",
  school_representative: "Official",
  student_portal_evidence: "Student",
  payment_invoice: "Student",
  community_reported: "Community",
};

/** Full phrase, exposed via title and sr-only. */
const SOURCE_FULL_LABELS: Record<SourceType, string> = {
  official_school_source: "Official source",
  official_fee_circular: "Official source",
  school_representative: "Official source",
  student_portal_evidence: "Student evidence",
  payment_invoice: "Student evidence",
  community_reported: "Community reported",
};

const SOURCE_COMPACT_STYLES: Record<SourceType, string> = {
  official_school_source: "border-transparent bg-[#d9f9e6] text-[#2f9461]",
  official_fee_circular: "border-transparent bg-[#d9f9e6] text-[#2f9461]",
  school_representative: "border-transparent bg-[#d9f9e6] text-[#2f9461]",
  student_portal_evidence: "border-transparent bg-[#f6f7f9] text-[#24292e]",
  payment_invoice: "border-transparent bg-[#f6f7f9] text-[#24292e]",
  community_reported: "border-transparent bg-[#fbf2cb] text-[#c8811a]",
};

const VERIFICATION_BADGE_STYLES: Record<VerificationStatus, string> = {
  officially_verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
  community_verified: "bg-blue-50 text-blue-700 border-blue-200",
  reported: "bg-amber-50 text-amber-700 border-amber-200",
  outdated: "bg-gray-100 text-gray-500 border-gray-200",
  disputed: "bg-red-50 text-red-700 border-red-200",
};

const CONFIDENCE_BADGE_STYLES: Record<ConfidenceLevel, string> = {
  high: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-gray-100 text-gray-500 border-gray-200",
};

interface SourceBadgeProps {
  sourceType: SourceType;
  className?: string;
  /** Figma homepage pills: shorter labels + rounded-full. */
  compact?: boolean;
}

export function SourceBadge({ sourceType, className, compact = false }: SourceBadgeProps) {
  if (compact) {
    return (
      <span
        title={SOURCE_FULL_LABELS[sourceType]}
        className={cn(
          // min-w keeps pills aligned down a column; max-w-full lets it shrink
          // rather than overflow the cell. No whitespace-nowrap, so if a label
          // ever grows it wraps instead of being clipped by the next column.
          "inline-flex min-w-[88px] max-w-full items-center justify-center rounded-full border px-2 py-[3px] text-center text-sm font-medium",
          SOURCE_COMPACT_STYLES[sourceType],
          className
        )}
      >
        <span aria-hidden>{SOURCE_COMPACT_LABELS[sourceType]}</span>
        <span className="sr-only">{SOURCE_FULL_LABELS[sourceType]}</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
        SOURCE_BADGE_STYLES[sourceType],
        className
      )}
    >
      {SOURCE_TYPE_LABELS[sourceType]}
    </span>
  );
}

interface VerificationBadgeProps {
  status: VerificationStatus;
  className?: string;
}

export function VerificationBadge({ status, className }: VerificationBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
        VERIFICATION_BADGE_STYLES[status],
        className
      )}
    >
      {VERIFICATION_STATUS_LABELS[status]}
    </span>
  );
}

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  className?: string;
}

export function ConfidenceBadge({ level, className }: ConfidenceBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
        CONFIDENCE_BADGE_STYLES[level],
        className
      )}
    >
      {CONFIDENCE_LEVEL_LABELS[level]}
    </span>
  );
}
