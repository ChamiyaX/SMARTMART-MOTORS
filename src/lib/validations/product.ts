import { z } from "zod";

import { mediaUrlSchema } from "@/lib/validations/media";

export const stockStatusEnum = z.enum([
  "IN_STOCK",
  "LOW_STOCK",
  "OUT_OF_STOCK",
  "PRE_ORDER",
]);

const productBaseSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(200),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(220)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format")
    .optional(),
  sku: z.string().trim().min(2).max(64),
  description: z
    .string()
    .min(10, "Description is required")
    .max(5000)
    .transform((value) => value.trim()),
  richDescription: z.string().max(50000).optional().nullable(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  compareAtPrice: z.coerce.number().positive().optional().nullable(),
  discount: z.coerce.number().min(0).max(100).optional().nullable(),
  stockStatus: stockStatusEnum.default("IN_STOCK"),
  stockQuantity: z.coerce.number().int().min(0).default(0),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isPopular: z.boolean().default(false),
  isActive: z.boolean().default(true),
  categoryId: z.string().min(1, "Category is required"),
  brandId: z.string().min(1, "Brand is required"),
  metaTitle: z.string().max(120).optional().nullable(),
  metaDescription: z.string().max(320).optional().nullable(),
  specifications: z.record(z.unknown()).optional().nullable(),
  compatibleModels: z.array(z.string().trim().min(1)).default([]),
  tags: z.array(z.string().trim().min(1)).default([]),
  images: z
    .array(
      z.object({
        url: mediaUrlSchema,
        publicId: z.string().optional().nullable(),
        alt: z.string().optional().nullable(),
        sortOrder: z.number().int().min(0).default(0),
        isPrimary: z.boolean().default(false),
        width: z.number().int().positive().optional().nullable(),
        height: z.number().int().positive().optional().nullable(),
      })
    )
    .optional(),
});

export const createProductSchema = productBaseSchema.refine(
  (data) => data.compareAtPrice == null || data.compareAtPrice >= data.price,
  {
    message: "Compare-at price must be greater than or equal to price",
    path: ["compareAtPrice"],
  }
);

export const updateProductSchema = productBaseSchema.partial().extend({
  id: z.string().min(1),
});

export const productQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  status: stockStatusEnum.optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(12),
  sort: z
    .enum(["newest", "price_asc", "price_desc", "popular", "name"])
    .default("newest"),
});

/** Alias used by admin product form */
export const productSchema = createProductSchema;

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
export type ProductFormInput = z.infer<typeof productSchema>;
