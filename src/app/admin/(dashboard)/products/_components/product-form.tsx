"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import type { Brand, Category, Product, ProductImage } from "@prisma/client";

import { z } from "zod";

import { createProduct, updateProduct } from "@/lib/actions/products";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  name: z.string().trim().min(2),
  slug: z.string().optional(),
  sku: z.string().trim().min(2),
  description: z.string().trim().min(10),
  richDescription: z.string().optional().nullable(),
  price: z.coerce.number().positive(),
  compareAtPrice: z.coerce.number().positive().optional().nullable(),
  discount: z.coerce.number().min(0).max(100).optional().nullable(),
  stockStatus: z.enum(["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK", "PRE_ORDER"]),
  stockQuantity: z.coerce.number().int().min(0),
  isFeatured: z.boolean(),
  isNewArrival: z.boolean(),
  isPopular: z.boolean(),
  isActive: z.boolean(),
  categoryId: z.string().min(1, "Select a category"),
  brandId: z.string().min(1, "Select a brand"),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  compatibleModels: z.array(z.string()).optional(),
  tagsInput: z.string().optional(),
  specsText: z.string().optional(),
  imageUrls: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

type ProductWithImages = Product & { images: ProductImage[] };

type ProductFormProps = {
  product?: ProductWithImages | null;
  categories: Pick<Category, "id" | "name">[];
  brands: Pick<Brand, "id" | "name">[];
};

