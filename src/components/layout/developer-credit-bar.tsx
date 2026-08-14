import { ExternalLink } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * Viewport-fixed developer credit — must stay outside any
 * transformed / backdrop-filter parent (e.g. footer blur).
 */
export function DeveloperCreditBar() {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[9999]"
      role="contentinfo"
      aria-label="Developer credit"
    >
      <div className="pointer-events-auto border-t border-primary/25 bg-[#050505]/95 shadow-[0_-8px_32px_rgba(0,0,0,0.55)] backdrop-blur-md">
        <div className="mx-auto flex h-11 max-w-[1400px] items-center justify-center gap-2 px-4 text-[11px] text-white/55 sm:justify-between sm:px-6 sm:text-xs">
          <p className="hidden tracking-wide text-white/35 sm:block">
            Proposal demo · SmartMart Motors
          </p>

          <p className="flex flex-wrap items-center justify-center gap-1.5">
            <span className="uppercase tracking-[0.14em] text-white/40">
              Developed by
            </span>
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
    </div>
  );
}
