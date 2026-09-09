import { PageHeader } from "@/components/admin/page-header";
import { DB_CONNECT_MESSAGE } from "@/lib/admin";
import { parseHomeStats } from "@/lib/home-stats";
import { prisma } from "@/lib/prisma";

import { HomeStatsForm } from "./home-stats-form";

export const dynamic = "force-dynamic";

export default async function HomeStatsPage() {
  let record = null;
  let dbError: string | null = null;

  try {
    record = await prisma.pageContent.findUnique({ where: { page: "home-stats" } });
  } catch {
    dbError = DB_CONNECT_MESSAGE;
  }

  const content = parseHomeStats(record?.content);

  return (
    <div>
      <PageHeader
        title="Home Stats"
        description='Edit the "By the numbers" section on the home page.'
      />
      {dbError && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {dbError}
        </div>
      )}
      <HomeStatsForm
        initial={{
          isPublished: record?.isPublished ?? true,
          content,
        }}
      />
    </div>
  );
}
