import { PageHeader } from "@/components/admin/page-header";
import { CategoriesManager } from "./categories-manager";
import { DB_CONNECT_MESSAGE } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  let categories: Awaited<ReturnType<typeof loadCategories>> = [];
  let dbError: string | null = null;

  try {
    categories = await loadCategories();
  } catch {
    dbError = DB_CONNECT_MESSAGE;
  }

  return (
    <div>
      <PageHeader title="Categories" description="Organize the spare parts taxonomy." />
      {dbError && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {dbError}
        </div>
      )}
      <CategoriesManager categories={categories} />
    </div>
  );
}

function loadCategories() {
  return prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });
}
