import Link from "next/link";

import { CategoryCoverImage } from "@/components/shared/category-cover-image";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { FadeIn } from "@/components/shared/fade-in";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { resolveCategoryImage } from "@/lib/category-images";
import { getCategories, getCategoryCoverMap } from "@/lib/data/categories";
import { generateSeoMetadata } from "@/lib/seo";
import { safeQuery } from "@/lib/safe";
import { serializeCategory } from "@/lib/serialize";

export const metadata = generateSeoMetadata({
  title: "Categories",
  path: "/categories",
  description: "Browse electric tricycles and models by category.",
});

export default async function CategoriesPage() {
  const categoriesRaw = await safeQuery(() => getCategories(), []);
  const coverMap = await safeQuery(
    () => getCategoryCoverMap(categoriesRaw.map((category) => category.id)),
    new Map<string, string>()
  );
  const categories = categoriesRaw.map((category) => ({
    ...serializeCategory(category),
    displayImage: resolveCategoryImage(category, coverMap.get(category.id)),
  }));

  return (
    <div className="container pb-20 pt-28">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Categories" }]} />
      <SectionHeading
        eyebrow="Browse"
        title="Categories"
        description="Find models organized for easy browsing and comparison."
        align="left"
      />

      {!categories.length ? (
        <EmptyState
          title="No categories yet"
          description="Categories will appear once the catalog is connected."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <FadeIn key={category.id} delay={index * 0.05}>
              <Link
                href={`/categories/${category.slug}`}
                prefetch
                className="group relative block aspect-[16/10] overflow-hidden rounded-xl border border-white/10"
              >
                <CategoryCoverImage
                  src={category.displayImage}
                  alt={category.name}
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h2 className="font-display text-xl font-semibold text-white transition-colors group-hover:text-primary">
                    {category.name}
                  </h2>
                  {category.description ? (
                    <p className="mt-1 line-clamp-2 text-sm text-white/60">
                      {category.description}
                    </p>
                  ) : null}
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
