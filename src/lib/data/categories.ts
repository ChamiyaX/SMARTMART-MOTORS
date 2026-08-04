import { prisma } from "@/lib/prisma";

export async function getCategories(options: { includeInactive?: boolean } = {}) {
  return prisma.category.findMany({
    where: options.includeInactive ? undefined : { isActive: true },
    include: {
      parent: true,
      _count: { select: { products: { where: { isActive: true } } } },
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getCategoryBySlug(slug: string) {
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
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
    include: {
      children: true,
      parent: true,
    },
  });
}

export async function getRootCategories() {
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
}
