"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Plus } from "lucide-react";
import type { Brand } from "@prisma/client";

import { createBrand, updateBrand, deleteBrand } from "@/lib/actions/brands";
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

type BrandRow = Brand & { _count?: { products: number } };

export function BrandsManager({ brands }: { brands: BrandRow[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BrandRow | null>(null);
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: "",
    slug: "",
    logo: "",
    website: "",
    description: "",
    isActive: true,
    sortOrder: 0,
  });

  function openCreate() {
    setEditing(null);
    setForm({
      name: "",
      slug: "",
      logo: "",
      website: "",
      description: "",
      isActive: true,
      sortOrder: 0,
    });
    setOpen(true);
  }

  function openEdit(brand: BrandRow) {
    setEditing(brand);
    setForm({
      name: brand.name,
      slug: brand.slug,
      logo: brand.logo || "",
      website: brand.website || "",
      description: brand.description || "",
      isActive: brand.isActive,
      sortOrder: brand.sortOrder,
    });
    setOpen(true);
  }

  function submit() {
    startTransition(async () => {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.name),
        logo: form.logo || null,
        website: form.website || null,
      };
      const result = editing
        ? await updateBrand({ ...payload, id: editing.id })
        : await createBrand(payload);
      if (!result.success) {
        toast.error(result.error || "Save failed");
        return;
      }
      toast.success(editing ? "Brand updated" : "Brand created");
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
              New brand
            </Button>
          </DialogTrigger>
          <DialogContent className="border-white/10 bg-[#111] text-white">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit brand" : "New brand"}</DialogTitle>
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
                <Label>Logo URL</Label>
                <Input
                  value={form.logo}
                  onChange={(e) => setForm((f) => ({ ...f, logo: e.target.value }))}
                  className="border-white/10 bg-white/[0.04]"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Website</Label>
                <Input
                  value={form.website}
                  onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
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
                {pending ? "Saving..." : "Save brand"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/50">Brand</TableHead>
              <TableHead className="text-white/50">Slug</TableHead>
              <TableHead className="text-white/50">Status</TableHead>
              <TableHead className="text-white/50">Products</TableHead>
              <TableHead className="text-right text-white/50">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map((brand) => (
              <TableRow key={brand.id} className="border-white/5">
                <TableCell className="text-white">{brand.name}</TableCell>
                <TableCell className="font-mono text-xs text-white/50">
                  {brand.slug}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      brand.isActive
                        ? "border-primary/30 text-primary"
                        : "border-white/15 text-white/40"
                    }
                  >
                    {brand.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-white/50">
                  {brand._count?.products ?? "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(brand)}>
                      <Pencil className="h-4 w-4 text-white/50" />
                    </Button>
                    <ConfirmDelete
                      onConfirm={async () => {
                        const result = await deleteBrand(brand.id);
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
        {brands.length === 0 && (
          <p className="py-12 text-center text-sm text-white/40">No brands yet</p>
        )}
      </div>
    </>
  );
}
