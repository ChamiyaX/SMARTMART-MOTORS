import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { SITE_CONFIG } from "@/lib/constants";

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

export type MessagingSettings = {
  enabled: boolean;
};

export async function getMessagingSettings(): Promise<MessagingSettings> {
  const value = await getSetting<MessagingSettings>("messaging");
  return { enabled: value?.enabled !== false };
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
