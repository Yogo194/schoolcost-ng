import { BookOpen, CreditCard, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

interface SchoolStatsBarProps {
  coursesListed: number;
  firstYearMin: number;
  firstYearMax: number;
  paymentOptions: string[];
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

export function SchoolStatsBar({
  coursesListed,
  firstYearMin,
  firstYearMax,
  paymentOptions,
}: SchoolStatsBarProps) {
  const hasRange = firstYearMin > 0 && firstYearMax > 0;
  const hasPayment = paymentOptions.length > 0;

  return (
    <section className="relative z-20 -mt-8 px-4 pb-2 sm:-mt-10 sm:px-10 lg:px-20">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {/* Courses */}
        <article
          className={cn(
            "group animate-hero-rise rounded-2xl border border-[#e5ebe5] bg-white p-5 shadow-[0_12px_40px_rgba(3,48,42,0.08)]",
            "transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(3,48,42,0.12)]",
            "motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-brand-ink/45">
                Coverage
              </p>
              <p className="mt-3 text-[40px] font-medium leading-none tracking-[-0.04em] text-brand-ink tabular-nums">
                {coursesListed}
              </p>
              <p className="mt-2 text-sm tracking-[-0.02em] text-brand-ink/70">
                Courses with verified fees
              </p>
            </div>
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-lime text-brand-ink transition-transform duration-300 group-hover:scale-105">
              <BookOpen className="size-5" aria-hidden />
            </span>
          </div>
        </article>

        {/* Fee range */}
        <article
          className={cn(
            "group animate-hero-rise rounded-2xl border border-[#e5ebe5] bg-white p-5 shadow-[0_12px_40px_rgba(3,48,42,0.08)] [animation-delay:80ms]",
            "transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(3,48,42,0.12)]",
            "motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-brand-ink/45">
                First-year · 100L
              </p>
              {hasRange ? (
                <>
                  <div className="mt-3 flex items-baseline gap-2">
                    <p className="text-[28px] font-medium leading-none tracking-[-0.04em] text-brand-ink tabular-nums sm:text-[32px]">
                      {compactNaira(firstYearMin)}
                    </p>
                    <span className="text-brand-ink/35" aria-hidden>
                      to
                    </span>
                    <p className="text-[28px] font-medium leading-none tracking-[-0.04em] text-brand-ink tabular-nums sm:text-[32px]">
                      {compactNaira(firstYearMax)}
                    </p>
                  </div>
                  <p className="mt-2 text-sm tracking-[-0.02em] text-brand-ink/70">
                    Compulsory fee range across courses
                  </p>
                  <div className="mt-4">
                    <div className="relative h-2 overflow-hidden rounded-full bg-brand-ink/[0.06]">
                      <div className="absolute inset-y-0 left-[8%] right-[8%] rounded-full bg-gradient-to-r from-brand-lime via-[#c8e85a] to-brand-amber" />
                    </div>
                    <div className="mt-1.5 flex justify-between text-[11px] tracking-[-0.02em] text-brand-ink/45">
                      <span>Lowest</span>
                      <span>Highest</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="mt-3 text-lg font-medium text-brand-ink/60">
                  Fees pending
                </p>
              )}
            </div>
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#fcffe7] text-brand-ink transition-transform duration-300 group-hover:scale-105">
              <Wallet className="size-5" aria-hidden />
            </span>
          </div>
        </article>

        {/* Payment */}
        <article
          className={cn(
            "group animate-hero-rise rounded-2xl border border-[#e5ebe5] bg-white p-5 shadow-[0_12px_40px_rgba(3,48,42,0.08)] [animation-delay:160ms]",
            "transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(3,48,42,0.12)]",
            "motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-brand-ink/45">
                How you pay
              </p>
              {hasPayment ? (
                <>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {paymentOptions.map((option) => (
                      <span
                        key={option}
                        className="inline-flex items-center rounded-full border border-[#e5ebe5] bg-brand-lime-light px-3 py-1.5 text-sm font-medium tracking-[-0.02em] text-brand-ink"
                      >
                        {option}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-sm tracking-[-0.02em] text-brand-ink/70">
                    Flexible payment options available
                  </p>
                </>
              ) : (
                <p className="mt-3 text-lg font-medium text-brand-ink/60">
                  Details pending
                </p>
              )}
            </div>
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition-transform duration-300 group-hover:scale-105">
              <CreditCard className="size-5" aria-hidden />
            </span>
          </div>
        </article>
      </div>
    </section>
  );
}
