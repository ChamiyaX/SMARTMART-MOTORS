"use server";

import { revalidatePath } from "next/cache";
import type { Role } from "@prisma/client";
import { z } from "zod";

import { requireAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export type ActionResult = {
  success: boolean;
  error?: string;
};

const updateRoleSchema = z.object({
  id: z.string().min(1),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR", "USER"]),
});

export async function updateUserRole(id: string, role: Role): Promise<ActionResult> {
  const session = await requireAdminSession(["SUPER_ADMIN", "ADMIN"]);
  const parsed = updateRoleSchema.safeParse({ id, role });

  if (!parsed.success) {
    return { success: false, error: "Invalid role update" };
  }

  if (session.user.role !== "SUPER_ADMIN" && role === "SUPER_ADMIN") {
    return { success: false, error: "Only Super Admins can assign Super Admin" };
  }

  if (session.user.id === id) {
    return { success: false, error: "You cannot change your own role" };
  }

  try {
    await prisma.user.update({
      where: { id: parsed.data.id },
      data: { role: parsed.data.role },
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update user",
    };
  }
}

export async function deleteUser(id: string): Promise<ActionResult> {
  const session = await requireAdminSession(["SUPER_ADMIN"]);

  if (session.user.id === id) {
    return { success: false, error: "You cannot delete your own account" };
  }

  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete user",
    };
  }
}
