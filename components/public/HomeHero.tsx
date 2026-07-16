"use client";

import Image from "next/image";
import { Suspense } from "react";
import { SearchBar } from "@/components/public/SearchBar";

const SEARCH_SUGGESTIONS = [
  "Babcock University",
  "Computer Science",
  "Nursing",
  "Law",
  "Covenant University",
];

export function HomeHero() {
  return (
    <section className="relative isolate flex h-dvh min-h-[640px] flex-col overflow-hidden bg-brand-lime">
      {/* Full-bleed HQ hero background */}
      <picture className="pointer-events-none absolute inset-0 block">
        <source srcSet="/figma/hero-bg.avif" type="image/avif" />
        <img
          src="/figma/hero-bg.png"
          alt=""
          className="h-full w-full object-cover object-center"
          aria-hidden
        />
      </picture>

      {/* Center copy + search */}
      <div className="relative z-10 mx-auto flex w-full max-w-[913px] flex-1 flex-col items-center justify-center gap-8 px-4 pb-8 pt-28 text-center sm:gap-[42px] sm:pt-32">
        <div className="relative flex w-full flex-col items-center gap-3.5">
          <h1 className="animate-hero-rise max-w-[913px] text-[2.5rem] font-medium leading-[1.1] tracking-[-0.04em] text-brand-ink sm:text-5xl lg:text-[56px] [animation-delay:80ms]">
            Know what it costs
            <br className="hidden sm:block" />
            {" "}
            to study your
            <br className="hidden sm:block" />
            {" "}
            course of choice.
          </h1>
          <p className="animate-hero-rise max-w-[649px] text-base leading-[1.4] tracking-[-0.02em] text-brand-ink/80 sm:text-lg [animation-delay:180ms]">
            Search verified school fees by institution, course, level and
            academic session.
          </p>
        </div>

        <div className="animate-hero-rise relative z-30 w-full max-w-[624px] [animation-delay:300ms]">
          <Suspense fallback={<div className="h-[130px] w-full" />}>
            <SearchBar size="lg" suggestions={SEARCH_SUGGESTIONS} />
          </Suspense>
        </div>
      </div>

      {/* Illustrated campus skyline, pinned to the bottom of the hero */}
      <div className="relative z-0 w-full shrink-0">
        {/* Mobile: taller, slow auto-scrolling strip so buildings stay legible on narrow screens */}
        <div className="overflow-hidden sm:hidden">
          <div className="flex w-max animate-skyline-marquee items-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/hero-skyline.avif"
              alt=""
              className="h-40 w-auto shrink-0 object-cover object-bottom"
              aria-hidden
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/hero-skyline.avif"
              alt=""
              className="h-40 w-auto shrink-0 object-cover object-bottom"
              aria-hidden
            />
          </div>
        </div>

        {/* Tablet/desktop: static full width */}
        <Image
          src="/figma/hero-skyline.avif"
          alt=""
          width={2880}
          height={522}
          className="hidden h-auto w-full object-cover object-bottom sm:block"
          aria-hidden
          priority
        />
      </div>
    </section>
  );
}
