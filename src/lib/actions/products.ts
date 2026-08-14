"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";

import { requireAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { revalidateCatalogue } from "@/lib/revalidate";
import { slugify } from "@/lib/utils";
import { createProductSchema, updateProductSchema } from "@/lib/validations/product";

async function writeAudit(
  userId: string,
  action: string,
  entityId: string,
  metadata?: Prisma.InputJsonValue
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity: "Product",
        entityId,
        metadata,
      },
    });
  } catch {
    // non-fatal
  }
}

export type ActionResult = {
  success: boolean;
  error?: string;
  id?: string;
};

export async function createProduct(input: unknown): Promise<ActionResult> {
  const session = await requireAdminSession();
  const parsed = createProductSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message || "Validation failed",
    };
  }

  const data = parsed.data;
  const slug = data.slug || slugify(data.name);

  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        sku: data.sku,
        description: data.description,
        richDescription: data.richDescription ?? null,
        price: data.price,
        compareAtPrice: data.compareAtPrice ?? null,
        discount: data.discount ?? null,
        stockStatus: data.stockStatus,
        stockQuantity: data.stockQuantity,
        isFeatured: data.isFeatured,
        isNewArrival: data.isNewArrival,
        isPopular: data.isPopular,
        isActive: data.isActive,
        categoryId: data.categoryId,
        brandId: data.brandId,
        metaTitle: data.metaTitle ?? null,
        metaDescription: data.metaDescription ?? null,
        specifications: (data.specifications as Prisma.InputJsonValue) ?? undefined,
        compatibleModels: data.compatibleModels,
        tags: data.tags,
        images: data.images?.length
          ? {
              create: data.images.map((img, index) => ({
                url: img.url,
                publicId: img.publicId ?? null,
                alt: img.alt ?? data.name,
                sortOrder: img.sortOrder ?? index,
                isPrimary: img.isPrimary ?? index === 0,
                width: img.width ?? null,
                height: img.height ?? null,
              })),
            }
          : undefined,
      },
    });

    await writeAudit(session.user.id, "CREATE", product.id, { name: product.name });
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidateCatalogue();
    return { success: true, id: product.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create product";
    return { success: false, error: message };
  }
}

export async function updateProduct(input: unknown): Promise<ActionResult> {
  const session = await requireAdminSession();
  const parsed = updateProductSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message || "Validation failed",
    };
  }

  const { id, images, ...rest } = parsed.data;

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(rest.name !== undefined && { name: rest.name }),
        ...(rest.slug !== undefined && { slug: rest.slug }),
        ...(rest.sku !== undefined && { sku: rest.sku }),
        ...(rest.description !== undefined && { description: rest.description }),
        ...(rest.richDescription !== undefined && {
          richDescription: rest.richDescription,
        }),
        ...(rest.price !== undefined && { price: rest.price }),
        ...(rest.compareAtPrice !== undefined && {
          compareAtPrice: rest.compareAtPrice,
        }),
        ...(rest.discount !== undefined && { discount: rest.discount }),
        ...(rest.stockStatus !== undefined && { stockStatus: rest.stockStatus }),
        ...(rest.stockQuantity !== undefined && {
          stockQuantity: rest.stockQuantity,
        }),
        ...(rest.isFeatured !== undefined && { isFeatured: rest.isFeatured }),
        ...(rest.isNewArrival !== undefined && {
          isNewArrival: rest.isNewArrival,
        }),
        ...(rest.isPopular !== undefined && { isPopular: rest.isPopular }),
        ...(rest.isActive !== undefined && { isActive: rest.isActive }),
        ...(rest.categoryId !== undefined && { categoryId: rest.categoryId }),
        ...(rest.brandId !== undefined && { brandId: rest.brandId }),
        ...(rest.metaTitle !== undefined && { metaTitle: rest.metaTitle }),
        ...(rest.metaDescription !== undefined && {
          metaDescription: rest.metaDescription,
        }),
        ...(rest.specifications !== undefined && {
          specifications: rest.specifications as Prisma.InputJsonValue,
        }),
        ...(rest.compatibleModels !== undefined && {
          compatibleModels: rest.compatibleModels,
        }),
        ...(rest.tags !== undefined && { tags: rest.tags }),
        ...(images !== undefined && {
          images: {
            deleteMany: {},
            create: images.map((img, index) => ({
              url: img.url,
              publicId: img.publicId ?? null,
              alt: img.alt ?? rest.name ?? undefined,
              sortOrder: img.sortOrder ?? index,
              isPrimary: img.isPrimary ?? index === 0,
              width: img.width ?? null,
              height: img.height ?? null,
            })),
          },
        }),
      },
    });

    await writeAudit(session.user.id, "UPDATE", product.id, { name: product.name });
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}/edit`);
    revalidatePath("/admin");
    revalidateCatalogue();
    return { success: true, id: product.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update product";
    return { success: false, error: message };
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const session = await requireAdminSession();

  try {
    await prisma.product.delete({ where: { id } });
    await writeAudit(session.user.id, "DELETE", id);
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidateCatalogue();
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete product";
    return { success: false, error: message };
  }
}
