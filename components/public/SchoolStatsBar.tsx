import { BookOpen, CalendarDays, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

interface SchoolStatsBarProps {
  coursesListed: number;
  firstYearMin: number;
  firstYearMax: number;
  coverageLabel?: string;
  rangeEyebrow?: string;
  rangeDescription?: string;
  showRangeExtremes?: boolean;
  sessionLabel?: string;
  sessionDescription?: string;
}

function compactNaira(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    return `₦${Number.isInteger(millions) ? millions : millions.toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `₦${Math.round(amount / 1_000)}k`;
  }
  return formatCurrency(amount);
}

const cardClass =
  "relative h-full animate-hero-rise rounded-2xl border border-[#e5ebe5] bg-white p-5 pr-[4.25rem] shadow-[0_12px_40px_rgba(3,48,42,0.08)] motion-reduce:animate-none";

const iconClass =
  "absolute right-5 top-5 flex size-11 shrink-0 items-center justify-center rounded-xl";

export function SchoolStatsBar({
  coursesListed,
  firstYearMin,
  firstYearMax,
  // Neutral defaults: never claim "verified" unless a caller passes it.
  coverageLabel = "Courses listed",
  rangeEyebrow = "First-year · 100L",
  rangeDescription = "Compulsory fee range across courses",
  showRangeExtremes = true,
  sessionLabel,
  sessionDescription = "Latest listed session",
}: SchoolStatsBarProps) {
  const hasRange = firstYearMin > 0 && firstYearMax > 0;
  const hasSession = Boolean(sessionLabel);

  return (
    <section className="relative z-20 bg-brand-lime-light px-4 pb-2 pt-6 sm:px-10 sm:pt-0 lg:px-20">
      {/* Desktop: reserve the cream half while cards are absolutely centered on the seam */}
      <div className="mx-auto hidden h-20 max-w-[1240px] sm:block" aria-hidden />
      <div
        className={cn(
          "mx-auto grid max-w-[1240px] grid-cols-1 items-stretch gap-3 sm:grid-cols-3 sm:gap-4",
          "mt-0",
          // Desktop: pin to the lime | cream seam, then shift up by exactly half the row height
          "sm:absolute sm:left-0 sm:right-0 sm:top-0 sm:mt-0 sm:w-full sm:max-w-[1240px] sm:px-10 sm:-translate-y-1/2 lg:px-20"
        )}
      >
        {/* Fee range (primary) */}
        <article className={cn(cardClass)}>
          <span
            className={cn(iconClass, "bg-[#fcffe7] text-brand-ink")}
          >
            <Wallet className="size-5" aria-hidden />
          </span>
          <p className="max-w-[calc(100%-3.5rem)] text-xs font-medium uppercase tracking-[0.06em] text-brand-ink/45 sm:max-w-none sm:tracking-[0.08em]">
            {rangeEyebrow}
          </p>
          {hasRange ? (
            <>
              <div className="mt-3 flex items-baseline gap-x-2 whitespace-nowrap">
                <p className="text-[28px] font-medium leading-none tracking-[-0.04em] text-brand-ink tabular-nums sm:text-[32px]">
                  <span className="sr-only">
                    {showRangeExtremes ? "Lowest " : "Reported low "}
                  </span>
                  {compactNaira(firstYearMin)}
                </p>
                <span className="text-brand-ink/35" aria-hidden>
                  to
                </span>
                <p className="text-[28px] font-medium leading-none tracking-[-0.04em] text-brand-ink tabular-nums sm:text-[32px]">
                  <span className="sr-only">
                    {showRangeExtremes ? "Highest " : "Reported high "}
                  </span>
                  {compactNaira(firstYearMax)}
                </p>
              </div>
              <p className="mt-2 text-sm tracking-[-0.02em] text-brand-ink/70">
                {rangeDescription}
              </p>
            </>
          ) : (
            <>
              <p className="mt-3 text-lg font-medium tracking-[-0.02em] text-brand-ink/70">
                Not published yet
              </p>
              <p className="mt-2 text-sm tracking-[-0.02em] text-brand-ink/55">
                Waiting on an official schedule we can verify
              </p>
            </>
          )}
        </article>

        {/* Coverage */}
        <article className={cn(cardClass, "[animation-delay:80ms]")}>
          <span className={cn(iconClass, "bg-brand-lime text-brand-ink")}>
            <BookOpen className="size-5" aria-hidden />
          </span>
          <p className="max-w-[calc(100%-3.5rem)] text-xs font-medium uppercase tracking-[0.06em] text-brand-ink/45 sm:max-w-none sm:tracking-[0.08em]">
            Coverage
          </p>
          <p className="mt-3 text-[40px] font-medium leading-none tracking-[-0.04em] text-brand-ink tabular-nums">
            {coursesListed}
          </p>
          <p className="mt-2 text-sm tracking-[-0.02em] text-brand-ink/70">
            {coverageLabel}
          </p>
        </article>

        {/* Session */}
        <article className={cn(cardClass, "[animation-delay:160ms]")}>
          <span className={cn(iconClass, "bg-emerald-50 text-emerald-700")}>
            <CalendarDays className="size-5" aria-hidden />
          </span>
          <p className="max-w-[calc(100%-3.5rem)] text-xs font-medium uppercase tracking-[0.06em] text-brand-ink/45 sm:max-w-none sm:tracking-[0.08em]">
            Session
          </p>
          {hasSession ? (
            <>
              <p className="mt-3 text-[28px] font-medium leading-none tracking-[-0.04em] text-brand-ink tabular-nums sm:text-[32px]">
                {sessionLabel}
              </p>
              <p className="mt-2 text-sm tracking-[-0.02em] text-brand-ink/70">
                {sessionDescription}
              </p>
            </>
          ) : (
            <>
              <p className="mt-3 text-lg font-medium tracking-[-0.02em] text-brand-ink/70">
                Pending
              </p>
              <p className="mt-2 text-sm tracking-[-0.02em] text-brand-ink/55">
                No verified session listed yet
              </p>
            </>
          )}
        </article>
      </div>
    </section>
  );
}
