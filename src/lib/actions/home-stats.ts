"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { revalidateSiteContent } from "@/lib/revalidate";
import { homeStatsSchema } from "@/lib/validations/home-stats";

export type ActionResult = {
  success: boolean;
  error?: string;
};

export async function saveHomeStats(input: unknown): Promise<ActionResult> {
  await requireAdminSession();
  const parsed = homeStatsSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message || "Validation failed",
    };
  }

  const data = parsed.data;

  try {
    await prisma.pageContent.upsert({
      where: { page: "home-stats" },
      update: {
        title: "Home stats",
        content: {
          eyebrow: data.eyebrow,
          title: data.title,
          description: data.description,
          items: data.items,
        },
        isPublished: data.isPublished,
      },
      create: {
        page: "home-stats",
        title: "Home stats",
        content: {
          eyebrow: data.eyebrow,
          title: data.title,
          description: data.description,
          items: data.items,
        },
        isPublished: data.isPublished,
      },
    });

    revalidatePath("/admin/home-stats");
    revalidateSiteContent();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save home stats",
    };
  }
}
