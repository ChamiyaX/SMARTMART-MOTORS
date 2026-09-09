"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { ProductDescription } from "@/components/products/product-description";
import { cn } from "@/lib/utils";

type ProductDescriptionSectionProps = {
  description: string;
};

function isLongDescription(description: string) {
  const lines = description.split(/\r?\n/);
  return description.length > 280 || lines.length > 6;
}

export function ProductDescriptionSection({
  description,
}: ProductDescriptionSectionProps) {
  const [expanded, setExpanded] = React.useState(false);
  const long = isLongDescription(description);

  return (
    <div>
      <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-wider text-white lg:sr-only">
        Description
      </h2>
      <div className="relative">
        <div
          className={cn(
            long &&
              !expanded &&
              "max-h-44 overflow-hidden lg:max-h-none lg:overflow-visible"
          )}
        >
          <ProductDescription
            description={description}
            className="text-sm sm:text-base"
          />
        </div>
        {long && !expanded ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#050505] to-transparent lg:hidden"
          />
        ) : null}
      </div>
      {long ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary lg:hidden"
        >
          {expanded ? "Show less" : "Show full description"}
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")}
          />
        </button>
      ) : null}
    </div>
  );
}
