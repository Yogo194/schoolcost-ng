"use client";

import { useEffect, useState } from "react";
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

/**
 * Info affordance for the "Source type" row.
 *
 * Opens on click as a fixed overlay rather than a hover tooltip: this sits
 * inside a table wrapped in overflow-x-auto, and an absolutely positioned panel
 * there would both extend the scrollable area and get clipped on open.
 */
export function SourceTypeInfo({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        aria-label="What do the source types mean?"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        className={cn(
          "inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-brand-ink/15 bg-white text-brand-ink/60 shadow-[0_1px_3px_rgba(0,44,21,0.06)] transition hover:border-brand-ink/25 hover:text-brand-ink focus:outline-none focus:ring-2 focus:ring-[#f2ac5b]/45",
          className
        )}
      >
        <Info className="size-3.5" aria-hidden />
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close source type explanation"
            className="absolute inset-0 bg-brand-ink/30"
            onClick={() => setIsOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Where the figure comes from"
            className={cn(
              // Bottom sheet on mobile, centred card on desktop.
              "absolute inset-x-0 bottom-0 rounded-t-[20px] bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-4 text-left shadow-[0_-12px_30px_rgba(0,44,21,0.16)]",
              "sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[420px] sm:max-w-[calc(100vw-2rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:p-5 sm:shadow-[0_16px_40px_rgba(0,44,21,0.18)]"
            )}
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <span className="block text-base font-medium tracking-[-0.02em] text-brand-ink">
                Where the figure comes from
              </span>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setIsOpen(false)}
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-brand-ink/10 text-brand-ink/65 transition hover:border-brand-ink/25 hover:text-brand-ink"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <ul className="space-y-3">
              {TIERS.map((tier) => (
                <li key={tier.sourceType} className="flex items-start gap-2.5">
                  <SourceBadge
                    sourceType={tier.sourceType}
                    compact
                    className="shrink-0"
                  />
                  <span className="text-sm leading-5 text-brand-ink/70">
                    {tier.meaning}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
