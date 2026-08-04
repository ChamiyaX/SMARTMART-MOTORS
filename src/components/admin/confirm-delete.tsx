"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type ConfirmDeleteProps = {
  title?: string;
  description?: string;
  onConfirm: () => Promise<{ success: boolean; error?: string } | void>;
  triggerLabel?: string;
  iconOnly?: boolean;
};

export function ConfirmDelete({
  title = "Delete item?",
  description = "This action cannot be undone. The record will be permanently removed.",
  onConfirm,
  triggerLabel = "Delete",
  iconOnly = true,
}: ConfirmDeleteProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {iconOnly ? (
          <Button
            variant="ghost"
            size="icon"
            className="text-white/50 hover:text-primary"
            aria-label={triggerLabel}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline" className="border-primary/30 text-primary">
            <Trash2 className="h-4 w-4" />
            {triggerLabel}
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="border-white/10 bg-[#111]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-white/50">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-white/10 bg-transparent text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-primary text-white hover:bg-primary/90"
            disabled={pending}
            onClick={(e) => {
              e.preventDefault();
              startTransition(async () => {
                const result = await onConfirm();
                if (result && !result.success) {
                  toast.error(result.error || "Delete failed");
                  return;
                }
                toast.success("Deleted successfully");
                setOpen(false);
              });
            }}
          >
            {pending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
