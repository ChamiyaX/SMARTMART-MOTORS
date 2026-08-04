import { BrandsMarquee } from "@/components/home/brands-marquee";
import { CategoriesShowcase } from "@/components/home/categories-showcase";
import { CtaBanner } from "@/components/home/cta-banner";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Hero } from "@/components/home/hero";
import { StatsCounter } from "@/components/home/stats-counter";
import { WhyUs } from "@/components/home/why-us";
import { getBrands } from "@/lib/data/brands";
import { getRootCategories } from "@/lib/data/categories";
import { getFeaturedProducts } from "@/lib/data/products";
import { organizationJsonLd, generateSeoMetadata } from "@/lib/seo";
import { safeQuery } from "@/lib/safe";
import { serializeBrand, serializeCategory, serializeProducts } from "@/lib/serialize";

export const metadata = generateSeoMetadata({
  path: "/",
  description:
    "Premium Chinese OEM automotive spare parts for Toyota, Honda, Nissan, Suzuki and more. Colombo-based with island-wide delivery.",
});

export default async function HomePage() {
  const [featuredRaw, categoriesRaw, brandsRaw] = await Promise.all([
    safeQuery(() => getFeaturedProducts(8), []),
    safeQuery(() => getRootCategories(), []),
    safeQuery(() => getBrands(), []),
  ]);

  const featured = serializeProducts(featuredRaw);
  const categories = categoriesRaw.map(serializeCategory);
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
      <StatsCounter />
      <CtaBanner />
    </>
  );
}
