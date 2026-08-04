import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ProductsBrowser } from "@/components/products/products-browser";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SectionHeading } from "@/components/shared/section-heading";
import { getBrands } from "@/lib/data/brands";
import { getCategoryBySlug } from "@/lib/data/categories";
import { getProducts } from "@/lib/data/products";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { breadcrumbJsonLd, generateSeoMetadata } from "@/lib/seo";
import { safeQuery } from "@/lib/safe";
import { serializeBrand, serializeCategory, serializeProducts } from "@/lib/serialize";
import type { ProductFiltersState } from "@/components/products/product-filters";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await safeQuery(() => getCategoryBySlug(slug), null);
  if (!category) {
    return generateSeoMetadata({ title: "Category", path: `/categories/${slug}` });
  }
  return generateSeoMetadata({
    title: category.seoTitle || category.name,
    description: category.seoDescription || category.description || undefined,
    path: `/categories/${category.slug}`,
    image: category.image,
  });
}

export default async function CategoryDetailPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, Number(first(sp.page) || "1") || 1);
  const q = first(sp.q) || "";
  const brandSlug = first(sp.brand) || "";

  const categoryRaw = await safeQuery(() => getCategoryBySlug(slug), null);
  if (!categoryRaw) notFound();

  const category = serializeCategory(categoryRaw);

  const emptyResult = {
    items: [],
    total: 0,
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    totalPages: 1,
  };

  const [result, brandsRaw] = await Promise.all([
    safeQuery(
      () =>
        getProducts({
          categorySlug: slug,
          brandSlug: brandSlug || undefined,
          q: q || undefined,
          page,
          pageSize: DEFAULT_PAGE_SIZE,
        }),
      emptyResult
    ),
    safeQuery(() => getBrands(), []),
  ]);

  const brands = brandsRaw.map(serializeBrand);
  const products = serializeProducts(result.items);

  const initialFilters: ProductFiltersState = {
    search: q,
    categoryId: category.id,
    brandId: brands.find((b) => b.slug === brandSlug)?.id || "",
    stock: "all",
    minPrice: "",
    maxPrice: "",
  };

  return (
    <div className="container pb-20 pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Categories", path: "/categories" },
              { name: category.name, path: `/categories/${category.slug}` },
            ])
          ),
        }}
      />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          { label: category.name },
        ]}
      />
      <SectionHeading
        eyebrow="Category"
        title={category.name}
        description={
          category.description || `Shop ${category.name} parts at SmartMart Motors.`
        }
        align="left"
      />
      <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
        <ProductsBrowser
          products={products}
          categories={[category]}
          brands={brands}
          page={result.page}
          totalPages={result.totalPages}
          initialFilters={initialFilters}
        />
      </Suspense>
    </div>
  );
}
