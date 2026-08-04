export type StockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "PRE_ORDER";

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  publicId: string | null;
  alt: string | null;
  sortOrder: number;
  isPrimary: boolean;
  width: number | null;
  height: number | null;
  createdAt: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  website: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
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
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  richDescription: string | null;
  /** Serialized Decimal from Prisma */
  price: number | string;
  compareAtPrice: number | string | null;
  discount: number | string | null;
  stockStatus: StockStatus;
  stockQuantity: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isPopular: boolean;
  isActive: boolean;
  categoryId: string;
  brandId: string;
  metaTitle: string | null;
  metaDescription: string | null;
  specifications: Record<string, unknown> | null;
  compatibleModels: string[];
  tags: string[];
  viewCount: number;
  inquiryCount: number;
  createdAt: string;
  updatedAt: string;
  images?: ProductImage[];
  category?: Category | null;
  brand?: Brand | null;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
