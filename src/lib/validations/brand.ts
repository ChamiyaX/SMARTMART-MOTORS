import { z } from "zod";

export const createBrandSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(140)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format")
    .optional(),
  logo: z.string().url().optional().nullable().or(z.literal("")),
  description: z.string().max(2000).optional().nullable(),
  website: z.string().url().optional().nullable().or(z.literal("")),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export const updateBrandSchema = createBrandSchema.partial().extend({
  id: z.string().min(1),
});

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
