import Image from "next/image";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const primary = product.images?.find((img) => img.isPrimary) ?? product.images?.[0];
  const image = primary?.url || "/placeholder-product.jpg";
  const outOfStock = product.stockStatus === "OUT_OF_STOCK" || product.stockQuantity <= 0;
  const onSale =
    product.compareAtPrice != null &&
    Number(product.compareAtPrice) > Number(product.price);

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "neon-glow-hover group relative flex flex-col overflow-hidden rounded-xl glass",
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
        <Image
          src={image}
          alt={primary?.alt || product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.isFeatured ? <Badge variant="featured">Featured</Badge> : null}
          {product.isNewArrival ? <Badge variant="new">New</Badge> : null}
          {onSale ? <Badge variant="sale">Sale</Badge> : null}
        </div>
        {outOfStock ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/55">
            <span className="rounded-md border border-white/20 bg-black/50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              Out of stock
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.brand?.name ? (
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {product.brand.name}
          </p>
        ) : null}
        <h3 className="line-clamp-2 min-h-[2.75rem] font-display text-base font-semibold leading-snug text-white transition-colors group-hover:text-primary">
          {product.name}
        </h3>
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-lg font-semibold text-primary">
            {formatPrice(product.price)}
          </span>
          {onSale ? (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
