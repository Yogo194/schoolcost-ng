"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/* Avatars 04-09 are in public/figma/submit-avatars/ for future use. */
const TESTIMONIALS = [
  {
    quote:
      "The tuition was only half the story. Acceptance fee, departmental fee, hostel. Knowing the full cost upfront would have saved my family weeks of scrambling.",
    name: "Chiamaka A.",
    detail: "200 Level, contributed fees for her school",
    avatar: "/figma/submit-avatars/avatar-01.png",
  },
  {
    quote:
      "My parents kept asking for the real total, not just the headline tuition. One clear breakdown on here would have saved us a lot of back and forth.",
    name: "Tunde O.",
    detail: "Fresh student, shared his acceptance fees",
    avatar: "/figma/submit-avatars/avatar-02.png",
  },
  {
    quote:
      "I found my school on here but the fees looked outdated. Took five minutes to submit what I paid this session. If it helps one person plan better, it was worth it.",
    name: "Fatima I.",
    detail: "300 Level, updated her school's fees",
    avatar: "/figma/submit-avatars/avatar-03.png",
  },
] as const;

const ROTATION_INTERVAL_MS = 6000;

export function SubmitFeeTestimonialPanel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % TESTIMONIALS.length);
    }, ROTATION_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, []);

  const testimonial = TESTIMONIALS[active];

  return (
    <div className="relative hidden overflow-hidden bg-brand-ink lg:block">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/figma/submit-panel-bg.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
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

          <blockquote
            key={active}
            className="mt-4 animate-step-fade text-[28px] font-medium leading-[1.35] tracking-[-0.03em] text-white xl:text-[32px]"
          >
            {testimonial.quote}
          </blockquote>

          <figcaption
            key={`attribution-${active}`}
            className="mt-8 flex animate-step-fade items-center gap-3.5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={testimonial.avatar}
              alt=""
              width={48}
              height={48}
              className="size-12 shrink-0 rounded-full object-cover"
            />
            <span>
              <span className="block text-base font-semibold tracking-[-0.02em] text-white">
                {testimonial.name}
              </span>
              <span className="block text-sm tracking-[-0.01em] text-white/60">
                {testimonial.detail}
              </span>
            </span>
          </figcaption>

          <div
            className="mt-10 flex items-center gap-2"
            role="tablist"
            aria-label="Testimonials"
          >
            {TESTIMONIALS.map((item, index) => (
              <button
                key={item.name}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-label={`Show testimonial from ${item.name}`}
                onClick={() => setActive(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  index === active
                    ? "w-8 bg-white"
                    : "w-1.5 bg-white/35 hover:bg-white/55"
                )}
              />
            ))}
          </div>
        </figure>
      </div>
    </div>
  );
}
