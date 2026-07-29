import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";

export const SITE_NAME = "SchoolCost NG";
export const DEFAULT_OG_IMAGE = "/og-default.png";

export function absoluteUrl(path = "/"): string {
  const site = getSiteUrl();
  if (!path || path === "/") return site;
  return `${site}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Shared metadata for public pages: canonical, OG, Twitter. */
export function publicPageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  /** Skip the root "| SchoolCost NG" template (use for the homepage). */
  absoluteTitle?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(image);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_NG",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME}: Know the true cost before you accept`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function organizationJsonLd() {
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site}/#organization`,
        name: SITE_NAME,
        url: site,
        logo: absoluteUrl("/icons/icon-512.png"),
        description:
          "Verified, course-specific tertiary school fees in Nigeria, with the source and review date shown on every record.",
        areaServed: {
          "@type": "Country",
          name: "Nigeria",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${site}/#website`,
        url: site,
        name: SITE_NAME,
        description:
          "Compare verified school fees by course, level, and session, including the charges most people miss.",
        publisher: { "@id": `${site}/#organization` },
        inLanguage: "en-NG",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${site}/schools?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

export function schoolJsonLd(school: {
  name: string;
  slug: string;
  abbreviation?: string | null;
  city?: string | null;
  state?: string | null;
  website_url?: string | null;
  logo_url?: string | null;
  ownership_type?: string | null;
}) {
  const pageUrl = absoluteUrl(`/schools/${school.slug}`);
  const sameAs = school.website_url ? [school.website_url] : undefined;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollegeOrUniversity",
        "@id": `${pageUrl}#institution`,
        name: school.name,
        alternateName: school.abbreviation || undefined,
        url: pageUrl,
        logo: school.logo_url || undefined,
        sameAs,
        address: {
          "@type": "PostalAddress",
          addressLocality: school.city || undefined,
          addressRegion: school.state || undefined,
          addressCountry: "NG",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Schools",
            item: absoluteUrl("/schools"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: school.name,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": pageUrl,
        url: pageUrl,
        name: `${school.name} fees`,
        isPartOf: { "@id": `${getSiteUrl()}/#website` },
        about: { "@id": `${pageUrl}#institution` },
      },
    ],
  };
}

export function feeJsonLd(fee: {
  id: string;
  schoolSlug: string;
  schoolName: string;
  course: string;
  session: string;
  firstYearTotal: number;
  level?: string | null;
}) {
  const schoolUrl = absoluteUrl(`/schools/${fee.schoolSlug}`);
  const pageUrl = absoluteUrl(`/schools/${fee.schoolSlug}/fees/${fee.id}`);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": pageUrl,
        url: pageUrl,
        name: `${fee.schoolName} school fees for ${fee.course} - ${fee.session}`,
        isPartOf: { "@id": `${getSiteUrl()}/#website` },
        about: {
          "@type": "Course",
          name: fee.course,
          provider: {
            "@type": "CollegeOrUniversity",
            name: fee.schoolName,
            url: schoolUrl,
          },
          offers: {
            "@type": "Offer",
            category: "Tuition",
            price: fee.firstYearTotal,
            priceCurrency: "NGN",
            description: `Estimated first-year total for ${fee.session}${
              fee.level ? ` (${fee.level})` : ""
            }`,
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Schools",
            item: absoluteUrl("/schools"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: fee.schoolName,
            item: schoolUrl,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: fee.course,
            item: pageUrl,
          },
        ],
      },
    ],
  };
}
