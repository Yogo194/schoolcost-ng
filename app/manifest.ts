import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/seo";

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
    // Relative so the app identity always resolves against the host that
    // served the manifest. An absolute apex URL disagreed with start_url once
    // the apex started redirecting to www, which can register the PWA under a
    // different identity than the one it launches from.
    id: "/",
  };
}
