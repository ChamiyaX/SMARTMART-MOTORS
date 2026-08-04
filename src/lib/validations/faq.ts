import { z } from "zod";

export const createFaqSchema = z.object({
  question: z.string().trim().min(5).max(400),
  answer: z.string().trim().min(5).max(5000),
  category: z.string().trim().max(80).optional().nullable(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const updateFaqSchema = createFaqSchema.partial().extend({
  id: z.string().min(1),
});

export type CreateFaqInput = z.infer<typeof createFaqSchema>;
export type UpdateFaqInput = z.infer<typeof updateFaqSchema>;
