import "server-only";

import fs from "node:fs";
import path from "node:path";

const LOGO_DIR = path.join(process.cwd(), "public", "schools", "logos");
const PUBLIC_PREFIX = "/schools/logos";
const EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".svg"] as const;

let cachedSlugs: Set<string> | null = null;

function localLogoSlugs(): Set<string> {
  if (cachedSlugs) return cachedSlugs;
  try {
    cachedSlugs = new Set(
      fs
        .readdirSync(LOGO_DIR)
        .filter((file) => EXTENSIONS.some((ext) => file.toLowerCase().endsWith(ext)))
        .map((file) => file.replace(/\.[^.]+$/, ""))
    );
  } catch {
    cachedSlugs = new Set();
  }
  return cachedSlugs;
}

function localLogoPath(slug: string): string | null {
  if (!localLogoSlugs().has(slug)) return null;
  for (const ext of EXTENSIONS) {
    const file = path.join(LOGO_DIR, `${slug}${ext}`);
    if (fs.existsSync(file)) return `${PUBLIC_PREFIX}/${slug}${ext}`;
  }
  return null;
}

/**
 * Prefer the DB logo_url; if empty, fall back to a crest file named after the
 * institution slug in public/schools/logos.
 */
export function resolveSchoolLogoUrl(
  slug: string | null | undefined,
  logoUrl: string | null | undefined
): string | null {
  if (logoUrl) return logoUrl;
  if (!slug) return null;
  return localLogoPath(slug);
}
