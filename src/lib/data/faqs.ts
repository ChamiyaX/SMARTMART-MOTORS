import { prisma } from "@/lib/prisma";

export async function getFaqs(
  options: { category?: string; includeInactive?: boolean } = {}
) {
  return prisma.faq.findMany({
    where: {
      ...(options.includeInactive ? {} : { isActive: true }),
      ...(options.category ? { category: options.category } : {}),
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
}

export async function getFaqById(id: string) {
  return prisma.faq.findUnique({ where: { id } });
}

export async function getFaqCategories() {
  const faqs = await prisma.faq.findMany({
    where: { isActive: true, category: { not: null } },
    select: { category: true },
    distinct: ["category"],
  });

  return faqs
    .map((item) => item.category)
    .filter((category): category is string => Boolean(category));
}
