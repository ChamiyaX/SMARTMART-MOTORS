import { z } from "zod";

/** Uploaded files use /api/files/...; external images use https:// URLs. */
export const mediaUrlSchema = z
  .string()
  .trim()
  .min(1)
  .refine(
    (value) => {
      if (value.startsWith("/")) return true;
      try {
        const parsed = new URL(value);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Enter a valid image URL or uploaded file path" }
  );
