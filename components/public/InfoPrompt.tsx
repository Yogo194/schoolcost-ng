import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InfoPromptProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  /** Defaults to the Figma warning tile used for compare/info prompts. */
  iconSrc?: string;
}

/**
 * Figma "Prompt" notice: icon tile + title + supporting line.
 * Compact for short one-liners; expands padding/spacing when children are present.
 */
export function InfoPrompt({
  title,
  description,
  children,
  className,
  iconSrc = "/figma/prompt-warning-icon.svg",
}: InfoPromptProps) {
  const isRich = Boolean(children);

  return (
    <div
      className={cn(
        "flex overflow-hidden rounded-[14px] bg-gradient-to-b from-[#fef7ee] to-white",
        "shadow-[0_4px_8px_rgba(11,19,36,0.1),0_0_0_1px_rgba(11,19,36,0.07)]",
        isRich
          ? "items-start gap-4 px-4 py-4 sm:gap-4 sm:px-5 sm:py-[18px]"
          : "items-center gap-4 px-3 py-2.5 sm:gap-5",
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={iconSrc}
        alt=""
        width={40}
        height={40}
        className={cn("size-10 shrink-0", isRich && "mt-px")}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-medium leading-[22px] tracking-[-0.02em] text-brand-ink sm:text-base sm:leading-6">
          {title}
        </p>
        {description ? (
          <p
            className={cn(
              "text-[15px] tracking-[-0.02em] text-brand-ink/60 sm:text-base",
              isRich
                ? "mt-1.5 max-w-prose leading-relaxed"
                : "mt-0.5 leading-[22px] sm:leading-6"
            )}
          >
            {description}
          </p>
        ) : null}
        {children ? (
          <div className="mt-3 flex flex-col items-start gap-2.5 border-t border-brand-ink/[0.08] pt-3">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}
