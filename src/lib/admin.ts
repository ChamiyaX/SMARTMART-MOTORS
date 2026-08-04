import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import type { Role } from "@prisma/client";

import { auth } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/constants";

export const DB_CONNECT_MESSAGE = "Connect DATABASE_URL and run db:seed";

export type AdminUser = {
  id: string;
  role: Role;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

function isAdminRole(role: Role | undefined): role is Role {
  return Boolean(role && (ADMIN_ROLES as readonly string[]).includes(role));
}

function toAdminUser(session: Session): AdminUser {
  return {
    id: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  };
}

/** Server Components / layouts — redirects when unauthenticated or under-privileged. */
export async function requireAdmin(roles?: readonly Role[]) {
  const session = await auth();

  if (!session?.user || !isAdminRole(session.user.role)) {
    redirect("/admin/login");
  }

  const allowed = roles ?? (ADMIN_ROLES as readonly Role[]);
  if (!allowed.includes(session.user.role)) {
    redirect("/admin");
  }

  return {
    ...session,
    user: toAdminUser(session),
  };
}

/** Server actions / API — throws instead of redirecting. */
export async function requireAdminSession(roles?: readonly Role[]) {
  const session = await auth();

  if (!session?.user?.id || !isAdminRole(session.user.role)) {
    throw new Error("Unauthorized");
  }

  const allowed = roles ?? (ADMIN_ROLES as readonly Role[]);
  if (!allowed.includes(session.user.role)) {
    throw new Error("Forbidden");
  }

  return {
    ...session,
    user: toAdminUser(session),
  };
}

export function isElevatedAdmin(role: Role) {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}
