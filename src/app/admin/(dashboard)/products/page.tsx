import Link from "next/link";
import { Plus, Star } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { ProductRowActions } from "./product-row-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DB_CONNECT_MESSAGE } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

type ProductsPageProps = {
  searchParams: Promise<{
    q?: string;
    featured?: string;
    status?: string;
    page?: string;
  }>;
};

export default async function ProductsAdminPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  let products: Array<{
    id: string;
    name: string;
    sku: string;
    price: { toString(): string } | number;
    stockStatus: string;
    isFeatured: boolean;
    isNewArrival: boolean;
    isActive: boolean;
    category: { name: string };
    brand: { name: string };
  }> = [];
  let total = 0;
  let dbError: string | null = null;

  const where = {
    AND: [
      params.q
        ? {
            OR: [
              { name: { contains: params.q, mode: "insensitive" as const } },
              { sku: { contains: params.q, mode: "insensitive" as const } },
            ],
          }
        : {},
      params.featured === "1" ? { isFeatured: true } : {},
      params.status
        ? {
            stockStatus: params.status as
              "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "PRE_ORDER",
          }
        : {},
    ],
  };

  try {
    // Selecting explicit columns keeps description/specifications JSON off the wire.
    [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select: {
          id: true,
          name: true,
          sku: true,
          price: true,
          stockStatus: true,
          isFeatured: true,
          isNewArrival: true,
          isActive: true,
          category: { select: { name: true } },
          brand: { select: { name: true } },
        },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.product.count({ where }),
    ]);
  } catch {
    dbError = DB_CONNECT_MESSAGE;
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageHref = (target: number) => {
    const search = new URLSearchParams();
    if (params.q) search.set("q", params.q);
    if (params.featured) search.set("featured", params.featured);
    if (params.status) search.set("status", params.status);
    if (target > 1) search.set("page", String(target));
    const qs = search.toString();
    return qs ? `/admin/products?${qs}` : "/admin/products";
  };

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage catalog inventory, pricing, and featured listings."
        actions={
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4" />
              New product
            </Link>
          </Button>
        }
      />

      {dbError && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {dbError}
        </div>
      )}

      <DataTable
        title="Catalog"
        description={`${total} products · page ${page} of ${totalPages}`}
        empty={products.length === 0}
        emptyMessage={dbError || "No products found. Create your first product."}
        searchSlot={
          <form className="flex flex-wrap gap-2">
            <Input
              name="q"
              defaultValue={params.q}
              placeholder="Search name or SKU..."
              className="h-9 w-52 border-white/10 bg-white/[0.04] text-white"
            />
            <select
              name="featured"
              defaultValue={params.featured || ""}
              className="h-9 rounded-md border border-white/10 bg-[#111] px-2 text-xs text-white"
            >
              <option value="">All</option>
              <option value="1">Featured</option>
            </select>
            <select
              name="status"
              defaultValue={params.status || ""}
              className="h-9 rounded-md border border-white/10 bg-[#111] px-2 text-xs text-white"
            >
              <option value="">Any status</option>
              <option value="IN_STOCK">In stock</option>
              <option value="LOW_STOCK">Low stock</option>
              <option value="OUT_OF_STOCK">Out of stock</option>
            </select>
            <Button type="submit" size="sm" variant="outline" className="border-white/10">
              Filter
            </Button>
          </form>
        }
      >
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/50">Product</TableHead>
              <TableHead className="text-white/50">SKU</TableHead>
              <TableHead className="text-white/50">Category</TableHead>
              <TableHead className="text-white/50">Price</TableHead>
              <TableHead className="text-white/50">Stock</TableHead>
              <TableHead className="text-white/50">Flags</TableHead>
              <TableHead className="text-right text-white/50">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="border-white/5">
                <TableCell>
                  <div>
                    <p className="font-medium text-white">{product.name}</p>
                    <p className="text-xs text-white/40">{product.brand.name}</p>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs text-white/60">
                  {product.sku}
                </TableCell>
                <TableCell className="text-white/60">{product.category.name}</TableCell>
                <TableCell className="text-primary">
                  {formatPrice(Number(product.price))}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-white/15 text-white/60">
                    {product.stockStatus.replaceAll("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {product.isFeatured && (
                      <Badge className="bg-primary/15 text-primary">
                        <Star className="mr-1 h-3 w-3" />
                        Featured
                      </Badge>
                    )}
                    {product.isNewArrival && (
                      <Badge variant="outline" className="border-white/15 text-white/50">
                        New
                      </Badge>
                    )}
                    {!product.isActive && (
                      <Badge variant="outline" className="border-white/15 text-white/35">
                        Inactive
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <ProductRowActions id={product.id} name={product.name} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTable>

      {totalPages > 1 && (
        <nav
          className="mt-6 flex items-center justify-between gap-3"
          aria-label="Pagination"
        >
          {page > 1 ? (
            <Button asChild variant="outline" size="sm" className="border-white/10">
              <Link href={pageHref(page - 1)}>Previous</Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="border-white/10" disabled>
              Previous
            </Button>
          )}
          <span className="text-xs text-white/40">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Button asChild variant="outline" size="sm" className="border-white/10">
              <Link href={pageHref(page + 1)}>Next</Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="border-white/10" disabled>
              Next
            </Button>
          )}
        </nav>
      )}
    </div>
  );
}
