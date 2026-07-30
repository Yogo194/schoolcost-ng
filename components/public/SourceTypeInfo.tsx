"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";
import { SourceBadge } from "@/components/public/SourceBadge";
import { cn } from "@/lib/utils";
import type { SourceType } from "@/types/database";

const TIERS: Array<{ sourceType: SourceType; meaning: string }> = [
  {
    sourceType: "official_school_source",
    meaning: "Published on the school's own site or fee circular.",
  },
  {
    sourceType: "student_portal_evidence",
    meaning: "Taken from a student portal pay advice or payment receipt.",
  },
  {
    sourceType: "community_reported",
    meaning:
      "Reported to us and not yet verified. Excluded from lowest-cost highlights.",
  },
];

function TierList({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <ul className="space-y-3">
      {TIERS.map((tier) => (
        <li key={tier.sourceType} className="flex items-start gap-2.5">
          <SourceBadge sourceType={tier.sourceType} compact className="shrink-0" />
          <span
            className={cn(
              "text-sm leading-5",
              tone === "dark" ? "text-white/85" : "text-brand-ink/70"
            )}
          >
            {tier.meaning}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Info affordance for the "Source type" row. Desktop shows a hover/focus
 * tooltip, mobile opens a bottom sheet, matching the figures tooltip used on
 * the school profile.
 */
export function SourceTypeInfo({ className }: { className?: string }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <span className={cn("group relative inline-flex", className)}>
      <button
        type="button"
        aria-label="What do the source types mean?"
        onClick={() => setIsSheetOpen(true)}
        className="inline-flex size-6 items-center justify-center rounded-full border border-brand-ink/15 bg-white text-brand-ink/60 shadow-[0_1px_3px_rgba(0,44,21,0.06)] transition hover:border-brand-ink/25 hover:text-brand-ink focus:outline-none focus:ring-2 focus:ring-[#f2ac5b]/45"
      >
        <Info className="size-3.5" aria-hidden />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-0 top-9 z-20 hidden w-[340px] rounded-xl bg-brand-ink px-4 py-3.5 text-left opacity-0 shadow-[0_8px_20px_rgba(0,44,21,0.14)] transition group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 sm:block"
      >
        <span className="mb-2.5 block text-sm font-medium text-white">
          Where the figure comes from
        </span>
        <TierList tone="dark" />
      </span>

      {isSheetOpen ? (
        <div className="fixed inset-0 z-50 sm:hidden">
          <button
            type="button"
            aria-label="Close source type explanation"
            className="absolute inset-0 bg-brand-ink/30"
            onClick={() => setIsSheetOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-[20px] bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-4 text-left shadow-[0_-12px_30px_rgba(0,44,21,0.16)]">
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="text-base font-medium tracking-[-0.02em] text-brand-ink">
                Where the figure comes from
              </p>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setIsSheetOpen(false)}
                className="inline-flex size-9 items-center justify-center rounded-full border border-brand-ink/10 text-brand-ink/65"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <TierList tone="light" />
          </div>
        </div>
      ) : null}
    </span>
  );
}
