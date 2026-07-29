import type { LogoItem } from "@/components/public/LogoMarquee";

/**
 * Logos for the "Verified fee data from schools across Nigeria" marquee.
 * Only institutions with published, verified fees appear here.
 *
 * Each source is trimmed to its content and normalised to 160px tall, so a
 * single `displayHeight` renders every logo at the same visible height
 * (widths vary by logo shape, heights do not). Interleaved crests and
 * wordmark lockups so the strip reads evenly.
 */
const H = 160;
const DISPLAY = 46;

function logo(slug: string, alt: string, width: number): LogoItem {
  return {
    src: `/figma/logos-strip/${slug}.png`,
    alt,
    width,
    height: H,
    displayHeight: DISPLAY,
  };
}

export const UNIVERSITY_LOGOS: readonly LogoItem[] = [
  logo("university-of-ibadan", "University of Ibadan", 144),
  logo("covenant-university", "Covenant University", 151),
  logo("babcock-university", "Babcock University", 233),
  logo("obafemi-awolowo-university", "Obafemi Awolowo University", 171),
  logo("lead-city-university", "Lead City University", 164),
  logo("pan-atlantic-university", "Pan-Atlantic University", 328),
  logo("university-of-lagos", "University of Lagos", 156),
  logo("bells-university-of-technology", "Bells University of Technology", 163),
  logo("chrisland-university", "Chrisland University", 500),
  logo("adeleke-university", "Adeleke University", 161),
  logo("bowen-university", "Bowen University", 262),
  logo("afe-babalola-university", "Afe Babalola University", 121),
  logo("first-technical-university", "First Technical University", 395),
  logo("federal-university-oye-ekiti", "Federal University Oye-Ekiti", 111),
  logo("redeemers-university", "Redeemer's University", 579),
] as const;
