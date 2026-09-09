"use server";

import { AuthError } from "next-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { signIn, signOut } from "@/lib/auth";
import { getRequestIp } from "@/lib/request-ip";
import { rateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validations/auth";

export type AuthActionResult = {
  success: boolean;
  error?: string;
};

export async function loginAction(
  _prev: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    remember: formData.get("remember") === "on" || formData.get("remember") === "true",
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message || "Invalid credentials",
    };
  }

  const headersList = await headers();
  const ip = getRequestIp(headersList);
  const ipLimited = rateLimit(`login:ip:${ip}`, {
    limit: 8,
    windowMs: 15 * 60_000,
  });

  if (!ipLimited.success) {
    return {
      success: false,
      error: "Too many login attempts. Please wait 15 minutes and try again.",
    };
  }

  const { email, password } = parsed.data;

  const accountLimited = rateLimit(`login:account:${email}`, {
    limit: 5,
    windowMs: 15 * 60_000,
  });

  if (!accountLimited.success) {
    return {
      success: false,
      error: "Too many login attempts for this account. Try again later.",
    };
  }
  const callbackUrl = (formData.get("callbackUrl") as string) || "/admin";

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid username or password" };
        default:
          return { success: false, error: "Unable to sign in. Try again." };
      }
    }
    // NextAuth redirects by throwing NEXT_REDIRECT
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
  redirect("/admin/login");
}
