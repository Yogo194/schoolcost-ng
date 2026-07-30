"use client";

import { X } from "lucide-react";
import Link from "next/link";
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
    <div className="relative flex w-full items-center bg-brand-amber px-4 py-2.5 pr-12 sm:justify-center sm:px-10 sm:pr-10 lg:px-20 lg:pr-20">
      <Link
        href="/submit-fees"
        className="text-left text-sm tracking-[-0.02em] text-brand-ink underline-offset-4 transition-[text-decoration-color] hover:underline sm:px-8 sm:text-center sm:text-base"
      >
        {message}
      </Link>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-4 z-10 flex size-8 shrink-0 cursor-pointer items-center justify-center text-brand-ink/70 transition-colors hover:text-brand-ink sm:right-10 lg:right-20"
      >
        <X className="size-5" strokeWidth={1.75} />
      </button>
    </div>
  );
}
