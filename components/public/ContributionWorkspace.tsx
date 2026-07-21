"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { SubmitFeeForm, type SubmitFeePayload } from "@/components/forms/SubmitFeeForm";
import { SuggestSchoolForm } from "@/components/forms/SuggestSchoolForm";
import { ContributionSuccess } from "@/components/public/ContributionSuccess";
import { cn } from "@/lib/utils";
import type { SuggestSchoolInput } from "@/lib/validations/submission";
import type { Institution } from "@/types/institution";
import type { SubmitCourseOption } from "@/lib/mock/courses";

type ContributionTab = "fee" | "school";

const TABS: { value: ContributionTab; label: string }[] = [
  { value: "fee", label: "Share a fee" },
  { value: "school", label: "Suggest a school" },
];

const SUCCESS_COPY: Record<
  ContributionTab,
  { title: string; description: string; actionLabel: string }
> = {
  fee: {
    title: "Fee information received",
    description:
      "Your fee details are in the review queue. A person will check them before anything is published. If we need to confirm something, we will email you.",
    actionLabel: "Submit another fee",
  },
  school: {
    title: "School suggestion received",
    description:
      "We will add this school if we can verify enough fee data for it. Thanks for helping grow the directory.",
    actionLabel: "Suggest another school",
  },
};

interface ContributionWorkspaceProps {
  institutions: Institution[];
  courses: SubmitCourseOption[];
  onSubmitFee: (data: SubmitFeePayload) => Promise<void>;
  onSuggestSchool: (data: SuggestSchoolInput) => Promise<void>;
  initialTab?: ContributionTab;
}

export function ContributionWorkspace({
  institutions,
  courses,
  onSubmitFee,
  onSuggestSchool,
  initialTab = "fee",
}: ContributionWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<ContributionTab>(initialTab);
  const [successTab, setSuccessTab] = useState<ContributionTab | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef(new Map<ContributionTab, HTMLButtonElement>());
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });

  const measure = useCallback(() => {
    const button = buttonRefs.current.get(activeTab);
    if (!button) return;
    setPill({ left: button.offsetLeft, width: button.offsetWidth, ready: true });
  }, [activeTab]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [measure]);

  const isFee = activeTab === "fee";

  async function handleSubmitFee(data: SubmitFeePayload) {
    await onSubmitFee(data);
    setSuccessTab("fee");
  }

  async function handleSuggestSchool(data: SuggestSchoolInput) {
    await onSuggestSchool(data);
    setSuccessTab("school");
  }

  if (successTab) {
    const copy = SUCCESS_COPY[successTab];
    return (
      <div className="flex flex-1 flex-col items-center justify-center self-stretch">
        <ContributionSuccess
          title={copy.title}
          description={copy.description}
          actionLabel={copy.actionLabel}
          onAction={() => {
            setActiveTab(successTab);
            setSuccessTab(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[520px]">
      <div className="mb-5 flex justify-center">
        <span className="inline-flex size-10 items-center justify-center rounded-[12px] bg-brand-lime">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/icon-logo.svg"
            alt=""
            width={14}
            height={18}
            aria-hidden
          />
        </span>
        <h1 className="sr-only">
          {isFee ? "Share a fee" : "Suggest a school"}
        </h1>
      </div>

      <div className="mb-7 flex justify-center">
        <div
          ref={listRef}
          role="tablist"
          aria-label="Contribution type"
          className="relative inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#e5ebe5] bg-brand-ink/[0.06] p-1"
        >
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute bottom-1 left-0 top-1 rounded-full bg-white shadow-[0_1px_3px_rgba(16,24,40,0.10),0_1px_2px_rgba(16,24,40,0.06)]",
              pill.ready
                ? "transition-[transform,width] duration-[420ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none"
                : "opacity-0"
            )}
            style={{
              width: pill.width,
              transform: `translateX(${pill.left}px)`,
            }}
          />
          {TABS.map((tab) => {
            const selected = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={selected}
                ref={(element) => {
                  if (element) buttonRefs.current.set(tab.value, element);
                  else buttonRefs.current.delete(tab.value);
                }}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "relative z-10 inline-flex h-11 items-center justify-center rounded-full px-5 text-base tracking-[-0.02em] transition-colors sm:px-6",
                  selected
                    ? "font-semibold text-brand-ink"
                    : "font-normal text-brand-ink/45 hover:text-brand-ink/70"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div key={activeTab} className="animate-compare-reveal motion-reduce:animate-none">
        {isFee ? (
          <SubmitFeeForm
            institutions={institutions}
            courses={courses}
            onSubmit={handleSubmitFee}
          />
        ) : (
          <SuggestSchoolForm onSubmit={handleSuggestSchool} />
        )}
      </div>

      <p className="mt-8 text-center text-xs leading-[1.6] tracking-[-0.01em] text-brand-ink/45">
        Every submission is reviewed by a person before it is published. Your
        identity is never shown alongside a fee.
      </p>
    </div>
  );
}
