"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "scng-announcement-dismissed";

interface AnnouncementBarProps {
  message?: string;
}

export function AnnouncementBar({
  message = "Missing a fee we should know about? Submit evidence and help thousands of students plan better.",
}: AnnouncementBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "1") {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="flex w-full items-center justify-between gap-4 bg-brand-amber px-4 py-2.5 sm:px-10 lg:px-20">
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="flex size-6 shrink-0 items-center justify-center text-brand-ink/70 transition-colors hover:text-brand-ink"
      >
        <X className="size-5" strokeWidth={1.75} />
      </button>
      <p className="flex-1 text-center text-sm tracking-[-0.02em] text-brand-ink sm:text-base">
        {message}
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="flex size-6 shrink-0 items-center justify-center text-brand-ink/70 transition-colors hover:text-brand-ink"
      >
        <X className="size-5" strokeWidth={1.75} />
      </button>
    </div>
  );
}
