import { PageHeader } from "@/components/admin/page-header";
import { FaqsManager } from "./faqs-manager";
import { DB_CONNECT_MESSAGE } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function FaqsPage() {
  let faqs: Awaited<ReturnType<typeof prisma.faq.findMany>> = [];
  let dbError: string | null = null;

  try {
    faqs = await prisma.faq.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  } catch {
    dbError = DB_CONNECT_MESSAGE;
  }

  return (
    <div>
      <PageHeader
        title="FAQs"
        description="Manage frequently asked questions shown on the storefront."
      />
      {dbError && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {dbError}
        </div>
      )}
      <FaqsManager faqs={faqs} />
    </div>
  );
}
