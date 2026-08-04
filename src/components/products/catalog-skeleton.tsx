import { Package } from "lucide-react";

export function CatalogSkeleton({ title = "Loading parts…" }: { title?: string }) {
  return (
    <div className="animate-pulse space-y-8" aria-busy aria-label={title}>
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <div className="hidden space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-5 lg:block">
          <div className="h-4 w-24 rounded bg-white/10" />
          <div className="h-10 rounded bg-white/10" />
          <div className="h-10 rounded bg-white/10" />
          <div className="h-10 rounded bg-white/10" />
        </div>
        <div>
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="h-4 w-4 animate-spin text-primary" />
            {title}
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
              >
                <div className="aspect-[4/3] bg-white/5" />
                <div className="space-y-2 p-4">
                  <div className="h-3 w-16 rounded bg-white/10" />
                  <div className="h-4 w-3/4 rounded bg-white/10" />
                  <div className="h-4 w-1/3 rounded bg-primary/20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
