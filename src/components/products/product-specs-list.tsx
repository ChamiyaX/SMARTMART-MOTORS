"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type ProductSpecsListProps = {
  specs: [string, unknown][];
};

export function ProductSpecsList({ specs }: ProductSpecsListProps) {
  const [open, setOpen] = React.useState(false);

  if (!specs.length) return null;

  return (
    <div className="rounded-xl glass">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left lg:hidden"
        aria-expanded={open}
      >
        <span className="font-display text-sm font-semibold uppercase tracking-wider text-white">
          Specifications
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      <div className={cn("hidden p-4 pt-0 lg:block lg:p-5", open && "block")}>
        <h2 className="mb-3 hidden font-display text-sm font-semibold uppercase tracking-wider text-white lg:block">
          Specifications
        </h2>
        <dl className="space-y-2">
          {specs.map(([key, value]) => (
            <div
              key={key}
              className="flex flex-col gap-0.5 border-b border-white/5 py-2.5 text-sm last:border-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
            >
              <dt className="text-muted-foreground">{key}</dt>
              <dd className="break-words text-white sm:max-w-[60%] sm:text-right">
                {String(value)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
