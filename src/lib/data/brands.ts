import { prisma } from "@/lib/prisma";

export async function getBrands(options: { includeInactive?: boolean } = {}) {
  return prisma.brand.findMany({
    where: options.includeInactive ? undefined : { isActive: true },
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getBrandBySlug(slug: string) {
  return prisma.brand.findFirst({
    where: { slug, isActive: true },
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });
}

export async function getBrandById(id: string) {
  return prisma.brand.findUnique({
    where: { id },
  });
}
