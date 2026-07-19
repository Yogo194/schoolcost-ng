import type { Metadata } from "next";
import Link from "next/link";
import { SubmitFeeForm } from "@/components/forms/SubmitFeeForm";

export const metadata: Metadata = {
  title: "Submit Fee Information",
  description:
    "Share what a school actually charges. Every submission is reviewed by a person before it is published.",
};

export default async function SubmitFeesPage() {
  // TODO: fetch institutions list for the dropdown
  const institutions: never[] = [];

  async function handleSubmit(data: unknown) {
    "use server";
    // TODO: insert into submissions table via Supabase
    console.log("Fee submission:", data);
  }

  return (
    <div className="grid min-h-[calc(100svh-4rem)] lg:grid-cols-2">
      {/* Left: the form */}
      <div className="flex justify-center bg-white px-4 py-10 sm:px-8 sm:py-14">
        <div className="w-full max-w-[520px]">
          <div className="mb-8 text-center">
            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-lime">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/icon-logo.svg"
                alt=""
                width={16}
                height={21}
                aria-hidden
              />
            </span>
            <h1 className="mt-4 text-[1.75rem] font-medium leading-[1.2] tracking-[-0.04em] text-brand-ink sm:text-[34px]">
              Share a school&apos;s fees
            </h1>
            <p className="mt-2 text-sm tracking-[-0.01em] text-brand-ink/60">
              Just checking a fee?{" "}
              <Link
                href="/schools"
                className="font-medium text-[#166d3e] underline underline-offset-2"
              >
                Browse schools here.
              </Link>
            </p>
          </div>

          <SubmitFeeForm
            institutions={institutions}
            onSubmit={handleSubmit as never}
          />

          <p className="mt-8 text-center text-xs leading-[1.6] tracking-[-0.01em] text-brand-ink/45">
            Every submission is reviewed by a person before it is published.
            Your identity is never shown alongside a fee.
          </p>
        </div>
      </div>

      {/* Right: brand panel, hidden on mobile */}
      <div className="relative hidden overflow-hidden bg-brand-ink lg:block">
        {/* Soft glows echoing the brand palette */}
        <div
          className="pointer-events-none absolute -right-32 -top-32 size-[480px] rounded-full bg-brand-lime/15 blur-[140px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-40 -left-24 size-[420px] rounded-full bg-brand-amber/15 blur-[140px]"
          aria-hidden
        />

        <div className="sticky top-16 flex h-[calc(100svh-4rem)] items-center px-12 xl:px-20">
          <figure className="max-w-[520px]">
            <span
              className="block font-serif text-[110px] leading-[0.6] text-white/25"
              aria-hidden
            >
              &ldquo;
            </span>
            <blockquote className="mt-4 text-[28px] font-medium leading-[1.35] tracking-[-0.03em] text-white xl:text-[32px]">
              The tuition was only half the story. Acceptance fee, departmental
              fee, hostel. Knowing the full cost upfront would have saved my
              family weeks of scrambling.
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-3.5">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-lime text-base font-semibold text-brand-ink">
                CA
              </span>
              <span>
                <span className="block text-base font-semibold tracking-[-0.02em] text-white">
                  Chiamaka A.
                </span>
                <span className="block text-sm tracking-[-0.01em] text-white/60">
                  200 Level, contributed fees for her school
                </span>
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
