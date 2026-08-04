"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";

import { loginAction, type AuthActionResult } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionResult = { success: false };

type LoginFormProps = {
  callbackUrl?: string;
};

export function LoginForm({ callbackUrl = "/admin" }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      {state?.error && (
        <div className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-white/70">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="admin@smartmartmotors.com"
            className="h-11 border-white/10 bg-white/[0.04] pl-10 text-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-white/70">
            Password
          </Label>
          <Link
            href="/admin/login?forgot=1"
            className="text-xs text-white/40 transition hover:text-primary"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="h-11 border-white/10 bg-white/[0.04] pl-10 pr-10 text-white"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="remember"
          name="remember"
          type="checkbox"
          value="true"
          className="h-4 w-4 rounded border-white/20 bg-white/5 text-primary accent-primary"
        />
        <Label htmlFor="remember" className="text-sm font-normal text-white/50">
          Remember me for 7 days
        </Label>
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="h-11 w-full bg-primary text-white shadow-[0_0_24px_rgba(225,6,0,0.35)] hover:bg-[#ff1a1a]"
      >
        <Shield className="h-4 w-4" />
        {pending ? "Signing in..." : "Sign in to Admin"}
      </Button>
    </form>
  );
}
