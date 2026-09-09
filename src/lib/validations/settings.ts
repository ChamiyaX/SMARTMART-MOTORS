import { z } from "zod";

export const settingValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.array(z.unknown()),
  z.record(z.unknown()),
]);

export const upsertSettingSchema = z.object({
  key: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9_]+$/, "Use lowercase letters, numbers, and underscores"),
  value: settingValueSchema,
  group: z.string().trim().max(60).optional().nullable(),
});

export const companySettingsSchema = z.object({
  name: z.string().min(2),
  tagline: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().min(9),
  email: z.string().email(),
  whatsapp: z.string().min(9),
  registration: z.string().optional(),
});

export const messagingSettingsSchema = z.object({
  enabled: z.boolean(),
});

export const socialSettingsSchema = z.object({
  facebook: z.string().url().or(z.literal("")).optional(),
  instagram: z.string().url().or(z.literal("")).optional(),
  youtube: z.string().url().or(z.literal("")).optional(),
  tiktok: z.string().url().or(z.literal("")).optional(),
  linkedin: z.string().url().or(z.literal("")).optional(),
});

export type UpsertSettingInput = z.infer<typeof upsertSettingSchema>;
export type CompanySettingsInput = z.infer<typeof companySettingsSchema>;
export type MessagingSettingsInput = z.infer<typeof messagingSettingsSchema>;
export type SocialSettingsInput = z.infer<typeof socialSettingsSchema>;
