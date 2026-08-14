import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import authConfig from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  if (!isLoginPage) {
    const role = req.auth?.user?.role;
    const allowed = role === "SUPER_ADMIN" || role === "ADMIN" || role === "EDITOR";

    if (!req.auth?.user || !allowed) {
      const loginUrl = new URL("/admin/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isLoginPage && req.auth?.user) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
  }

  return NextResponse.next();
});

// Only admin routes need the auth check; security headers ship from next.config.ts
// so public pages skip the middleware hop entirely.
export const config = {
  matcher: ["/admin/:path*"],
};
