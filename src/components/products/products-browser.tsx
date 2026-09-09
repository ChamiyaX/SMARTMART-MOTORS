"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

import {
  ProductFilters,
  type ProductFiltersState,
} from "@/components/products/product-filters";
import { ProductGrid } from "@/components/products/product-grid";
import { Pagination } from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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

function countActiveFilters(filters: ProductFiltersState) {
  let count = 0;
  if (filters.search.trim()) count += 1;
  if (filters.categoryId) count += 1;
  if (filters.brandId) count += 1;
  if (filters.stock !== "all") count += 1;
  if (filters.minPrice) count += 1;
  if (filters.maxPrice) count += 1;
  return count;
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
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const activeFilterCount = countActiveFilters(filters);

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
    setFiltersOpen(false);
    router.push(pathname);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-8">
      <div className="flex items-center justify-between gap-3 lg:hidden">
        <p className="text-sm text-muted-foreground">
          {products.length} product{products.length === 1 ? "" : "s"} shown
        </p>
        <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 ? (
                <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {activeFilterCount}
                </span>
              ) : null}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[min(100vw-1rem,320px)] overflow-y-auto p-0"
          >
            <SheetHeader className="border-b border-white/10 px-5 py-4 text-left">
              <SheetTitle className="font-display text-sm uppercase tracking-wider">
                Filter products
              </SheetTitle>
            </SheetHeader>
            <div className="p-4">
              <ProductFilters
                categories={categories}
                brands={brands}
                value={filters}
                onChange={onFiltersChange}
                onReset={onReset}
                className="border-0 bg-transparent p-0 shadow-none"
              />
              <Button className="mt-4 w-full" onClick={() => setFiltersOpen(false)}>
                Show results
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <ProductFilters
        categories={categories}
        brands={brands}
        value={filters}
        onChange={onFiltersChange}
        onReset={onReset}
        className="hidden h-fit lg:sticky lg:top-24 lg:block"
      />

      <div className="space-y-6 sm:space-y-8">
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
