import type { Metadata } from "next";
import {
  CheckCircle2,
  Scale,
} from "lucide-react";
import { CompareWorkspace } from "@/components/public/CompareWorkspace";
import { LogoMarquee } from "@/components/public/LogoMarquee";
import { UNIVERSITY_LOGOS } from "@/components/public/university-logos";
import { getCompareOptions } from "@/lib/fees/get-compare-options";

export const metadata: Metadata = {
  title: "Compare school costs",
  description:
    "Compare the cost of the same course at up to three Nigerian tertiary institutions, including first-year fees, hostel, payment options, and data sources.",
};

export default async function ComparePage() {
  const courses = await getCompareOptions();
  return (
    <main className="bg-brand-lime-light">
      {/* Hero + explainer band together fill one screen on desktop. */}
      <div className="lg:flex lg:h-screen lg:flex-col">
        <section className="relative isolate min-h-[670px] overflow-hidden bg-white sm:h-[672px] sm:min-h-0 lg:h-auto lg:min-h-0 lg:flex-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/how-it-works/hero-bg.jpg"
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
            aria-hidden
          />

          <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] flex-col px-5 pb-12 pt-36 sm:px-10 sm:pt-[215px] lg:flex-row lg:items-center lg:gap-10 lg:px-20 lg:pb-16 lg:pt-32">
            <div className="max-w-[649px] lg:flex-1">
              <div>
                <span className="inline-flex h-8 items-center justify-center rounded-lg border border-brand-amber bg-white px-3 text-sm font-medium tracking-[-0.02em] text-brand-ink sm:text-base">
                  School cost comparison
                </span>
                <h1 className="mt-[18px] max-w-[620px] text-[2.65rem] font-medium leading-[1.02] tracking-[-0.05em] text-brand-ink sm:text-5xl lg:text-[60px]">
                  Compare school costs, clearly.
                </h1>
                <p className="mt-[14px] max-w-[633px] text-base leading-[1.4] tracking-[-0.02em] text-brand-ink/80 sm:text-lg">
                  See what you are likely to pay at up to three schools before
                  you make a decision. We put the important costs side by side,
                  in plain language.
                </p>
              </div>

              <div className="mt-10">
                <p className="mb-4 text-xs font-medium uppercase tracking-[0.04em] text-brand-ink sm:text-[15px]">
                  Verified fee data from schools across Nigeria
                </p>
                <LogoMarquee logos={UNIVERSITY_LOGOS} fadeFrom="#ffffff" />
              </div>
            </div>

            <div className="mt-12 hidden lg:mt-0 lg:flex lg:flex-1 lg:items-center lg:justify-end">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/compare-hero-students.webp"
                alt="Three Nigerian students checking verified school fees on a tablet"
                width={1120}
                height={1099}
                className="h-auto w-full max-w-[560px] object-contain"
              />
            </div>
          </div>
        </section>

        <section
          className="bg-[#1d1d1d] px-5 py-9 sm:px-10 lg:shrink-0 lg:px-20 lg:py-8"
          aria-label="How to read this comparison"
        >
          <div className="mx-auto grid max-w-[1280px] gap-10 sm:grid-cols-3 sm:gap-10">
            <CompareExplainer
              icon={<Scale className="size-6" aria-hidden />}
              title="A fair comparison"
              description="Same course · same level · same session"
            />
            <CompareExplainer
              icon={
                <span
                  className="text-[24px] font-medium leading-none"
                  aria-hidden
                >
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
      </div>

      <CompareWorkspace courses={courses} />
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
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex size-[50px] shrink-0 items-center justify-center rounded-full bg-[#9ff52f] text-[#002c15] shadow-[0_3px_0_rgba(159,245,47,0.55)]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xl font-medium leading-8 tracking-[-0.04em] text-white sm:text-2xl">
          {title}
        </p>
        <p className="mt-2 max-w-[360px] text-base leading-7 tracking-[-0.015em] text-white/50 sm:text-lg">
          {description}
        </p>
      </div>
    </div>
  );
}
