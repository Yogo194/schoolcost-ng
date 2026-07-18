"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Keep in sync with the animate-step-progress duration in globals.css. */
const STEP_DURATION_MS = 6000;

const STEPS = [
  {
    number: "01",
    title: "Gather the fees",
    description:
      "Official circulars, school portals, and community submissions with evidence all land in one review queue.",
    image: "/figma/how-it-works/process-composite.png",
  },
  {
    number: "02",
    title: "Verify the evidence",
    description:
      "A person checks the source, matches the academic session, and confirms the breakdown before anything is approved.",
    image: "/figma/how-it-works/process-composite.png",
  },
  {
    number: "03",
    title: "Label & publish",
    description:
      "Every live record gets a source label, verification status, and confidence level so you know how far to trust it.",
    image: "/figma/how-it-works/process-composite.png",
  },
] as const;

export function HowItWorksProcess() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setTimeout(
      () => setActive((current) => (current + 1) % STEPS.length),
      STEP_DURATION_MS
    );
    return () => clearTimeout(timer);
  }, [active]);

  const step = STEPS[active];

  return (
    <section className="relative overflow-hidden bg-brand-footer px-4 py-16 sm:px-10 sm:py-[100px] lg:px-20">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10 sm:gap-12">
        {/* Intro copy on top; step counter sits in the top-right corner, level with the badge */}
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex h-8 w-fit items-center justify-center rounded-lg border border-brand-amber bg-[#111] px-3 text-base font-medium tracking-[-0.02em] text-white">
              The process
            </span>
            <span
              className="flex items-baseline gap-1 text-[1.25rem] font-medium leading-none tracking-[-0.04em] sm:text-[24px]"
              aria-hidden
            >
              <span key={step.number} className="animate-step-fade text-brand-amber">
                {step.number}
              </span>
              <span className="text-sm text-white/40 sm:text-base">/ 03</span>
            </span>
          </div>
          <h2 className="max-w-[560px] text-[1.75rem] font-medium leading-[1.2] tracking-[-0.04em] text-white sm:text-[44px]">
            Three steps, before anything is published
          </h2>
          <p className="max-w-[480px] text-base leading-[1.4] tracking-[-0.02em] text-white/80 sm:text-lg">
            No figure goes live automatically. Community submissions are
            reviewed by a person first.
          </p>
        </div>

        {/* Switcher left, visual right */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <div
            className="relative border-l border-brand-amber/30"
            role="tablist"
            aria-label="Verification process steps"
          >
            {STEPS.map((item, index) => {
              const isActive = index === active;
              return (
                <button
                  key={item.number}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(index)}
                  className="relative w-full px-4 py-5 text-left sm:px-6 sm:py-6"
                >
                  {isActive && (
                    <span
                      key={`progress-${item.number}`}
                      className="animate-step-progress absolute -left-px bottom-0 top-0 w-[3px] rounded-full bg-brand-amber"
                      aria-hidden
                    />
                  )}
                  <span
                    className={cn(
                      "block text-[1.25rem] font-medium leading-none tracking-[-0.04em] transition-colors duration-300 sm:text-[28px]",
                      isActive ? "text-white" : "text-white/40 hover:text-white/60"
                    )}
                  >
                    {item.title}
                  </span>
                  {isActive && (
                    <span className="animate-step-fade mt-3 block max-w-[420px] text-base leading-[1.4] tracking-[-0.02em] text-white/80 sm:text-lg">
                      {item.description}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="relative w-full max-w-[560px] lg:justify-self-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/how-it-works/process-deco.svg"
              alt=""
              width={80}
              height={80}
              className="pointer-events-none absolute -left-3 -top-6 z-10 size-14 sm:-left-5 sm:-top-8 sm:size-20"
              aria-hidden
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={step.image + step.number}
              src={step.image}
              alt="Review queue mockup showing submissions being checked before publish"
              width={630}
              height={420}
              className="animate-step-image-fade h-auto w-full rounded-[14px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
