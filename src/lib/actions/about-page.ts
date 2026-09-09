"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { revalidateSiteContent } from "@/lib/revalidate";
import { aboutPageSchema } from "@/lib/validations/about-page";

export type ActionResult = {
  success: boolean;
  error?: string;
};

export async function saveAboutPage(input: unknown): Promise<ActionResult> {
  await requireAdminSession();
  const parsed = aboutPageSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message || "Validation failed",
    };
  }

  const data = parsed.data;

  try {
    await prisma.pageContent.upsert({
      where: { page: "about" },
      update: {
        title: data.title,
        content: {
          headline: data.headline,
          body: data.body,
          mission: data.mission,
          story: data.story,
          imageUrl: data.imageUrl,
          values: data.values,
        },
        seoTitle: data.seoTitle ?? null,
        seoDescription: data.seoDescription ?? null,
        isPublished: data.isPublished,
      },
      create: {
        page: "about",
        title: data.title,
        content: {
          headline: data.headline,
          body: data.body,
          mission: data.mission,
          story: data.story,
          imageUrl: data.imageUrl,
          values: data.values,
        },
        seoTitle: data.seoTitle ?? null,
        seoDescription: data.seoDescription ?? null,
        isPublished: data.isPublished,
      },
    });

    revalidatePath("/admin/about");
    revalidateSiteContent();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save about page",
    };
  }
}
