import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";

import { ProductDescription } from "@/components/products/product-description";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductMobileBar } from "@/components/products/product-mobile-bar";
import { ProductGrid } from "@/components/products/product-grid";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getProductBySlug,
  getRelatedProducts,
  incrementProductView,
} from "@/lib/data/products";
import { getWhatsAppLink, SITE_CONFIG } from "@/lib/constants";
import { formatPrice, resolveMediaUrl } from "@/lib/utils";
import { breadcrumbJsonLd, generateSeoMetadata, productJsonLd } from "@/lib/seo";
import { safeQuery } from "@/lib/safe";
import { serializeProduct, serializeProducts } from "@/lib/serialize";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await safeQuery(() => getProductBySlug(slug), null);
  if (!product) {
    return generateSeoMetadata({ title: "Product", path: `/products/${slug}` });
  }
  return generateSeoMetadata({
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.description,
    path: `/products/${product.slug}`,
    image: product.images?.[0]?.url ? resolveMediaUrl(product.images[0].url) : undefined,
  });
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const raw = await safeQuery(() => getProductBySlug(slug), null);
  if (!raw) notFound();

  const product = serializeProduct(raw);
  void safeQuery(() => incrementProductView(raw.id), null);

  const relatedRaw = await safeQuery(
    () => getRelatedProducts(raw.id, raw.categoryId, 4),
    []
  );
  const related = serializeProducts(relatedRaw);

  const availability =
    product.stockStatus === "OUT_OF_STOCK"
      ? "OutOfStock"
      : product.stockStatus === "PRE_ORDER"
        ? "PreOrder"
        : product.stockStatus === "LOW_STOCK"
          ? "LimitedAvailability"
          : "InStock";

  const waMessage = `Hi ${SITE_CONFIG.name}, I'm interested in "${product.name}" (SKU: ${product.sku}). Is it available?`;
  const specs =
    product.specifications && typeof product.specifications === "object"
      ? Object.entries(product.specifications)
      : [];

  return (
    <div className="container px-4 pb-32 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            productJsonLd({
              name: product.name,
              description: product.description,
              sku: product.sku,
              slug: product.slug,
              price: product.price,
              image: product.images?.[0]?.url
                ? resolveMediaUrl(product.images[0].url)
                : undefined,
              brand: product.brand?.name,
              availability,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Products", path: "/products" },
              { name: product.name, path: `/products/${product.slug}` },
            ])
          ),
        }}
      />

      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.name },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
        <ProductGallery images={product.images || []} alt={product.name} />

        <div className="space-y-5 sm:space-y-6">
          <div className="space-y-2 sm:space-y-3">
            {product.brand?.name ? (
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {product.brand.name}
              </p>
            ) : null}
            <h1 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>
            <div className="flex flex-wrap gap-2">
              {product.isFeatured ? <Badge variant="featured">Featured</Badge> : null}
              {product.isNewArrival ? <Badge variant="new">New</Badge> : null}
              <Badge variant="outline">{product.stockStatus.replaceAll("_", " ")}</Badge>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-display text-2xl font-bold text-primary sm:text-3xl">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice != null &&
            Number(product.compareAtPrice) > Number(product.price) ? (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            ) : null}
          </div>

          <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
          <ProductDescription
            description={product.description}
            className="text-sm sm:text-base"
          />

          {product.compatibleModels.length ? (
            <div>
              <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-wider text-white">
                Compatible models
              </h2>
              <p className="text-sm text-muted-foreground">
                {product.compatibleModels.join(", ")}
              </p>
            </div>
          ) : null}

          {specs.length ? (
            <div className="rounded-xl p-4 glass sm:p-5">
              <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-white">
                Specifications
              </h2>
              <dl className="space-y-2">
                {specs.map(([key, value]) => (
                  <div
                    key={key}
                    className="flex flex-col gap-0.5 border-b border-white/5 py-2.5 text-sm last:border-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
                  >
                    <dt className="text-muted-foreground">{key}</dt>
                    <dd className="break-words text-white sm:max-w-[60%] sm:text-right">
                      {String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          <div className="hidden flex-wrap gap-3 lg:flex">
            <Button asChild variant="glow" size="lg">
              <a
                href={getWhatsAppLink(waMessage)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                Inquire on WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </div>

      <ProductMobileBar
        price={product.price}
        compareAtPrice={product.compareAtPrice}
        whatsappHref={getWhatsAppLink(waMessage)}
      />

      {related.length ? (
        <section className="mt-12 sm:mt-20">
          <SectionHeading
            eyebrow="More like this"
            title="Related products"
            description="Other parts customers often view with this item."
          />
          <ProductGrid products={related} />
        </section>
      ) : null}
    </div>
  );
}
