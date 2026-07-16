"use client";

import Image from "next/image";

export interface LogoItem {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Optional display height override (px) for logos that read small at the default size. */
  displayHeight?: number;
}

interface LogoMarqueeProps {
  logos: readonly LogoItem[];
  className?: string;
}

export function LogoMarquee({ logos, className }: LogoMarqueeProps) {
  const track = [...logos, ...logos];

  return (
    <div className={className}>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-10 bg-gradient-to-r from-[#e4f67e] to-transparent sm:w-14" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-10 bg-gradient-to-l from-[#e4f67e] to-transparent sm:w-14" />

        <div className="flex w-max animate-logo-marquee items-center gap-10 py-1 sm:gap-14">
          {track.map((logo, i) => {
            const h = logo.displayHeight ?? 52;
            return (
              <Image
                key={`${logo.src}-${i}`}
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="w-auto shrink-0 object-contain opacity-90"
                style={{ height: h }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
