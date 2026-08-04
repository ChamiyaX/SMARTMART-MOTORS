import { PageHeader } from "@/components/admin/page-header";
import { BrandsManager } from "./brands-manager";
import { DB_CONNECT_MESSAGE } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  let brands: Awaited<ReturnType<typeof loadBrands>> = [];
  let dbError: string | null = null;

  try {
    brands = await loadBrands();
  } catch {
    dbError = DB_CONNECT_MESSAGE;
  }

  return (
    <div>
      <PageHeader
        title="Brands"
        description="Manage partner and OEM-compatible brands."
      />
      {dbError && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {dbError}
        </div>
      )}
      <BrandsManager brands={brands} />
    </div>
  );
}

function loadBrands() {
  return prisma.brand.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });
}
