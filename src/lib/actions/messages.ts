"use server";

import { revalidatePath } from "next/cache";
import type { MessageStatus } from "@prisma/client";
import { z } from "zod";

import { requireAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export type ActionResult = {
  success: boolean;
  error?: string;
};

const statusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["NEW", "READ", "REPLIED", "ARCHIVED", "SPAM"]),
});

export async function updateMessageStatus(
  id: string,
  status: MessageStatus
): Promise<ActionResult> {
  await requireAdminSession();
  const parsed = statusSchema.safeParse({ id, status });

  if (!parsed.success) {
    return { success: false, error: "Invalid status update" };
  }

  try {
    await prisma.message.update({
      where: { id: parsed.data.id },
      data: { status: parsed.data.status },
    });
    revalidatePath("/admin/messages");
    revalidatePath(`/admin/messages/${id}`);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update message",
    };
  }
}

export async function markMessageRead(id: string): Promise<ActionResult> {
  return updateMessageStatus(id, "READ");
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  await requireAdminSession();

  try {
    await prisma.message.delete({ where: { id } });
    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete message",
    };
  }
}
