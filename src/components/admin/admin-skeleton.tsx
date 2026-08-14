export function AdminSkeleton() {
  return (
    <div className="animate-pulse" aria-busy aria-label="Loading">
      <div className="mb-8 space-y-3">
        <div className="h-7 w-48 rounded bg-white/10" />
        <div className="h-3 w-72 rounded bg-white/[0.06]" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-5"
          >
            <div className="h-3 w-20 rounded bg-white/[0.08]" />
            <div className="h-7 w-14 rounded bg-white/10" />
            <div className="h-2 w-24 rounded bg-white/[0.06]" />
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-5 h-3 w-28 rounded bg-white/[0.08]" />
        <div className="divide-y divide-white/5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-4">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3 w-1/3 rounded bg-white/10" />
                <div className="h-2 w-1/4 rounded bg-white/[0.06]" />
              </div>
              <div className="h-3 w-16 shrink-0 rounded bg-primary/20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
