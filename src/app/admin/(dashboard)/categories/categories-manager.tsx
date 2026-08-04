"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Plus } from "lucide-react";
import type { Category } from "@prisma/client";

import { createCategory, updateCategory, deleteCategory } from "@/lib/actions/categories";
import { slugify } from "@/lib/utils";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type CategoryRow = Category & { _count?: { products: number } };

export function CategoriesManager({ categories }: { categories: CategoryRow[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    isActive: true,
    sortOrder: 0,
  });

  function openCreate() {
    setEditing(null);
    setForm({
      name: "",
      slug: "",
      description: "",
      isActive: true,
      sortOrder: 0,
    });
    setOpen(true);
  }

  function openEdit(cat: CategoryRow) {
    setEditing(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      isActive: cat.isActive,
      sortOrder: cat.sortOrder,
    });
    setOpen(true);
  }

  function submit() {
    startTransition(async () => {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.name),
      };
      const result = editing
        ? await updateCategory({ ...payload, id: editing.id })
        : await createCategory(payload);
      if (!result.success) {
        toast.error(result.error || "Save failed");
        return;
      }
      toast.success(editing ? "Category updated" : "Category created");
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              New category
            </Button>
          </DialogTrigger>
          <DialogContent className="border-white/10 bg-[#111] text-white">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit category" : "New category"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      name: e.target.value,
                      slug: editing ? f.slug : slugify(e.target.value),
                    }))
                  }
                  className="border-white/10 bg-white/[0.04]"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Slug</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="border-white/10 bg-white/[0.04]"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className="border-white/10 bg-white/[0.04]"
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2">
                <Label>Active</Label>
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
                />
              </div>
              <Button onClick={submit} disabled={pending} className="w-full">
                {pending ? "Saving..." : "Save category"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/50">Name</TableHead>
              <TableHead className="text-white/50">Slug</TableHead>
              <TableHead className="text-white/50">Status</TableHead>
              <TableHead className="text-white/50">Products</TableHead>
              <TableHead className="text-right text-white/50">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id} className="border-white/5">
                <TableCell className="text-white">{cat.name}</TableCell>
                <TableCell className="font-mono text-xs text-white/50">
                  {cat.slug}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      cat.isActive
                        ? "border-primary/30 text-primary"
                        : "border-white/15 text-white/40"
                    }
                  >
                    {cat.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-white/50">
                  {cat._count?.products ?? "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(cat)}>
                      <Pencil className="h-4 w-4 text-white/50" />
                    </Button>
                    <ConfirmDelete
                      onConfirm={async () => {
                        const result = await deleteCategory(cat.id);
                        router.refresh();
                        return result;
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {categories.length === 0 && (
          <p className="py-12 text-center text-sm text-white/40">No categories yet</p>
        )}
      </div>
    </>
  );
}
