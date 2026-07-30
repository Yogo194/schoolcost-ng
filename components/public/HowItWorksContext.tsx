"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { SourceBadge } from "@/components/public/SourceBadge";

const PRIVACY_CHECKS = [
  "Hide your name and student ID",
  "Remove payment references and receipt numbers",
  "Blur anything that identifies you",
] as const;

/* Rotating pairs: source pill + matching confidence level (colors mirror
   HowItWorksConfidence). */
const ROTATION = [
  {
    sourceType: "official_school_source",
    confidence: {
      label: "High",
      filled: 3,
      color: "bg-[#166d3e]",
      faded: "bg-[#166d3e]/40",
    },
  },
  {
    sourceType: "student_portal_evidence",
    confidence: {
      label: "Medium",
      filled: 2,
      color: "bg-[#f4982f]",
      faded: "bg-[#f4982f]/40",
    },
  },
  {
    sourceType: "community_reported",
    confidence: {
      label: "Low",
      filled: 1,
      color: "bg-[#fe5f2b]",
      faded: "bg-[#fe5f2b]/40",
    },
  },
] as const;

const ROTATION_INTERVAL_MS = 3200;

export function HowItWorksContext() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setRotation((current) => (current + 1) % ROTATION.length);
    }, ROTATION_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [inView]);

  const activeSource = ROTATION[rotation].sourceType;
  const activeConfidence = ROTATION[rotation].confidence;

  return (
    <section className="bg-brand-lime-light px-4 py-16 sm:px-10 sm:py-[72px] lg:px-20">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10">
        <div className="mx-auto flex max-w-[750px] flex-col items-center gap-2 text-center">
          <span className="inline-flex h-8 items-center justify-center rounded-lg border border-brand-amber bg-brand-lime px-3 text-base font-medium tracking-[-0.02em] text-brand-ink">
            On every fee
          </span>
          <h2 className="text-[1.75rem] font-medium leading-[1.2] tracking-[-0.04em] text-brand-ink/80 sm:text-[38px]">
            You always see the full context
          </h2>
          <p className="max-w-[649px] text-base leading-[1.4] tracking-[-0.02em] text-brand-ink/80 sm:text-lg">
            No bare number. Each record shows where it sits, where it came from,
            and when it was last checked.
          </p>
        </div>

        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-[24px] sm:rounded-[32px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/how-it-works/context-students.jpg"
            alt=""
            width={1280}
            height={597}
            className="absolute inset-0 h-full w-full object-cover"
            aria-hidden
          />
          <div className="absolute inset-0 bg-[rgba(5,10,6,0.4)]" aria-hidden />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#050a06] via-[#050a06]/70 to-transparent"
            aria-hidden
          />

          <div className="relative z-10 flex min-h-[420px] flex-col justify-between gap-10 p-6 sm:min-h-[520px] sm:p-10 lg:min-h-[597px] lg:flex-row lg:items-end lg:p-[60px]">
            <div className="flex max-w-[441px] flex-col gap-3 lg:self-start">
              <h3
                className={cn(
                  "text-[1.75rem] font-semibold leading-[1.3] tracking-[-0.03em] text-white opacity-0 sm:text-[36px]",
                  inView && "animate-hero-rise"
                )}
              >
                Protecting your privacy
              </h3>
              <p
                className={cn(
                  "text-base leading-[1.4] text-[#bebebe] opacity-0",
                  inView && "animate-hero-rise [animation-delay:120ms]"
                )}
              >
                If you contribute evidence, please remove your personal details
                first. We only need the fees, never your identity.
              </p>
              <ul className="mt-1.5 flex flex-col gap-3">
                {PRIVACY_CHECKS.map((item, index) => (
                  <li
                    key={item}
                    className={cn("flex items-center gap-4 opacity-0", inView && "animate-hero-rise")}
                    style={
                      inView
                        ? { animationDelay: `${260 + index * 150}ms` }
                        : undefined
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/figma/how-it-works/check-badge.svg"
                      alt=""
                      width={30}
                      height={30}
                      className={cn("size-[30px] shrink-0 opacity-0", inView && "animate-badge-pop")}
                      style={
                        inView
                          ? { animationDelay: `${340 + index * 150}ms` }
                          : undefined
                      }
                      aria-hidden
                    />
                    <span className="text-base leading-[1.4] text-white">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className={cn(
                "w-full max-w-[374px] self-center overflow-hidden rounded-2xl bg-white/16 opacity-0 shadow-[2px_6px_20px_rgba(0,0,0,0.15)] backdrop-blur-[62px] lg:mb-6 lg:self-end",
                inView && "animate-card-slide-in [animation-delay:500ms]"
              )}
            >
              <div className="flex items-center gap-3 bg-[#daf34f] p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-black/18">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/figma/how-it-works/badge-check.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="size-5"
                    aria-hidden
                  />
                </div>
                <div>
                  <p className="text-lg font-medium tracking-[-0.02em] text-[#020202]">
                    Officially verified
                  </p>
                  <p className="text-xs tracking-[-0.02em] text-[#020202]">
                    Example fee record
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm tracking-[-0.02em] text-white/70">
                    Level
                  </span>
                  <span className="text-right text-[15px] font-medium tracking-[-0.02em] text-white">
                    100 Level
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm tracking-[-0.02em] text-white/70">
                    Academic session
                  </span>
                  <span className="text-right text-[15px] font-medium tracking-[-0.02em] text-white">
                    2026 / 2027
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm tracking-[-0.02em] text-white/70">
                    Source
                  </span>
                  <SourceBadge
                    key={rotation}
                    sourceType={activeSource}
                    compact
                    className="animate-step-fade"
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm tracking-[-0.02em] text-white/70">
                    Confidence
                  </span>
                  <span className="flex items-center gap-2" key={rotation}>
                    <span className="flex items-center gap-[3px]" aria-hidden>
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className={cn(
                            "h-[5px] w-[15px] origin-left rounded-full",
                            i < activeConfidence.filled
                              ? activeConfidence.color
                              : activeConfidence.faded,
                            i < activeConfidence.filled && inView
                              ? "animate-bar-fill"
                              : undefined
                          )}
                          style={
                            i < activeConfidence.filled && inView
                              ? { animationDelay: `${i * 150}ms` }
                              : undefined
                          }
                        />
                      ))}
                    </span>
                    <span className="text-[15px] font-medium tracking-[-0.02em] text-white animate-step-fade">
                      {activeConfidence.label}
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm tracking-[-0.02em] text-white/70">
                    Last reviewed
                  </span>
                  <span className="text-right text-[15px] font-medium tracking-[-0.02em] text-white">
                    10 July 2026
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm tracking-[-0.02em] text-white/70">
                    Evidence
                  </span>
                  <span className="text-right text-[15px] font-medium tracking-[-0.02em] text-white">
                    2026/2027 fee circular
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="-mt-6 flex flex-col gap-4 rounded-[24px] bg-brand-amber p-6 sm:flex-row sm:items-center sm:gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[1.25rem] font-medium leading-7 tracking-[-0.02em] text-[#002c15] sm:text-[22px]">
              Have more recent information?
            </p>
            <p className="mt-1.5 text-base leading-6 tracking-[-0.02em] text-[#454745] sm:text-lg">
              Help other students by sharing an updated fee or flagging one
              that&apos;s wrong.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:shrink-0">
            <Link
              href="/submit-fees"
              className="inline-flex h-12 items-center justify-center rounded-[14px] bg-[#166d3e] px-7 text-lg font-medium tracking-[-0.02em] text-white transition-colors hover:bg-[#145f36]"
            >
              Submit a fee update
            </Link>
            <Link
              href="/submit-correction"
              className="inline-flex h-12 items-center justify-center rounded-[14px] bg-white px-7 text-lg font-medium tracking-[-0.02em] text-[#166d3e] transition-opacity hover:opacity-90"
            >
              Report an error
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