export function ProductForm({ product, categories, brands }: ProductFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const isEdit = Boolean(product);

  const defaults = useMemo<FormValues>(
    () => ({
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      sku: product?.sku ?? "",
      description: product?.description ?? "",
      richDescription: product?.richDescription ?? "",
      price: product ? Number(product.price) : 0,
      compareAtPrice: product?.compareAtPrice ? Number(product.compareAtPrice) : null,
      discount: product?.discount ? Number(product.discount) : null,
      stockStatus: product?.stockStatus ?? "IN_STOCK",
      stockQuantity: product?.stockQuantity ?? 0,
      isFeatured: product?.isFeatured ?? false,
      isNewArrival: product?.isNewArrival ?? false,
      isPopular: product?.isPopular ?? false,
      isActive: product?.isActive ?? true,
      categoryId: product?.categoryId ?? "",
      brandId: product?.brandId ?? "",
      metaTitle: product?.metaTitle ?? "",
      metaDescription: product?.metaDescription ?? "",
      compatibleModels: product?.compatibleModels ?? [],
      tagsInput: (product?.tags ?? []).join(", "),
      specsText: product?.specifications
        ? JSON.stringify(product.specifications, null, 2)
        : "{\n  \n}",
      imageUrls: product?.images?.map((img) => img.url) ?? [],
    }),
    [product]
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: defaults,
  });

  const nameValue = form.watch("name");
  const imageUrls = form.watch("imageUrls") || [];

  useEffect(() => {
    if (!isEdit && nameValue) {
      form.setValue("slug", slugify(nameValue), { shouldValidate: true });
    }
  }, [nameValue, isEdit, form]);

  useEffect(() => {
    if (isEdit) return;
    if (!form.getValues("categoryId") && categories[0]) {
      form.setValue("categoryId", categories[0].id);
    }
    if (!form.getValues("brandId") && brands[0]) {
      form.setValue("brandId", brands[0].id);
    }
  }, [isEdit, categories, brands, form]);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "smartmart-motors/products");
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      const current = form.getValues("imageUrls") || [];
      form.setValue("imageUrls", [...current, data.url as string], {
        shouldDirty: true,
        shouldValidate: true,
      });
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function onInvalid(errors: typeof form.formState.errors) {
    const messages = Object.values(errors)
      .map((error) => error?.message)
      .filter(Boolean);

    toast.error(
      messages[0]?.toString() ||
        "Fill in all required fields (name, SKU, category, brand, description, price)."
    );
  }

  function onSubmit(values: FormValues) {
    let specifications: Record<string, unknown> | null = null;
    try {
      const parsed = JSON.parse(values.specsText || "{}");
      specifications = parsed;
    } catch {
      toast.error("Specifications must be valid JSON");
      return;
    }

    const tags = (values.tagsInput || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const images = (values.imageUrls || []).map((url, index) => ({
      url,
      sortOrder: index,
      isPrimary: index === 0,
      alt: values.name,
    }));

    const payload = {
      name: values.name,
      slug: values.slug || slugify(values.name),
      sku: values.sku,
      description: values.description,
      richDescription: values.richDescription ?? null,
      price: values.price,
      compareAtPrice: values.compareAtPrice ?? null,
      discount: values.discount ?? null,
      stockStatus: values.stockStatus,
      stockQuantity: values.stockQuantity,
      isFeatured: values.isFeatured,
      isNewArrival: values.isNewArrival,
      isPopular: values.isPopular,
      isActive: values.isActive,
      categoryId: values.categoryId,
      brandId: values.brandId,
      metaTitle: values.metaTitle ?? null,
      metaDescription: values.metaDescription ?? null,
      tags,
      specifications,
      images,
    };

    startTransition(async () => {
      const result = isEdit
        ? await updateProduct({ ...payload, id: product!.id })
        : await createProduct(payload);

      if (!result.success) {
        toast.error(result.error || "Save failed");
        return;
      }

      toast.success(isEdit ? "Product updated" : "Product created");
      router.push("/admin/products");
      router.refresh();
    });
  }

  const inputClass = "border-white/10 bg-white/[0.04] text-white";

  return (
    <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl sm:p-6">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-white">
          Basic details
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label>Name</Label>
            <Input className={inputClass} {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-xs text-primary">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>SKU</Label>
            <Input className={inputClass} {...form.register("sku")} />
            {form.formState.errors.sku && (
              <p className="text-xs text-primary">{form.formState.errors.sku.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input className={inputClass} {...form.register("slug")} />
          </div>
          <div className="space-y-2">
            <Label>Price (LKR)</Label>
            <Input
              type="number"
              step="0.01"
              className={inputClass}
              {...form.register("price")}
            />
            {form.formState.errors.price && (
              <p className="text-xs text-primary">
                {form.formState.errors.price.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Stock quantity</Label>
            <Input
              type="number"
              className={inputClass}
              {...form.register("stockQuantity")}
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={form.watch("categoryId")}
              onValueChange={(v) =>
                form.setValue("categoryId", v, { shouldValidate: true })
              }
            >
              <SelectTrigger className={inputClass}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {categories.length === 0 && (
              <p className="text-xs text-primary">
                No categories found. Add categories in Admin → Categories first.
              </p>
            )}
            {form.formState.errors.categoryId && (
              <p className="text-xs text-primary">
                {form.formState.errors.categoryId.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Brand</Label>
            <Select
              value={form.watch("brandId")}
              onValueChange={(v) => form.setValue("brandId", v, { shouldValidate: true })}
            >
              <SelectTrigger className={inputClass}>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {brands.length === 0 && (
              <p className="text-xs text-primary">
                No brands found. Add brands in Admin → Brands first.
              </p>
            )}
            {form.formState.errors.brandId && (
              <p className="text-xs text-primary">
                {form.formState.errors.brandId.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Stock status</Label>
            <Select
              value={form.watch("stockStatus")}
              onValueChange={(v) =>
                form.setValue("stockStatus", v as FormValues["stockStatus"])
              }
            >
              <SelectTrigger className={inputClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IN_STOCK">In stock</SelectItem>
                <SelectItem value="LOW_STOCK">Low stock</SelectItem>
                <SelectItem value="OUT_OF_STOCK">Out of stock</SelectItem>
                <SelectItem value="PRE_ORDER">Pre-order</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Description</Label>
            <Textarea rows={4} className={inputClass} {...form.register("description")} />
            {form.formState.errors.description && (
              <p className="text-xs text-primary">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Tags (comma separated)</Label>
            <Input className={inputClass} {...form.register("tagsInput")} />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              ["isFeatured", "Featured"],
              ["isNewArrival", "New arrival"],
              ["isPopular", "Popular"],
              ["isActive", "Active"],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5"
            >
              <span className="text-sm text-white/70">{label}</span>
              <Switch
                checked={Boolean(form.watch(key))}
                onCheckedChange={(checked) => form.setValue(key, checked)}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl sm:p-6">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-white">
          Specifications (JSON)
        </h2>
        <Textarea
          rows={8}
          className={`font-mono text-xs ${inputClass}`}
          {...form.register("specsText")}
        />
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-white">
            Images
          </h2>
          <div className="flex items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-xs text-primary hover:bg-primary/20">
              {uploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Upload className="h-3.5 w-3.5" />
              )}
              Cloudinary upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleUpload(file);
                  e.target.value = "";
                }}
              />
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-white/10"
              onClick={() => form.setValue("imageUrls", [...imageUrls, ""])}
            >
              <Plus className="h-3.5 w-3.5" />
              Add URL
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          {imageUrls.map((url, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                className={inputClass}
                placeholder="https://..."
                value={url}
                onChange={(e) => {
                  const next = [...imageUrls];
                  next[index] = e.target.value;
                  form.setValue("imageUrls", next);
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  form.setValue(
                    "imageUrls",
                    imageUrls.filter((_, i) => i !== index)
                  )
                }
              >
                <Trash2 className="h-4 w-4 text-white/40" />
              </Button>
            </div>
          ))}
          {imageUrls.length === 0 && (
            <p className="text-sm text-white/35">No images added yet.</p>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl sm:p-6">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-white">
          SEO
        </h2>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Meta title</Label>
            <Input className={inputClass} {...form.register("metaTitle")} />
          </div>
          <div className="space-y-2">
            <Label>Meta description</Label>
            <Textarea
              rows={3}
              className={inputClass}
              {...form.register("metaDescription")}
            />
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          className="border-white/10"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={pending} className="min-w-32">
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEdit ? "Update product" : "Create product"}
        </Button>
      </div>
    </form>
  );
}
