import { z } from "zod";

const homeStatItemSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(80),
  value: z.coerce.number().int().min(0).max(99_999_999),
  suffix: z.string().trim().max(8).default("+"),
});

export const homeStatsSchema = z.object({
  eyebrow: z.string().trim().min(1).max(80),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(320),
  items: z.array(homeStatItemSchema).length(4),
  isPublished: z.boolean().default(true),
});

export type HomeStatsInput = z.infer<typeof homeStatsSchema>;
