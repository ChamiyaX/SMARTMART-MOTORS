import type { MetadataRoute } from "next";

import { SITE_CONFIG } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.name,
    short_name: "SmartMart",
    description: SITE_CONFIG.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#E10600",
    lang: "en",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
