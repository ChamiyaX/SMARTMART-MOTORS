"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { createFaqSchema, updateFaqSchema } from "@/lib/validations/faq";

export type ActionResult = {
  success: boolean;
  error?: string;
  id?: string;
};

export async function createFaq(input: unknown): Promise<ActionResult> {
  await requireAdminSession();
  const parsed = createFaqSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message || "Validation failed",
    };
  }

  try {
    const faq = await prisma.faq.create({ data: parsed.data });
    revalidatePath("/admin/faqs");
    return { success: true, id: faq.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create FAQ",
    };
  }
}

export async function updateFaq(input: unknown): Promise<ActionResult> {
  await requireAdminSession();
  const parsed = updateFaqSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message || "Validation failed",
    };
  }

  const { id, ...data } = parsed.data;

  try {
    await prisma.faq.update({ where: { id }, data });
    revalidatePath("/admin/faqs");
    return { success: true, id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update FAQ",
    };
  }
}

export async function deleteFaq(id: string): Promise<ActionResult> {
  await requireAdminSession();

  try {
    await prisma.faq.delete({ where: { id } });
    revalidatePath("/admin/faqs");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete FAQ",
    };
  }
}
