"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import type { Faq } from "@/types";
import { cn } from "@/lib/utils";

interface FaqAccordionProps {
  faqs: Faq[];
}

export function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openId, setOpenId] = React.useState<string | null>(faqs[0]?.id ?? null);

  if (!faqs.length) {
    return (
      <p className="text-center text-muted-foreground">
        No FAQs available right now. Check back soon.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {faqs.map((faq) => {
        const open = openId === faq.id;
        return (
          <div key={faq.id} className="overflow-hidden rounded-xl glass">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : faq.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={open}
            >
              <span className="font-display text-base font-semibold text-white">
                {faq.question}
              </span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-primary transition-transform",
                  open && "rotate-180"
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-300",
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <p className="border-t border-white/10 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
