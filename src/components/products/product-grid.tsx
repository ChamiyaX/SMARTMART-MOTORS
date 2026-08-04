import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { ProductCard } from "@/components/products/product-card";
import { EmptyState } from "@/components/shared/empty-state";

interface ProductGridProps {
  products: Product[];
  className?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function ProductGrid({
  products,
  className,
  emptyTitle,
  emptyDescription,
}: ProductGridProps) {
  if (!products.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div
      className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", className)}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
