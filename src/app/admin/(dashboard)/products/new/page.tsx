import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/app/admin/(dashboard)/products/_components/product-form";
import { DB_CONNECT_MESSAGE } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  let categories: { id: string; name: string }[] = [];
  let brands: { id: string; name: string }[] = [];
  let dbError: string | null = null;

  try {
    [categories, brands] = await Promise.all([
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

  return (
    <div>
      <PageHeader
        title="New product"
        description="Add a product to the SmartMart catalog."
      />
      {dbError && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {dbError}
        </div>
      )}
      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}
