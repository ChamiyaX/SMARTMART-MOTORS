"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

import { deleteProduct } from "@/lib/actions/products";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { Button } from "@/components/ui/button";

export function ProductRowActions({ id, name }: { id: string; name: string }) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-end gap-1">
      <Button asChild variant="ghost" size="icon">
        <Link href={`/admin/products/${id}/edit`}>
          <Pencil className="h-4 w-4 text-white/50" />
        </Link>
      </Button>
      <ConfirmDelete
        title="Delete product?"
        description={`Remove “${name}” from the catalog permanently.`}
        onConfirm={async () => {
          const result = await deleteProduct(id);
          router.refresh();
          return result;
        }}
      />
    </div>
  );
}
