const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_RE.test(value.trim());
}

/** Normalize free-text session labels like "2025/2026" or "2025 - 2026". */
export function normalizeSessionName(raw: string): string {
  return raw.trim().replace(/\s*[-–—]\s*/g, "/").replace(/\s+/g, " ");
}

/**
 * Parse start/end years from labels such as "2025/2026".
 * Falls back to the current calendar year when parsing fails.
 */
export function parseSessionYears(name: string): {
  start_year: number;
  end_year: number;
} {
  const match = name.match(/(20\d{2})\D+(20\d{2}|\d{2})/);
  if (!match) {
    const year = new Date().getFullYear();
    return { start_year: year, end_year: year + 1 };
  }

  const start_year = Number(match[1]);
  const endRaw = match[2];
  const end_year =
    endRaw.length === 2
      ? Math.floor(start_year / 100) * 100 + Number(endRaw)
      : Number(endRaw);

  return { start_year, end_year };
}
