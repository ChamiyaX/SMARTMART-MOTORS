import { CatalogSkeleton } from "@/components/products/catalog-skeleton";

export default function CategoryLoading() {
  return (
    <div className="container pb-20 pt-28">
      <div className="mb-8 h-4 w-48 animate-pulse rounded bg-white/10" />
      <div className="mb-10 space-y-3">
        <div className="h-3 w-20 animate-pulse rounded bg-primary/30" />
        <div className="h-10 w-64 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-full max-w-lg animate-pulse rounded bg-white/10" />
      </div>
      <CatalogSkeleton title="Loading category products…" />
    </div>
  );
}
