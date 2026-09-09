import { ExternalLink } from "lucide-react";

import { SITE_CONFIG } from "@/lib/constants";

/** Developer credit bar at the bottom of the page footer (not viewport-fixed). */
export function DeveloperCreditBar() {
  return (
    <div
      className="border-t border-primary/25 bg-[#050505]/95"
      role="contentinfo"
      aria-label="Developer credit"
    >
      <div className="container flex flex-col items-center justify-center gap-1 py-4 text-center text-[11px] text-white/55 sm:flex-row sm:justify-between sm:text-xs">
        <p className="tracking-wide text-white/35">
          © {new Date().getFullYear()} SmartMart Motors. All rights reserved.
        </p>

        <p className="flex flex-wrap items-center justify-center gap-1.5">
          <span className="uppercase tracking-[0.14em] text-white/40">Developed by</span>
          <a
            href={SITE_CONFIG.developer.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-brand-teal transition hover:text-primary"
          >
            {SITE_CONFIG.developer.brand}
            <ExternalLink className="h-3 w-3 opacity-70" aria-hidden />
          </a>
        </p>
      </div>
    </div>
  );
}
