import "server-only";

import { headers } from "next/headers";

type Bucket = { count: number; resetAt: number };

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

const globalStore = globalThis as typeof globalThis & {
  __schoolcostRateLimit?: Map<string, Bucket>;
};

function store(): Map<string, Bucket> {
  if (!globalStore.__schoolcostRateLimit) {
    globalStore.__schoolcostRateLimit = new Map();
  }
  return globalStore.__schoolcostRateLimit;
}

async function clientIp(): Promise<string> {
  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headerStore.get("x-real-ip")?.trim() || "unknown";
}

function prune(map: Map<string, Bucket>, now: number) {
  if (map.size < 500) return;
  for (const [key, bucket] of map) {
    if (bucket.resetAt <= now) map.delete(key);
  }
}

/**
 * Best-effort IP rate limit for public Server Actions.
 * In-memory only: enough to blunt casual spam on a single instance.
 */
export async function enforceSubmissionRateLimit(
  action: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const ip = await clientIp();
  const key = `${action}:${ip}`;
  const now = Date.now();
  const map = store();
  prune(map, now);

  const existing = map.get(key);
  if (!existing || existing.resetAt <= now) {
    map.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }

  if (existing.count >= MAX_ATTEMPTS) {
    return {
      ok: false,
      error: "Too many submissions from this network. Please try again in a bit.",
    };
  }

  existing.count += 1;
  return { ok: true };
}
