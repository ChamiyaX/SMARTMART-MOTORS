import type { Prisma, StockStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

export type ProductListParams = {
  q?: string;
  categorySlug?: string;
  brandSlug?: string;
  featured?: boolean;
  newArrival?: boolean;
  popular?: boolean;
  status?: StockStatus;
  page?: number;
  pageSize?: number;
  sort?: "newest" | "price_asc" | "price_desc" | "popular" | "name";
};

const productInclude = {
  category: true,
  brand: true,
  images: {
    orderBy: [{ isPrimary: "desc" as const }, { sortOrder: "asc" as const }],
  },
} satisfies Prisma.ProductInclude;

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

function buildOrderBy(
  sort: ProductListParams["sort"]
): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "price_asc":
      return { price: "asc" };
    case "price_desc":
      return { price: "desc" };
    case "popular":
      return { inquiryCount: "desc" };
    case "name":
      return { name: "asc" };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
}

export async function getProducts(params: ProductListParams = {}) {
  const {
    q,
    categorySlug,
    brandSlug,
    featured,
    newArrival,
    popular,
    status,
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    sort = "newest",
  } = params;

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(featured !== undefined ? { isFeatured: featured } : {}),
    ...(newArrival !== undefined ? { isNewArrival: newArrival } : {}),
    ...(popular !== undefined ? { isPopular: popular } : {}),
    ...(status ? { stockStatus: status } : {}),
    ...(categorySlug ? { category: { slug: categorySlug, isActive: true } } : {}),
    ...(brandSlug ? { brand: { slug: brandSlug, isActive: true } } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { sku: { contains: q, mode: "insensitive" } },
            { tags: { has: q.toLowerCase() } },
          ],
        }
      : {}),
  };

  const skip = (page - 1) * pageSize;

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: buildOrderBy(sort),
      skip,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isActive: true },
    include: productInclude,
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });
}

export async function getFeaturedProducts(limit = 8) {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: productInclude,
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
}

export async function getNewArrivals(limit = 8) {
  return prisma.product.findMany({
    where: { isActive: true, isNewArrival: true },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getPopularProducts(limit = 8) {
  return prisma.product.findMany({
    where: { isActive: true, isPopular: true },
    include: productInclude,
    orderBy: [{ inquiryCount: "desc" }, { viewCount: "desc" }],
    take: limit,
  });
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit = 4
) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      categoryId,
      NOT: { id: productId },
    },
    include: productInclude,
    orderBy: { isFeatured: "desc" },
    take: limit,
  });
}

export async function incrementProductView(id: string) {
  return prisma.product.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
    select: { id: true, viewCount: true },
  });
}
