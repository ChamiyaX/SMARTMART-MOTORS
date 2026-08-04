import type { MetadataRoute } from "next";

import { getCategories } from "@/lib/data/categories";
import { getProducts } from "@/lib/data/products";
import { SITE_CONFIG } from "@/lib/constants";
import { safeQuery } from "@/lib/safe";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_CONFIG.url.replace(/\/$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/products",
    "/categories",
    "/about",
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/products" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const [productsResult, categories] = await Promise.all([
    safeQuery(() => getProducts({ page: 1, pageSize: 500, sort: "newest" }), {
      items: [],
      total: 0,
      page: 1,
      pageSize: 500,
      totalPages: 1,
    }),
    safeQuery(() => getCategories(), []),
  ]);

  const productRoutes: MetadataRoute.Sitemap = productsResult.items.map((product) => ({
    url: `${base}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${base}/categories/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
