import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/admin/login-form";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Admin Login | ${SITE_NAME}`,
  robots: { index: false, follow: false },
};

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string; forgot?: string; error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const forgot = params.forgot === "1";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0a] px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(225,6,0,0.22),_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative w-full max-w-md animate-fade-up">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex flex-col items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-white shadow-[0_0_40px_rgba(225,6,0,0.45)]">
              SM
            </span>
            <div>
              <p className="font-display text-xl uppercase tracking-[0.28em] text-white">
                SmartMart Motors
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/40">
                Secure Admin Access
              </p>
            </div>
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-8">
          {forgot ? (
            <div className="space-y-4 text-center">
              <h1 className="font-display text-lg uppercase tracking-[0.16em] text-white">
                Reset Password
              </h1>
              <p className="text-sm text-white/50">
                Password reset is available for Super Admins. Contact your system
                administrator or use the seeded admin credentials after running{" "}
                <code className="text-primary">db:seed</code>.
              </p>
              <Link
                href="/admin/login"
                className="inline-block text-sm text-primary hover:underline"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="font-display text-lg uppercase tracking-[0.16em] text-white">
                  Welcome back
                </h1>
                <p className="mt-1 text-sm text-white/45">
                  Sign in to manage products, media, and site content.
                </p>
              </div>
              {params.error && (
                <div className="mb-4 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
                  Authentication error. Please try again.
                </div>
              )}
              <LoginForm callbackUrl={params.callbackUrl || "/admin"} />
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-white/30">
          Protected area · Authorized staff only
        </p>
      </div>
    </div>
  );
}
