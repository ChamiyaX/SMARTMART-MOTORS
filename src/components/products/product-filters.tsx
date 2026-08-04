"use client";

import * as React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Brand, Category } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export interface ProductFiltersState {
  search: string;
  categoryId: string;
  brandId: string;
  stock: "all" | "in" | "out";
  minPrice: string;
  maxPrice: string;
}

interface ProductFiltersProps {
  categories?: Category[];
  brands?: Brand[];
  value: ProductFiltersState;
  onChange: (value: ProductFiltersState) => void;
  onReset?: () => void;
  className?: string;
}

export function ProductFilters({
  categories = [],
  brands = [],
  value,
  onChange,
  onReset,
  className,
}: ProductFiltersProps) {
  const update = (patch: Partial<ProductFiltersState>) =>
    onChange({ ...value, ...patch });

  return (
    <aside className={cn("space-y-5 rounded-xl p-5 glass", className)}>
      <div className="flex items-center gap-2 text-white">
        <SlidersHorizontal className="h-4 w-4 text-primary" />
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider">
          Filters
        </h2>
      </div>

      <div className="space-y-2">
        <Label htmlFor="product-search">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="product-search"
            value={value.search}
            onChange={(e) => update({ search: e.target.value })}
            placeholder="Search parts..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={value.categoryId || "all"}
          onValueChange={(v) => update({ categoryId: v === "all" ? "" : v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Brand</Label>
        <Select
          value={value.brandId || "all"}
          onValueChange={(v) => update({ brandId: v === "all" ? "" : v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All brands" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All brands</SelectItem>
            {brands.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Stock</Label>
        <Select
          value={value.stock}
          onValueChange={(v: "all" | "in" | "out") => update({ stock: v })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="in">In stock</SelectItem>
            <SelectItem value="out">Out of stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="min-price">Min (LKR)</Label>
          <Input
            id="min-price"
            type="number"
            min={0}
            value={value.minPrice}
            onChange={(e) => update({ minPrice: e.target.value })}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max-price">Max (LKR)</Label>
          <Input
            id="max-price"
            type="number"
            min={0}
            value={value.maxPrice}
            onChange={(e) => update({ maxPrice: e.target.value })}
            placeholder="Any"
          />
        </div>
      </div>

      {onReset ? (
        <Button type="button" variant="outline" className="w-full" onClick={onReset}>
          Reset filters
        </Button>
      ) : null}
    </aside>
  );
}
