"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ContributionSuccessProps {
  title?: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

export function ContributionSuccess({
  title = "You're all set!",
  description,
  actionLabel,
  onAction,
}: ContributionSuccessProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <Image
        src="/figma/success-icon.png"
        alt=""
        width={64}
        height={74}
        className="mb-5 h-auto w-16"
        priority
      />
      <h3 className="text-2xl font-semibold tracking-[-0.03em] text-brand-ink">
        {title}
      </h3>
      <p className="mt-2.5 max-w-[19rem] text-[15px] leading-[1.55] text-brand-ink/55">
        {description}
      </p>
      <Button
        type="button"
        className="mt-8 w-full max-w-[19rem]"
        onClick={onAction}
      >
        {actionLabel}
      </Button>
    </div>
  );
}
