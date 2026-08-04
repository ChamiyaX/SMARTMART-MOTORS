"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  ProductFilters,
  type ProductFiltersState,
} from "@/components/products/product-filters";
import { ProductGrid } from "@/components/products/product-grid";
import { Pagination } from "@/components/shared/pagination";
import type { Brand, Category, Product } from "@/types";

const defaultFilters: ProductFiltersState = {
  search: "",
  categoryId: "",
  brandId: "",
  stock: "all",
  minPrice: "",
  maxPrice: "",
};

interface ProductsBrowserProps {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  page: number;
  totalPages: number;
  initialFilters: ProductFiltersState;
}

export function ProductsBrowser({
  products,
  categories,
  brands,
  page,
  totalPages,
  initialFilters,
}: ProductsBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = React.useState<ProductFiltersState>(initialFilters);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const pushParams = React.useCallback(
    (next: ProductFiltersState, nextPage = 1) => {
      const params = new URLSearchParams(searchParams.toString());

      if (next.search.trim()) params.set("q", next.search.trim());
      else params.delete("q");

      const category = categories.find((c) => c.id === next.categoryId);
      if (category) params.set("category", category.slug);
      else params.delete("category");

      const brand = brands.find((b) => b.id === next.brandId);
      if (brand) params.set("brand", brand.slug);
      else params.delete("brand");

      if (next.stock !== "all") params.set("stock", next.stock);
      else params.delete("stock");

      if (next.minPrice) params.set("minPrice", next.minPrice);
      else params.delete("minPrice");

      if (next.maxPrice) params.set("maxPrice", next.maxPrice);
      else params.delete("maxPrice");

      if (nextPage > 1) params.set("page", String(nextPage));
      else params.delete("page");

      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [brands, categories, pathname, router, searchParams]
  );

  const onFiltersChange = (next: ProductFiltersState) => {
    setFilters(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => pushParams(next, 1), 200);
  };

  const onReset = () => {
    setFilters(defaultFilters);
    router.push(pathname);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <ProductFilters
        categories={categories}
        brands={brands}
        value={filters}
        onChange={onFiltersChange}
        onReset={onReset}
        className="h-fit lg:sticky lg:top-24"
      />
      <div className="space-y-8">
        <ProductGrid products={products} />
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(p) => pushParams(filters, p)}
        />
      </div>
    </div>
  );
}
