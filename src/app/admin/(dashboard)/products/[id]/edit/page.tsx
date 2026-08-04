import { notFound } from "next/navigation";

import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/app/admin/(dashboard)/products/_components/product-form";
import { DB_CONNECT_MESSAGE } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  let product = null;
  let categories: { id: string; name: string }[] = [];
  let brands: { id: string; name: string }[] = [];
  let dbError: string | null = null;

  try {
    [product, categories, brands] = await Promise.all([
      prisma.product.findUnique({
        where: { id },
        include: { images: { orderBy: { sortOrder: "asc" } } },
      }),
      prisma.category.findMany({
        where: { isActive: true },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
      prisma.brand.findMany({
        where: { isActive: true },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
    ]);
  } catch {
    dbError = DB_CONNECT_MESSAGE;
  }

  if (!dbError && !product) notFound();

  return (
    <div>
      <PageHeader
        title="Edit product"
        description={product?.name || "Update catalog entry"}
      />
      {dbError && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {dbError}
        </div>
      )}
      {product && (
        <ProductForm product={product} categories={categories} brands={brands} />
      )}
    </div>
  );
}
