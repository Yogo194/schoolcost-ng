import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteUrl } from "@/lib/site";
import {
  DEFAULT_OG_IMAGE,
  organizationJsonLd,
  SITE_NAME,
} from "@/lib/seo";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const site = getSiteUrl();
const defaultTitle = `${SITE_NAME}: Know the True Cost Before You Accept`;
const defaultDescription =
  "Compare verified school fees by course, level, and session, including the charges most people miss.";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e4f67e" },
    { media: "(prefers-color-scheme: dark)", color: "#03302a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: defaultTitle,
    template: `%s | ${SITE_NAME}`,
  },
  description: defaultDescription,
  keywords: [
    "Nigerian school fees",
    "university fees Nigeria",
    "polytechnic fees",
    "tertiary education cost Nigeria",
  ],
  applicationName: SITE_NAME,
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: SITE_NAME,
    description: "Know the true cost before you accept.",
    siteName: SITE_NAME,
    locale: "en_NG",
    type: "website",
    url: site,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME}: Know the true cost before you accept`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: "Know the true cost before you accept.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <JsonLd data={organizationJsonLd()} />
        {children}
      </body>
    </html>
  );
}
