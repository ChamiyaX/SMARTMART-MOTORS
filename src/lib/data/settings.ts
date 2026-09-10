import type { Prisma } from "@prisma/client";

import {
  type BusinessHours,
  resolveBusinessHours,
} from "@/lib/business-hours";
import { prisma } from "@/lib/prisma";
import { SITE_CONFIG } from "@/lib/constants";

export type { BusinessHours } from "@/lib/business-hours";
export {
  BUSINESS_HOUR_DAYS,
  BUSINESS_HOUR_LABELS,
  DEFAULT_BUSINESS_HOURS,
} from "@/lib/business-hours";

export async function getSetting<T = unknown>(key: string): Promise<T | null> {
  const setting = await prisma.setting.findUnique({ where: { key } });
  return (setting?.value as T) ?? null;
}

export async function getSettingsByGroup(group: string) {
  return prisma.setting.findMany({
    where: { group },
    orderBy: { key: "asc" },
  });
}

export async function getAllSettings() {
  const settings = await prisma.setting.findMany({
    orderBy: [{ group: "asc" }, { key: "asc" }],
  });

  return Object.fromEntries(settings.map((item) => [item.key, item.value]));
}

export type CompanySettings = {
  name: string;
  tagline?: string;
  address?: string;
  phone: string;
  email: string;
  whatsapp: string;
  registration?: string;
};

export type SocialSettings = {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  linkedin?: string;
};

export type MessagingSettings = {
  enabled: boolean;
};

export async function getMessagingSettings(): Promise<MessagingSettings> {
  const value = await getSetting<MessagingSettings>("messaging");
  return { enabled: value?.enabled !== false };
}

export async function getSocialSettings(): Promise<SocialSettings> {
  const value = await getSetting<SocialSettings>("social");

  return {
    facebook: value?.facebook || SITE_CONFIG.social.facebook || "",
    instagram: value?.instagram || SITE_CONFIG.social.instagram || "",
    youtube: value?.youtube || SITE_CONFIG.social.youtube || "",
    tiktok: value?.tiktok || "",
    linkedin: value?.linkedin || "",
  };
}

export async function getBusinessHours(): Promise<BusinessHours> {
  const [businessHours, legacyHours] = await Promise.all([
    getSetting<Partial<BusinessHours>>("business_hours"),
    getSetting<{ weekdays?: string; saturday?: string; sunday?: string }>("hours"),
  ]);

  return resolveBusinessHours(businessHours, legacyHours);
}

export async function getCompanySettings(): Promise<CompanySettings> {
  const value = await getSetting<CompanySettings>("company");

  return {
    name: value?.name || SITE_CONFIG.name,
    tagline: value?.tagline || SITE_CONFIG.tagline,
    address: value?.address || SITE_CONFIG.address,
    phone: value?.phone || SITE_CONFIG.phone,
    email: value?.email || SITE_CONFIG.email,
    whatsapp: value?.whatsapp || SITE_CONFIG.whatsapp,
    registration: value?.registration || "",
  };
}

export async function getPageContent(page: string) {
  return prisma.pageContent.findFirst({
    where: { page, isPublished: true },
  });
}

export async function upsertSetting(
  key: string,
  value: Prisma.InputJsonValue,
  group?: string | null
) {
  return prisma.setting.upsert({
    where: { key },
    update: { value, group: group ?? undefined },
    create: { key, value, group: group ?? undefined },
  });
}
