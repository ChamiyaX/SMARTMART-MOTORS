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
    <div className="container pb-20 pt-28">
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

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images || []} alt={product.name} />

        <div className="space-y-6">
          <div className="space-y-3">
            {product.brand?.name ? (
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {product.brand.name}
              </p>
            ) : null}
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
              {product.name}
            </h1>
            <div className="flex flex-wrap gap-2">
              {product.isFeatured ? <Badge variant="featured">Featured</Badge> : null}
              {product.isNewArrival ? <Badge variant="new">New</Badge> : null}
              <Badge variant="outline">{product.stockStatus.replaceAll("_", " ")}</Badge>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold text-primary">
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
          <ProductDescription description={product.description} />

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
            <div className="rounded-xl p-5 glass">
              <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-white">
                Specifications
              </h2>
              <dl className="space-y-2">
                {specs.map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between gap-4 border-b border-white/5 py-2 text-sm last:border-0"
                  >
                    <dt className="text-muted-foreground">{key}</dt>
                    <dd className="text-right text-white">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
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

      {related.length ? (
        <section className="mt-20">
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
