import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, MessageCircle } from "lucide-react";

import { ProductDescriptionSection } from "@/components/products/product-description-section";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductMobileBar } from "@/components/products/product-mobile-bar";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductSpecsList } from "@/components/products/product-specs-list";
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
    <div className="container pb-36 pt-20 sm:px-6 sm:pb-20 sm:pt-28 lg:pb-20">
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

      <Link
        href="/products"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-primary sm:hidden"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to products
      </Link>

      <Breadcrumb
        className="mb-6 hidden sm:block"
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.name },
        ]}
      />

      <div className="grid gap-5 lg:grid-cols-2 lg:gap-10">
        <div className="order-1 space-y-3 lg:order-2 lg:col-start-2">
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
          <div className="flex items-baseline gap-3">
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
          <p className="text-xs text-muted-foreground sm:text-sm">SKU: {product.sku}</p>
        </div>

        <div className="order-2 lg:sticky lg:top-24 lg:order-1 lg:col-start-1 lg:row-span-2 lg:self-start">
          <ProductGallery images={product.images || []} alt={product.name} />
        </div>

        <div className="order-3 space-y-5 sm:space-y-6 lg:order-3 lg:col-start-2">
          <ProductDescriptionSection description={product.description} />

          {product.compatibleModels.length ? (
            <div className="rounded-xl p-4 glass sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0">
              <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-wider text-white">
                Compatible models
              </h2>
              <p className="break-words text-sm leading-relaxed text-muted-foreground">
                {product.compatibleModels.join(", ")}
              </p>
            </div>
          ) : null}

          <ProductSpecsList specs={specs} />

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
        productName={product.name}
      />

      {related.length ? (
        <section className="mt-10 sm:mt-20">
          <SectionHeading
            eyebrow="More like this"
            title="Related products"
            description="Other parts customers often view with this item."
            align="left"
            className="mb-6 sm:mb-10"
          />
          <ProductGrid products={related} className="gap-3 sm:gap-5" />
        </section>
      ) : null}
    </div>
  );
}
