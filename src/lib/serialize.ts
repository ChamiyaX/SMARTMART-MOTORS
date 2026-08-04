import type { Brand, Category, Faq, Product, ProductImage } from "@/types";

function toIso(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : String(value);
}

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  if (value != null && typeof value === "object" && "toNumber" in value) {
    return (value as { toNumber: () => number }).toNumber();
  }
  return Number(value);
}

function toNumberOrNull(value: unknown): number | null {
  if (value == null) return null;
  const n = toNumber(value);
  return Number.isFinite(n) ? n : null;
}

export function serializeBrand(brand: {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  website: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}): Brand {
  return {
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    logo: brand.logo,
    description: brand.description,
    website: brand.website,
    isActive: brand.isActive,
    sortOrder: brand.sortOrder,
    createdAt: toIso(brand.createdAt),
    updatedAt: toIso(brand.updatedAt),
  };
}

export function serializeCategory(category: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  isActive: boolean;
  sortOrder: number;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}): Category {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: category.image,
    parentId: category.parentId,
    isActive: category.isActive,
    sortOrder: category.sortOrder,
    seoTitle: category.seoTitle,
    seoDescription: category.seoDescription,
    createdAt: toIso(category.createdAt),
    updatedAt: toIso(category.updatedAt),
  };
}

function serializeImage(image: {
  id: string;
  productId: string;
  url: string;
  publicId: string | null;
  alt: string | null;
  sortOrder: number;
  isPrimary: boolean;
  width: number | null;
  height: number | null;
  createdAt: Date | string;
}): ProductImage {
  return {
    id: image.id,
    productId: image.productId,
    url: image.url,
    publicId: image.publicId,
    alt: image.alt,
    sortOrder: image.sortOrder,
    isPrimary: image.isPrimary,
    width: image.width,
    height: image.height,
    createdAt: toIso(image.createdAt),
  };
}

type ProductLike = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  richDescription: string | null;
  price: unknown;
  compareAtPrice: unknown;
  discount: unknown;
  stockStatus: Product["stockStatus"];
  stockQuantity: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isPopular: boolean;
  isActive: boolean;
  categoryId: string;
  brandId: string;
  metaTitle: string | null;
  metaDescription: string | null;
  specifications: unknown;
  compatibleModels: string[];
  tags: string[];
  viewCount: number;
  inquiryCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  images?: Parameters<typeof serializeImage>[0][];
  category?: Parameters<typeof serializeCategory>[0] | null;
  brand?: Parameters<typeof serializeBrand>[0] | null;
};

export function serializeProduct(product: ProductLike): Product {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    description: product.description,
    richDescription: product.richDescription,
    price: toNumber(product.price),
    compareAtPrice: toNumberOrNull(product.compareAtPrice),
    discount: toNumberOrNull(product.discount),
    stockStatus: product.stockStatus,
    stockQuantity: product.stockQuantity,
    isFeatured: product.isFeatured,
    isNewArrival: product.isNewArrival,
    isPopular: product.isPopular,
    isActive: product.isActive,
    categoryId: product.categoryId,
    brandId: product.brandId,
    metaTitle: product.metaTitle,
    metaDescription: product.metaDescription,
    specifications:
      product.specifications && typeof product.specifications === "object"
        ? (product.specifications as Record<string, unknown>)
        : null,
    compatibleModels: product.compatibleModels ?? [],
    tags: product.tags ?? [],
    viewCount: product.viewCount,
    inquiryCount: product.inquiryCount,
    createdAt: toIso(product.createdAt),
    updatedAt: toIso(product.updatedAt),
    images: product.images?.map(serializeImage),
    category: product.category ? serializeCategory(product.category) : null,
    brand: product.brand ? serializeBrand(product.brand) : null,
  };
}

export function serializeProducts(products: ProductLike[]): Product[] {
  return products.map(serializeProduct);
}

export function serializeFaq(faq: {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}): Faq {
  return {
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    sortOrder: faq.sortOrder,
    isActive: faq.isActive,
    createdAt: toIso(faq.createdAt),
    updatedAt: toIso(faq.updatedAt),
  };
}
