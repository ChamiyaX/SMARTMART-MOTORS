"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { MessageStatus } from "@prisma/client";

import { deleteMessage, updateMessageStatus } from "@/lib/actions/messages";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { Button } from "@/components/ui/button";

const statuses: MessageStatus[] = ["NEW", "READ", "REPLIED", "ARCHIVED", "SPAM"];

export function MessageActions({ id, status }: { id: string; status: MessageStatus }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        defaultValue={status}
        disabled={pending}
        className="h-9 rounded-md border border-white/10 bg-[#111] px-3 text-sm text-white"
        onChange={(e) => {
          const next = e.target.value as MessageStatus;
          startTransition(async () => {
            const result = await updateMessageStatus(id, next);
            if (!result.success) {
              toast.error(result.error || "Update failed");
              return;
            }
            toast.success("Status updated");
            router.refresh();
          });
        }}
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <Button
        variant="outline"
        className="border-white/10"
        disabled={pending || status === "READ"}
        onClick={() => {
          startTransition(async () => {
            const result = await updateMessageStatus(id, "READ");
            if (!result.success) {
              toast.error(result.error || "Update failed");
              return;
            }
            toast.success("Marked as read");
            router.refresh();
          });
        }}
      >
        Mark read
      </Button>
      <ConfirmDelete
        iconOnly={false}
        title="Delete message?"
        onConfirm={async () => {
          const result = await deleteMessage(id);
          if (result.success) router.push("/admin/messages");
          return result;
        }}
      />
    </div>
  );
}
