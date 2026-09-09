"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { z } from "zod";

import { requireAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { revalidateSiteContent } from "@/lib/revalidate";
import {
  companySettingsSchema,
  messagingSettingsSchema,
  socialSettingsSchema,
  upsertSettingSchema,
} from "@/lib/validations/settings";

export type ActionResult = {
  success: boolean;
  error?: string;
};

const seoSettingsSchema = z.object({
  defaultMetaTitle: z.string().max(120).optional(),
  defaultMetaDescription: z.string().max(320).optional(),
  ogImage: z.string().url().or(z.literal("")).optional(),
  siteName: z.string().max(120).optional(),
});

const hoursSchema = z.object({
  weekdays: z.string().optional(),
  saturday: z.string().optional(),
  sunday: z.string().optional(),
});

const analyticsIdsSchema = z.object({
  googleAnalyticsId: z.string().optional(),
  googleTagManagerId: z.string().optional(),
  facebookPixelId: z.string().optional(),
});

const pageContentSchema = z.object({
  page: z.string().min(1),
  title: z.string().min(1),
  content: z.union([z.string(), z.record(z.unknown()), z.array(z.unknown())]),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
});

async function upsertKey(key: string, value: Prisma.InputJsonValue, group?: string) {
  return prisma.setting.upsert({
    where: { key },
    update: { value, group },
    create: { key, value, group },
  });
}

export async function upsertSetting(input: unknown): Promise<ActionResult> {
  await requireAdminSession(["SUPER_ADMIN", "ADMIN"]);
  const parsed = upsertSettingSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message || "Validation failed",
    };
  }

  try {
    await upsertKey(
      parsed.data.key,
      parsed.data.value as Prisma.InputJsonValue,
      parsed.data.group || undefined
    );
    revalidatePath("/admin/settings");
    revalidatePath("/admin/seo");
    revalidateSiteContent();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save setting",
    };
  }
}

export async function saveCompanySettings(input: unknown): Promise<ActionResult> {
  await requireAdminSession(["SUPER_ADMIN", "ADMIN"]);
  const parsed = companySettingsSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message || "Validation failed",
    };
  }

  try {
    await upsertKey("company", parsed.data, "company");
    revalidatePath("/admin/settings");
    revalidateSiteContent();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save company",
    };
  }
}

export async function saveMessagingSettings(input: unknown): Promise<ActionResult> {
  await requireAdminSession(["SUPER_ADMIN", "ADMIN"]);
  const parsed = messagingSettingsSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message || "Validation failed",
    };
  }

  try {
    await upsertKey("messaging", parsed.data, "general");
    revalidatePath("/admin/settings");
    revalidateSiteContent();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save messaging",
    };
  }
}

export async function saveSocialSettings(input: unknown): Promise<ActionResult> {
  await requireAdminSession(["SUPER_ADMIN", "ADMIN"]);
  const parsed = socialSettingsSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message || "Validation failed",
    };
  }

  try {
    await upsertKey("social", parsed.data, "social");
    revalidatePath("/admin/settings");
    revalidateSiteContent();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save social",
    };
  }
}

export async function saveHoursSettings(input: unknown): Promise<ActionResult> {
  await requireAdminSession(["SUPER_ADMIN", "ADMIN"]);
  const parsed = hoursSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: "Invalid hours" };
  }

  try {
    await upsertKey("hours", parsed.data, "company");
    revalidatePath("/admin/settings");
    revalidateSiteContent();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save hours",
    };
  }
}

export async function saveAnalyticsIds(input: unknown): Promise<ActionResult> {
  await requireAdminSession(["SUPER_ADMIN", "ADMIN"]);
  const parsed = analyticsIdsSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: "Invalid analytics IDs" };
  }

  try {
    await upsertKey("analytics", parsed.data, "analytics");
    revalidatePath("/admin/settings");
    revalidateSiteContent();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save analytics",
    };
  }
}

export async function saveSeoSettings(input: unknown): Promise<ActionResult> {
  await requireAdminSession(["SUPER_ADMIN", "ADMIN"]);
  const parsed = seoSettingsSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message || "Validation failed",
    };
  }

  try {
    await upsertKey("seo", parsed.data, "seo");
    revalidatePath("/admin/seo");
    revalidateSiteContent();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save SEO",
    };
  }
}

export async function savePageContent(input: unknown): Promise<ActionResult> {
  await requireAdminSession();
  const parsed = pageContentSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message || "Validation failed",
    };
  }

  const data = parsed.data;
  let contentValue: Prisma.InputJsonValue;

  if (typeof data.content === "string") {
    try {
      contentValue = JSON.parse(data.content) as Prisma.InputJsonValue;
    } catch {
      contentValue = { body: data.content };
    }
  } else {
    contentValue = data.content as Prisma.InputJsonValue;
  }

  try {
    await prisma.pageContent.upsert({
      where: { page: data.page },
      update: {
        title: data.title,
        content: contentValue,
        seoTitle: data.seoTitle ?? null,
        seoDescription: data.seoDescription ?? null,
        isPublished: data.isPublished,
      },
      create: {
        page: data.page,
        title: data.title,
        content: contentValue,
        seoTitle: data.seoTitle ?? null,
        seoDescription: data.seoDescription ?? null,
        isPublished: data.isPublished,
      },
    });
    revalidatePath("/admin/content");
    revalidateSiteContent();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save content",
    };
  }
}
