import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Scale, ShieldCheck } from "lucide-react";
import { FeeCourseCompareMatrix } from "@/components/public/FeeCourseCompareMatrix";
import { getMockFeeDetail } from "@/lib/mock/fee-detail";

export const metadata: Metadata = {
  title: "Compare school costs",
  description:
    "Compare the cost of the same course at up to three Nigerian tertiary institutions, including first-year fees, hostel, payment options, and data sources.",
};

export default function ComparePage() {
  const record = getMockFeeDetail("unilag-cs-100");

  if (!record) return null;

  return (
    <main className="bg-brand-lime-light px-4 pb-16 pt-28 sm:px-10 sm:pb-20 sm:pt-32 lg:px-20">
      <div className="mx-auto max-w-[1280px]">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-brand-ink/50">
            School cost comparison
          </p>
          <h1 className="mt-3 text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.05em] text-brand-ink sm:text-5xl lg:text-[60px]">
            Compare school costs, clearly.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-[1.55] tracking-[-0.02em] text-brand-ink/75 sm:text-lg">
            See what you are likely to pay at up to three schools before you
            make a decision. We put the important costs side by side, in plain
            language.
          </p>
        </div>

        <section className="mt-8 grid gap-3 sm:grid-cols-3" aria-label="How to read this comparison">
          <CompareExplainer
            icon={<Scale className="size-4" aria-hidden />}
            title="A fair comparison"
            description={`${record.course} · ${record.defaultLevel} · ${record.session}`}
          />
          <CompareExplainer
            icon={<CheckCircle2 className="size-4" aria-hidden />}
            title="What is included"
            description="First year, later years, hostel, and total programme cost"
          />
          <CompareExplainer
            icon={<ShieldCheck className="size-4" aria-hidden />}
            title="How current it is"
            description="Every figure shows its source and most recent review"
          />
        </section>

        <section className="mt-8">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-brand-ink sm:text-3xl">
                What will I pay?
              </h2>
              <p className="mt-1 text-sm leading-5 text-brand-ink/65 sm:text-base">
                The lowest amount is highlighted. Hostel is optional and shown
                separately, so you can see the full picture.
              </p>
            </div>
            <p className="text-sm font-medium text-brand-ink/55">
              Choose up to 3 schools
            </p>
          </div>

          <FeeCourseCompareMatrix record={record} level={record.defaultLevel} />
        </section>

        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-[#e5ebe5] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-semibold tracking-[-0.02em] text-brand-ink">
              Looking for another school?
            </p>
            <p className="mt-1 text-sm text-brand-ink/65">
              Browse the directory and add a school to your comparison list.
            </p>
          </div>
          <Link
            href="/schools"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[12px] bg-brand-ink px-4 text-sm font-medium text-white transition-colors hover:bg-brand-ink/90"
          >
            Find a school
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </main>
  );
}

function CompareExplainer({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e5ebe5] bg-white p-4">
      <div className="flex size-8 items-center justify-center rounded-full bg-brand-lime text-brand-ink">
        {icon}
      </div>
      <p className="mt-3 text-sm font-semibold tracking-[-0.02em] text-brand-ink">
        {title}
      </p>
      <p className="mt-1 text-sm leading-5 text-brand-ink/65">{description}</p>
    </div>
  );
}
