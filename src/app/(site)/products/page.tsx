import { Suspense } from "react";
import type { StockStatus } from "@prisma/client";

import { ProductsBrowser } from "@/components/products/products-browser";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SectionHeading } from "@/components/shared/section-heading";
import { getBrands } from "@/lib/data/brands";
import { getCategories } from "@/lib/data/categories";
import { getProducts } from "@/lib/data/products";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { generateSeoMetadata } from "@/lib/seo";
import { safeQuery } from "@/lib/safe";
import { serializeBrand, serializeCategory, serializeProducts } from "@/lib/serialize";
import type { ProductFiltersState } from "@/components/products/product-filters";

export const metadata = generateSeoMetadata({
  title: "Products",
  path: "/products",
  description:
    "Browse premium automotive spare parts — filter by category, brand, and stock status.",
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const q = first(params.q) || "";
  const categorySlug = first(params.category) || "";
  const brandSlug = first(params.brand) || "";
  const stock = first(params.stock) || "all";
  const minPrice = first(params.minPrice) || "";
  const maxPrice = first(params.maxPrice) || "";
  const page = Math.max(1, Number(first(params.page) || "1") || 1);

  let status: StockStatus | undefined;
  if (stock === "in") status = "IN_STOCK";
  if (stock === "out") status = "OUT_OF_STOCK";

  const emptyResult = {
    items: [],
    total: 0,
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    totalPages: 1,
  };

  const [result, categoriesRaw, brandsRaw] = await Promise.all([
    safeQuery(
      () =>
        getProducts({
          q: q || undefined,
          categorySlug: categorySlug || undefined,
          brandSlug: brandSlug || undefined,
          status,
          page,
          pageSize: DEFAULT_PAGE_SIZE,
        }),
      emptyResult
    ),
    safeQuery(() => getCategories(), []),
    safeQuery(() => getBrands(), []),
  ]);

  const categories = categoriesRaw.map(serializeCategory);
  const brands = brandsRaw.map(serializeBrand);
  const products = serializeProducts(result.items);

  // Optional price filter client-side-safe filter when DB fetch succeeded
  const filtered = products.filter((p) => {
    const price = Number(p.price);
    if (minPrice && price < Number(minPrice)) return false;
    if (maxPrice && price > Number(maxPrice)) return false;
    return true;
  });

  const initialFilters: ProductFiltersState = {
    search: q,
    categoryId: categories.find((c) => c.slug === categorySlug)?.id || "",
    brandId: brands.find((b) => b.slug === brandSlug)?.id || "",
    stock: stock === "in" || stock === "out" ? stock : "all",
    minPrice,
    maxPrice,
  };

  return (
    <div className="container pb-20 pt-28">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Products" }]} />
      <SectionHeading
        eyebrow="Catalog"
        title="Shop Parts"
        description="Search and filter our inventory of OEM-grade automotive components."
        align="left"
      />
      <Suspense
        fallback={<div className="text-muted-foreground">Loading catalog...</div>}
      >
        <ProductsBrowser
          products={filtered}
          categories={categories}
          brands={brands}
          page={result.page}
          totalPages={result.totalPages}
          initialFilters={initialFilters}
        />
      </Suspense>
    </div>
  );
}
