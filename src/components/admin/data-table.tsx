import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type DataTableProps = {
  title?: string;
  description?: string;
  searchSlot?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  empty?: boolean;
  emptyMessage?: string;
};

export function DataTable({
  title,
  description,
  searchSlot,
  actions,
  children,
  className,
  empty,
  emptyMessage = "No records found",
}: DataTableProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl",
        className
      )}
    >
      {(title || searchSlot || actions) && (
        <div className="flex flex-col gap-4 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            {title && (
              <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-white">
                {title}
              </h2>
            )}
            {description && <p className="mt-1 text-xs text-white/40">{description}</p>}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {searchSlot}
            {actions}
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        {empty ? (
          <div className="px-5 py-16 text-center text-sm text-white/40">
            {emptyMessage}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
