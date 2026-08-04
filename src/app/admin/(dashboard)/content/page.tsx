import { PageHeader } from "@/components/admin/page-header";
import { ContentEditor } from "./content-editor";
import { DB_CONNECT_MESSAGE } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  let home = null;
  let about = null;
  let dbError: string | null = null;

  try {
    [home, about] = await Promise.all([
      prisma.pageContent.findUnique({ where: { page: "home" } }),
      prisma.pageContent.findUnique({ where: { page: "about" } }),
    ]);
  } catch {
    dbError = DB_CONNECT_MESSAGE;
  }

  return (
    <div>
      <PageHeader
        title="Content"
        description="Edit home and about page copy as structured JSON."
      />
      {dbError && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {dbError}
        </div>
      )}
      <ContentEditor home={home} about={about} />
    </div>
  );
}
