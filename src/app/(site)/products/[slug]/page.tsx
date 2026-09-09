import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";

import { ProductDescription } from "@/components/products/product-description";
import { ProductGallery } from "@/components/products/product-gallery";
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
import { getMessagingSettings } from "@/lib/data/settings";
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

  const [relatedRaw, messaging] = await Promise.all([
    safeQuery(() => getRelatedProducts(raw.id, raw.categoryId, 4), []),
    safeQuery(() => getMessagingSettings(), { enabled: true }),
  ]);
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
    <div className="container min-w-0 overflow-x-clip pb-20 pt-28">
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

      <SectionHeading
        eyebrow={product.brand?.name || "Product"}
        title={product.name}
        align="left"
        className="max-w-none"
      />

      <div className="grid w-full min-w-0 grid-cols-1 items-start gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images || []} alt={product.name} />

        <div className="w-full min-w-0 max-w-full space-y-6">
          <div className="flex flex-wrap gap-2">
            {product.isFeatured ? <Badge variant="featured">Featured</Badge> : null}
            {product.isNewArrival ? <Badge variant="new">New</Badge> : null}
            <Badge variant="outline">{product.stockStatus.replaceAll("_", " ")}</Badge>
          </div>

          <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
            <span className="font-display text-2xl font-bold text-primary sm:text-3xl">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice != null &&
            Number(product.compareAtPrice) > Number(product.price) ? (
              <span className="text-base text-muted-foreground line-through sm:text-lg">
                {formatPrice(product.compareAtPrice)}
              </span>
            ) : null}
          </div>

          <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>

          <ProductDescription description={product.description} />

          {product.compatibleModels.length ? (
            <div>
              <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-wider text-white">
                Compatible models
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {product.compatibleModels.join(", ")}
              </p>
            </div>
          ) : null}

          {specs.length ? (
            <div className="min-w-0 rounded-xl p-4 glass sm:p-6">
              <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-white">
                Specifications
              </h2>
              <dl className="space-y-2">
                {specs.map(([key, value]) => (
                  <div
                    key={key}
                    className="flex flex-col gap-1 border-b border-white/5 py-2 text-sm last:border-0 sm:flex-row sm:justify-between sm:gap-4"
                  >
                    <dt className="text-muted-foreground">{key}</dt>
                    <dd className="break-words text-white sm:text-right">
                      {String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          {messaging.enabled ? (
            <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                asChild
                variant="glow"
                size="lg"
                className="h-12 w-full min-w-0 whitespace-normal px-4 sm:w-auto sm:whitespace-nowrap sm:px-8"
              >
                <a
                  href={getWhatsAppLink(waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  Inquire on WhatsApp
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 w-full min-w-0 sm:w-auto"
              >
                <Link href="/contact">Contact us</Link>
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      {related.length ? (
        <section className="mt-20 w-full min-w-0 max-w-full">
          <SectionHeading
            eyebrow="More like this"
            title="Related products"
            description="Other parts customers often view with this item."
            align="left"
            className="max-w-none"
          />
          <ProductGrid products={related} className="w-full min-w-0" />
        </section>
      ) : null}
    </div>
  );
}
