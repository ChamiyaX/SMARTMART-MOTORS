"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { revalidateCatalogue } from "@/lib/revalidate";
import { slugify } from "@/lib/utils";
import { createBrandSchema, updateBrandSchema } from "@/lib/validations/brand";

export type ActionResult = {
  success: boolean;
  error?: string;
  id?: string;
};

export async function createBrand(input: unknown): Promise<ActionResult> {
  await requireAdminSession();
  const parsed = createBrandSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message || "Validation failed",
    };
  }

  const data = parsed.data;
  const slug = data.slug || slugify(data.name);

  try {
    const brand = await prisma.brand.create({
      data: {
        name: data.name,
        slug,
        logo: data.logo || null,
        description: data.description || null,
        website: data.website || null,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
      },
    });
    revalidatePath("/admin/brands");
    revalidateCatalogue();
    return { success: true, id: brand.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create brand",
    };
  }
}

export async function updateBrand(input: unknown): Promise<ActionResult> {
  await requireAdminSession();
  const parsed = updateBrandSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message || "Validation failed",
    };
  }

  const { id, ...data } = parsed.data;

  try {
    await prisma.brand.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.logo !== undefined && { logo: data.logo || null }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.website !== undefined && { website: data.website || null }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      },
    });
    revalidatePath("/admin/brands");
    revalidateCatalogue();
    return { success: true, id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update brand",
    };
  }
}

export async function deleteBrand(id: string): Promise<ActionResult> {
  await requireAdminSession();

  try {
    await prisma.brand.delete({ where: { id } });
    revalidatePath("/admin/brands");
    revalidateCatalogue();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete brand",
    };
  }
}
