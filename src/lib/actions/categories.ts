"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { revalidateCatalogue } from "@/lib/revalidate";
import { slugify } from "@/lib/utils";
import { createCategorySchema, updateCategorySchema } from "@/lib/validations/category";

export type ActionResult = {
  success: boolean;
  error?: string;
  id?: string;
};

export async function createCategory(input: unknown): Promise<ActionResult> {
  await requireAdminSession();
  const parsed = createCategorySchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message || "Validation failed",
    };
  }

  const data = parsed.data;
  const slug = data.slug || slugify(data.name);

  try {
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description || null,
        image: data.image || null,
        parentId: data.parentId || null,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
      },
    });
    revalidatePath("/admin/categories");
    revalidateCatalogue();
    return { success: true, id: category.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create category",
    };
  }
}

export async function updateCategory(input: unknown): Promise<ActionResult> {
  await requireAdminSession();
  const parsed = updateCategorySchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message || "Validation failed",
    };
  }

  const { id, ...data } = parsed.data;

  try {
    await prisma.category.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.image !== undefined && { image: data.image || null }),
        ...(data.parentId !== undefined && { parentId: data.parentId || null }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        ...(data.seoTitle !== undefined && { seoTitle: data.seoTitle }),
        ...(data.seoDescription !== undefined && {
          seoDescription: data.seoDescription,
        }),
      },
    });
    revalidatePath("/admin/categories");
    revalidateCatalogue();
    return { success: true, id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update category",
    };
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  await requireAdminSession();

  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
    revalidateCatalogue();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete category",
    };
  }
}
