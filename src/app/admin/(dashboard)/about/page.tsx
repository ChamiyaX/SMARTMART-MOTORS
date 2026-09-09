import { PageHeader } from "@/components/admin/page-header";
import { AboutPageForm } from "./about-page-form";
import { parseAboutContent } from "@/lib/about-page";
import { DB_CONNECT_MESSAGE } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AboutAdminPage() {
  let page = null;
  let dbError: string | null = null;

  try {
    page = await prisma.pageContent.findUnique({ where: { page: "about" } });
  } catch {
    dbError = DB_CONNECT_MESSAGE;
  }

  const content = parseAboutContent(page?.content, page?.title);

  return (
    <div>
      <PageHeader
        title="About Page"
        description="Edit the public About page — headline, story, values, hero image, and SEO."
      />

      {dbError && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {dbError}
        </div>
      )}

      <AboutPageForm
        initial={{
          title: page?.title || content.headline,
          seoTitle: page?.seoTitle || "",
          seoDescription: page?.seoDescription || "",
          isPublished: page?.isPublished ?? true,
          content,
        }}
      />
    </div>
  );
}
