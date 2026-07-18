"use client";

import { useEffect, useRef, useState } from "react";

type SkylineMarqueeProps = {
  src: string;
  /** Visible strip height. Taller = more skyline detail on mobile. */
  frameHeightClass?: string;
  className?: string;
};

/**
 * Mobile skyline strip: zooms into the building band (these assets have a
 * lot of empty sky/ground) so landmarks read clearly while scrolling.
 */
export function SkylineMarquee({
  src,
  frameHeightClass = "h-52",
  className,
}: SkylineMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const frames = Array.from(track.querySelectorAll("img"));
    if (frames.length === 0) return;

    let loaded = 0;

    function markReady() {
      loaded += 1;
      if (loaded >= frames.length) {
        setAnimate(true);
      }
    }

    for (const frame of frames) {
      if (frame.complete && frame.naturalWidth > 0) {
        markReady();
      } else {
        frame.addEventListener("load", markReady, { once: true });
        frame.addEventListener("error", markReady, { once: true });
      }
    }

    return () => {
      for (const frame of frames) {
        frame.removeEventListener("load", markReady);
        frame.removeEventListener("error", markReady);
      }
    };
  }, [src]);

  const frameClass =
    // ~2x phone width so object-cover zooms into landmarks instead of
    // fitting the whole panorama into a tiny strip.
    `${frameHeightClass} w-[200vw] max-w-none shrink-0 object-cover object-[center_72%]`;

  return (
    <div className={`overflow-hidden ${frameHeightClass} ${className ?? ""}`}>
      <div
        ref={trackRef}
        className={`flex w-max items-end ${animate ? "animate-skyline-marquee" : ""}`}
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className={frameClass}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className={frameClass}
        />
      </div>
    </div>
  );
}
