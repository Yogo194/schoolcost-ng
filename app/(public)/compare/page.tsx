import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Scale,
} from "lucide-react";
import { FeeCourseCompareMatrix } from "@/components/public/FeeCourseCompareMatrix";
import { LogoMarquee } from "@/components/public/LogoMarquee";
import { getMockFeeDetail } from "@/lib/mock/fee-detail";

const UNIVERSITY_LOGOS = [
  {
    src: "/figma/logo-babcock.png",
    alt: "Babcock University",
    width: 290,
    height: 109,
    displayHeight: 36,
  },
  {
    src: "/figma/logo-covenant.png",
    alt: "Covenant University",
    width: 282,
    height: 88,
    displayHeight: 32,
  },
  {
    src: "/figma/logo-abuad.png",
    alt: "Afe Babalola University",
    width: 572,
    height: 111,
    displayHeight: 32,
  },
] as const;

export const metadata: Metadata = {
  title: "Compare school costs",
  description:
    "Compare the cost of the same course at up to three Nigerian tertiary institutions, including first-year fees, hostel, payment options, and data sources.",
};

export default function ComparePage() {
  const record = getMockFeeDetail("unilag-cs-100");

  if (!record) return null;

  return (
    <main className="bg-brand-lime-light">
      <section className="relative isolate min-h-[670px] overflow-hidden bg-white sm:h-[672px] sm:min-h-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/how-it-works/hero-bg.jpg"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
          aria-hidden
        />

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-12 pt-36 sm:px-10 sm:pt-[215px] lg:px-20">
          <div className="max-w-[649px]">
            <div>
              <span className="inline-flex h-8 items-center justify-center rounded-lg border border-brand-amber bg-white px-3 text-sm font-medium tracking-[-0.02em] text-brand-ink sm:text-base">
                School cost comparison
              </span>
              <h1 className="mt-[18px] max-w-[620px] text-[2.65rem] font-medium leading-[1.02] tracking-[-0.05em] text-brand-ink sm:text-5xl lg:text-[60px]">
                Compare school costs, clearly.
              </h1>
              <p className="mt-[14px] max-w-[633px] text-base leading-[1.4] tracking-[-0.02em] text-brand-ink/80 sm:text-lg">
                See what you are likely to pay at up to three schools before you
                make a decision. We put the important costs side by side, in plain
                language.
              </p>
            </div>

            <div className="mt-10">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.04em] text-brand-ink sm:text-[15px]">
                Verified fee data from schools across Nigeria
              </p>
              <LogoMarquee logos={UNIVERSITY_LOGOS} fadeFrom="#ffffff" />
            </div>
          </div>
        </div>
      </section>

      <section
        className="bg-[#1d1d1d] px-5 py-10 sm:px-10 sm:py-[50px] lg:px-20"
        aria-label="How to read this comparison"
      >
        <div className="mx-auto grid max-w-[1280px] gap-12 sm:grid-cols-3 sm:gap-10">
          <CompareExplainer
            icon={<Scale className="size-6" aria-hidden />}
            title="A fair comparison"
            description={`${record.course} · ${record.defaultLevel} · ${record.session}`}
          />
          <CompareExplainer
            icon={
              <span className="text-[24px] font-medium leading-none" aria-hidden>
                ₦
              </span>
            }
            title="What is included"
            description="First year, later years, hostel, and total programme cost"
          />
          <CompareExplainer
            icon={<CheckCircle2 className="size-6" aria-hidden />}
            title="How current it is"
            description="Every figure shows its source and most recent review"
          />
        </div>
      </section>

      <section className="px-4 py-16 sm:px-10 sm:py-20 lg:px-20">
        <div className="mx-auto max-w-[1280px]">
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

          <FeeCourseCompareMatrix
            record={record}
            level={record.defaultLevel}
            startEmpty
          />

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
      </section>
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
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="flex size-[50px] shrink-0 items-center justify-center rounded-full bg-[#9ff52f] text-[#002c15] shadow-[0_3px_0_rgba(159,245,47,0.55)]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xl font-medium leading-8 tracking-[-0.04em] text-white sm:text-2xl">
          {title}
        </p>
        <p className="mt-3 max-w-[360px] text-base leading-7 tracking-[-0.015em] text-white/50 sm:text-lg">
          {description}
        </p>
      </div>
    </div>
  );
}
