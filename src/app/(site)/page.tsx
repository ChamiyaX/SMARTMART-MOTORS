import { BrandsMarquee } from "@/components/home/brands-marquee";
import { CtaBanner } from "@/components/home/cta-banner";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Hero } from "@/components/home/hero";
import { StatsCounter } from "@/components/home/stats-counter";
import { WhyUs } from "@/components/home/why-us";
import { getBrands } from "@/lib/data/brands";
import { getFeaturedProducts } from "@/lib/data/products";
import { getMessagingSettings } from "@/lib/data/settings";
import { parseHomeStats } from "@/lib/home-stats";
import { prisma } from "@/lib/prisma";
import { organizationJsonLd, generateSeoMetadata } from "@/lib/seo";
import { safeQuery } from "@/lib/safe";
import { serializeBrand, serializeProducts } from "@/lib/serialize";

export const metadata = generateSeoMetadata({
  path: "/",
  description:
    "Premium Chinese OEM automotive spare parts for Toyota, Honda, Nissan, Suzuki and more. Colombo-based with island-wide delivery.",
});

export default async function HomePage() {
  const [featuredRaw, brandsRaw, homeStatsRecord, messaging] = await Promise.all([
    safeQuery(() => getFeaturedProducts(8), []),
    safeQuery(() => getBrands(), []),
    safeQuery(
      () =>
        prisma.pageContent.findFirst({
          where: { page: "home-stats", isPublished: true },
        }),
      null
    ),
    safeQuery(() => getMessagingSettings(), { enabled: true }),
  ]);

  const homeStats = parseHomeStats(homeStatsRecord?.content);

  const featured = serializeProducts(featuredRaw);
  const brands = brandsRaw.map(serializeBrand);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd()),
        }}
      />
      <Hero messagingEnabled={messaging.enabled} />
      <BrandsMarquee brands={brands} />
      <FeaturedProducts products={featured} />
      <WhyUs />
      <StatsCounter
        eyebrow={homeStats.eyebrow}
        title={homeStats.title}
        description={homeStats.description}
        stats={homeStats.items}
      />
      <CtaBanner messagingEnabled={messaging.enabled} />
    </>
  );
}
