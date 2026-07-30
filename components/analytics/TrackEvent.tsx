"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** Fires a named PostHog event once on mount (for server-rendered pages). */
export function TrackEvent({
  event,
  properties,
}: {
  event: string;
  properties?: Record<string, string | number | boolean | null | undefined>;
}) {
  useEffect(() => {
    track(event, properties);
    // Intentionally once per mount for this page identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  return null;
}
