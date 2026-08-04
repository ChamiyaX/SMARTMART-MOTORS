import { cache } from "react";

import { prisma } from "@/lib/prisma";

export const getCategories = cache(
  async (options: { includeInactive?: boolean } = {}) => {
    return prisma.category.findMany({
      where: options.includeInactive ? undefined : { isActive: true },
      include: {
        parent: true,
        _count: { select: { products: { where: { isActive: true } } } },
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  }
);

export const getCategoryBySlug = cache(async (slug: string) => {
  return prisma.category.findFirst({
    where: { slug, isActive: true },
    include: {
      children: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
      parent: true,
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });
});

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
    include: {
      children: true,
      parent: true,
    },
  });
}

export const getRootCategories = cache(async () => {
  return prisma.category.findMany({
    where: { isActive: true, parentId: null },
    include: {
      children: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
      _count: { select: { products: { where: { isActive: true } } } },
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
});
