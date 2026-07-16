import { ExternalLink, FileText, ShieldCheck, Users } from "lucide-react";
import type { VerificationStatus } from "@/types/database";
import type { FeeDetailRecord } from "@/lib/mock/fee-detail";
import { CompareButton } from "@/components/public/CompareButton";
import { ConfidenceDisplay } from "@/components/public/ConfidenceDisplay";
import { SourceBadge } from "@/components/public/SourceBadge";
import { cn } from "@/lib/utils";

const VERIFICATION_COPY: Record<
  VerificationStatus,
  { heading: string; subtitle: string; banner: string; icon: string }
> = {
  officially_verified: {
    heading: "Officially verified",
    subtitle: "Confirmed against an official school source.",
    banner: "bg-emerald-50",
    icon: "bg-primary text-white",
  },
  community_verified: {
    heading: "Community verified",
    subtitle: "Confirmed by multiple students who paid this fee.",
    banner: "bg-blue-50",
    icon: "bg-blue-600 text-white",
  },
  reported: {
    heading: "Reported",
    subtitle: "Submitted by a student or contributor, pending review.",
    banner: "bg-amber-50",
    icon: "bg-amber-500 text-white",
  },
  outdated: {
    heading: "Possibly outdated",
    subtitle: "Due for review. Amounts may have changed since.",
    banner: "bg-gray-100",
    icon: "bg-gray-500 text-white",
  },
  disputed: {
    heading: "Disputed",
    subtitle: "Contributors have reported conflicting figures.",
    banner: "bg-red-50",
    icon: "bg-red-600 text-white",
  },
};

interface VerificationPanelProps {
  record: FeeDetailRecord;
  levelLabel: string;
  className?: string;
}

export function VerificationPanel({
  record,
  levelLabel,
  className,
}: VerificationPanelProps) {
  const copy = VERIFICATION_COPY[record.verification_status];

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="overflow-hidden rounded-2xl border border-[#e5ebe5] bg-white">
        <div className={cn("flex items-start gap-3 p-5", copy.banner)}>
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg",
              copy.icon
            )}
          >
            <ShieldCheck className="size-5" aria-hidden />
          </span>
          <div>
            <p className="text-lg font-medium leading-[1.2] tracking-[-0.03em] text-brand-ink">
              {copy.heading}
            </p>
            <p className="mt-0.5 text-sm leading-[1.4] tracking-[-0.02em] text-brand-ink/70">
              {copy.subtitle}
            </p>
          </div>
        </div>

        <dl className="px-5">
          <PanelRow label="Data confidence">
            <ConfidenceDisplay level={record.confidence_level} compact />
          </PanelRow>
          <PanelRow label="Level">{levelLabel}</PanelRow>
          <PanelRow label="Academic session">{record.session}</PanelRow>
          <PanelRow label="Last reviewed">{record.lastReviewedLabel}</PanelRow>
          <PanelRow label="Source type" last>
            <SourceBadge sourceType={record.source_type} compact />
          </PanelRow>
        </dl>

        {(record.evidence || record.reviewerNote) && (
          <div className="flex flex-col gap-3 px-5 pb-5">
            {record.evidence && (
              <a
                href={record.evidence.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl border border-[#e5ebe5] p-3 transition-colors hover:border-primary/30"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-brand-ink/60">
                  <FileText className="size-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-brand-ink">
                    {record.evidence.title}
                  </span>
                  <span className="block truncate text-xs text-brand-ink/60">
                    {record.evidence.typeLabel}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary">
                  View
                  <ExternalLink className="size-3.5" aria-hidden />
                </span>
              </a>
            )}

            {record.reviewerNote && (
              <p className="rounded-xl bg-gray-50 p-3 text-sm leading-[1.5] text-brand-ink/70">
                <span className="font-semibold text-brand-ink">
                  Reviewer note:
                </span>{" "}
                {record.reviewerNote}
              </p>
            )}

            {!!record.confirmationsCount && (
              <p className="flex items-center gap-2 text-sm text-brand-ink/70">
                <Users className="size-4 shrink-0" aria-hidden />
                <span>
                  <span className="font-semibold text-brand-ink">
                    {record.confirmationsCount}
                  </span>{" "}
                  student{record.confirmationsCount === 1 ? "" : "s"} confirmed
                  this record
                </span>
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-[#e5ebe5] bg-white p-4">
        <CompareButton
          institutionSlug={record.schoolSlug}
          institutionName={record.schoolName}
          fullWidth
        />
        <div className="flex items-center justify-between gap-3">
          <a
            href={`/submit-correction?record=${record.id}`}
            className="flex h-11 flex-1 items-center justify-center rounded-[12px] border border-[#e5ebe5] text-sm font-medium text-brand-ink transition-colors hover:border-primary/30"
          >
            Submit update
          </a>
          <a
            href={`/submit-correction?record=${record.id}`}
            className="shrink-0 px-2 text-sm font-medium text-red-600 transition-colors hover:text-red-700"
          >
            Report error
          </a>
        </div>
      </div>
    </div>
  );
}

function PanelRow({
  label,
  children,
  last = false,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 py-3 text-sm",
        !last && "border-b border-[#e5ebe5]"
      )}
    >
      <dt className="text-brand-ink/60">{label}</dt>
      <dd className="font-medium text-brand-ink">{children}</dd>
    </div>
  );
}
