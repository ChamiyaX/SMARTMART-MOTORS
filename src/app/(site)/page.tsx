import { BrandsMarquee } from "@/components/home/brands-marquee";
import { CategoriesShowcase } from "@/components/home/categories-showcase";
import { CtaBanner } from "@/components/home/cta-banner";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Hero } from "@/components/home/hero";
import { StatsCounter } from "@/components/home/stats-counter";
import { WhyUs } from "@/components/home/why-us";
import { getBrands } from "@/lib/data/brands";
import { getCategoryCoverMap, getRootCategories } from "@/lib/data/categories";
import { resolveCategoryImage } from "@/lib/category-images";
import { getFeaturedProducts } from "@/lib/data/products";
import { parseHomeStats } from "@/lib/home-stats";
import { prisma } from "@/lib/prisma";
import { organizationJsonLd, generateSeoMetadata } from "@/lib/seo";
import { safeQuery } from "@/lib/safe";
import { serializeBrand, serializeCategory, serializeProducts } from "@/lib/serialize";

export const metadata = generateSeoMetadata({
  path: "/",
  description:
    "Premium Chinese OEM automotive spare parts for Toyota, Honda, Nissan, Suzuki and more. Colombo-based with island-wide delivery.",
});

export default async function HomePage() {
  const [featuredRaw, categoriesRaw, brandsRaw, homeStatsRecord] = await Promise.all([
    safeQuery(() => getFeaturedProducts(8), []),
    safeQuery(() => getRootCategories(), []),
    safeQuery(() => getBrands(), []),
    safeQuery(
      () =>
        prisma.pageContent.findFirst({
          where: { page: "home-stats", isPublished: true },
        }),
      null
    ),
  ]);

  const homeStats = parseHomeStats(homeStatsRecord?.content);

  const featured = serializeProducts(featuredRaw);
  const coverMap = await safeQuery(
    () => getCategoryCoverMap(categoriesRaw.map((category) => category.id)),
    new Map<string, string>()
  );
  const categories = categoriesRaw.map((category) => ({
    ...serializeCategory(category),
    displayImage: resolveCategoryImage(category, coverMap.get(category.id)),
  }));
  const brands = brandsRaw.map(serializeBrand);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd()),
        }}
      />
      <Hero />
      <BrandsMarquee brands={brands} />
      <CategoriesShowcase categories={categories} />
      <FeaturedProducts products={featured} />
      <WhyUs />
      <StatsCounter
        eyebrow={homeStats.eyebrow}
        title={homeStats.title}
        description={homeStats.description}
        stats={homeStats.items}
      />
      <CtaBanner />
    </>
  );
}
