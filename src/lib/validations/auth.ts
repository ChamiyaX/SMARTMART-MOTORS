import { z } from "zod";

/** Demo login: "admin" maps to the seeded SUPER_ADMIN email. */
export const ADMIN_LOGIN_ALIASES: Record<string, string> = {
  admin: "admin@smartmartmotors.com",
};

export function resolveAdminLogin(identifier: string): string {
  const normalized = identifier.trim().toLowerCase();
  return ADMIN_LOGIN_ALIASES[normalized] ?? normalized;
}

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter username or email")
    .transform((value) => resolveAdminLogin(value)),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional().default(false),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .transform((value) => value.toLowerCase()),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[a-z]/, "Include at least one lowercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string().min(8, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
