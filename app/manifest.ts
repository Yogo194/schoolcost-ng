import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "SchoolCost",
    description:
      "Compare verified Nigerian school fees by course, level, and session.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#e4f67e",
    theme_color: "#03302a",
    lang: "en-NG",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    id: getSiteUrl(),
  };
}
