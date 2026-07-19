import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SchoolCost NG: Know the True Cost Before You Accept",
    template: "%s | SchoolCost NG",
  },
  description:
    "Compare verified school fees by course, level, and session, including the charges most people miss.",
  keywords: [
    "Nigerian school fees",
    "university fees Nigeria",
    "polytechnic fees",
    "tertiary education cost Nigeria",
  ],
  openGraph: {
    title: "SchoolCost NG",
    description: "Know the true cost before you accept.",
    siteName: "SchoolCost NG",
    locale: "en_NG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
