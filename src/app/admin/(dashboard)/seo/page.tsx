import { PageHeader } from "@/components/admin/page-header";
import { SeoForm } from "./seo-form";
import { DB_CONNECT_MESSAGE } from "@/lib/admin";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SeoPage() {
  let initial = {
    defaultMetaTitle: `${SITE_NAME} | ${SITE_TAGLINE}`,
    defaultMetaDescription: SITE_TAGLINE,
    ogImage: "",
    siteName: SITE_NAME,
  };
  let dbError: string | null = null;

  try {
    const setting = await prisma.setting.findUnique({ where: { key: "seo" } });
    if (setting?.value && typeof setting.value === "object") {
      const value = setting.value as Record<string, string>;
      initial = {
        defaultMetaTitle: value.defaultMetaTitle || initial.defaultMetaTitle,
        defaultMetaDescription:
          value.defaultMetaDescription || initial.defaultMetaDescription,
        ogImage: value.ogImage || "",
        siteName: value.siteName || SITE_NAME,
      };
    }
  } catch {
    dbError = DB_CONNECT_MESSAGE;
  }

  return (
    <div>
      <PageHeader
        title="SEO"
        description="Default meta tags and Open Graph image for the storefront."
      />
      {dbError && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {dbError}
        </div>
      )}
      <SeoForm initial={initial} />
    </div>
  );
}
