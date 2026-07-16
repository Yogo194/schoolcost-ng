"use client";

import { useEffect, useState } from "react";
import { Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompareButtonProps {
  institutionSlug: string;
  institutionName: string;
  compact?: boolean;
  /** Solid, full-width primary button (e.g. sidebar panels). */
  fullWidth?: boolean;
  className?: string;
}

export function CompareButton({
  institutionSlug,
  institutionName,
  compact = false,
  fullWidth = false,
  className,
}: CompareButtonProps) {
  // Start empty so server and first client paint match, then hydrate from storage.
  const [compareList, setList] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setList(getCompareList());
    setReady(true);
  }, []);

  const isAdded = ready && compareList.includes(institutionSlug);
  const isFull = ready && compareList.length >= 3 && !isAdded;

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!ready || isFull) return;

    let next: string[];
    if (isAdded) {
      next = compareList.filter((s) => s !== institutionSlug);
    } else {
      next = [...compareList, institutionSlug];
    }

    setCompareList(next);
    setList(next);
  }

  if (compact) {
    return (
      <button
        onClick={handleClick}
        disabled={isFull}
        title={
          isFull
            ? "Comparison is full (max 3 schools)"
            : isAdded
              ? `Remove ${institutionName} from comparison`
              : `Add ${institutionName} to comparison`
        }
        className={cn(
          "w-7 h-7 rounded flex items-center justify-center border transition-colors",
          isAdded
            ? "bg-primary border-primary text-white"
            : "border-gray-300 text-gray-500 hover:border-primary hover:text-primary",
          isFull && !isAdded && "opacity-40 cursor-not-allowed",
          className
        )}
      >
        {isAdded ? (
          <Check className="w-3.5 h-3.5" />
        ) : (
          <Plus className="w-3.5 h-3.5" />
        )}
      </button>
    );
  }

  if (fullWidth) {
    return (
      <button
        onClick={handleClick}
        disabled={isFull}
        title={isFull ? "Comparison is full (max 3 schools)" : undefined}
        className={cn(
          "flex h-12 w-full items-center justify-center gap-2 rounded-[14px] text-base font-medium tracking-[-0.02em] transition-colors",
          isAdded
            ? "border border-primary/30 bg-primary/10 text-primary"
            : "bg-primary text-white hover:bg-primary/90",
          isFull && !isAdded && "cursor-not-allowed opacity-50",
          className
        )}
      >
        {isAdded ? (
          <>
            <Check className="size-4" />
            Added to compare
          </>
        ) : (
          <>
            <Plus className="size-4" />
            Add to compare
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isFull}
      className={cn(
        "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border transition-colors",
        isAdded
          ? "bg-primary/10 border-primary/30 text-primary"
          : "border-gray-200 text-gray-600 hover:border-primary/30 hover:text-primary",
        isFull && !isAdded && "opacity-40 cursor-not-allowed",
        className
      )}
    >
      {isAdded ? (
        <>
          <Check className="w-3 h-3" />
          Added to compare
        </>
      ) : (
        <>
          <Plus className="w-3 h-3" />
          Add to compare
        </>
      )}
    </button>
  );
}

const COMPARE_KEY = "schoolcost_compare";

export function getCompareList(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(COMPARE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setCompareList(slugs: string[]) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(COMPARE_KEY, JSON.stringify(slugs.slice(0, 3)));
}
