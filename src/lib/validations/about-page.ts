import { z } from "zod";

import { mediaUrlSchema } from "@/lib/validations/media";

const aboutValueSchema = z.object({
  title: z.string().trim().min(1, "Value title is required").max(80),
  text: z.string().trim().min(1, "Value description is required").max(500),
});

export const aboutPageSchema = z.object({
  title: z.string().trim().min(2).max(120),
  headline: z.string().trim().min(2).max(160),
  body: z.string().trim().min(10).max(500),
  mission: z.string().trim().min(10).max(2000),
  story: z.string().trim().min(10).max(2000),
  imageUrl: mediaUrlSchema,
  values: z.array(aboutValueSchema).length(3),
  seoTitle: z.string().max(120).optional().nullable(),
  seoDescription: z.string().max(320).optional().nullable(),
  isPublished: z.boolean().default(true),
});

export type AboutPageInput = z.infer<typeof aboutPageSchema>;
