import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { StockStatus } from "@prisma/client";

import { getProducts } from "@/lib/data/products";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { serializeProducts } from "@/lib/serialize";
import { safeQuery } from "@/lib/safe";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const q = searchParams.get("q") || undefined;
    const categorySlug = searchParams.get("category") || undefined;
    const brandSlug = searchParams.get("brand") || undefined;
    const featured = searchParams.has("featured")
      ? searchParams.get("featured") === "true"
      : undefined;
    const status = (searchParams.get("status") as StockStatus | null) || undefined;
    const page = Math.max(1, Number(searchParams.get("page") || "1") || 1);
    const pageSize = Math.min(
      48,
      Math.max(
        1,
        Number(searchParams.get("pageSize") || DEFAULT_PAGE_SIZE) || DEFAULT_PAGE_SIZE
      )
    );
    const sort =
      (searchParams.get("sort") as
        "newest" | "price_asc" | "price_desc" | "popular" | "name" | null) || "newest";

    const empty = {
      items: [],
      total: 0,
      page,
      pageSize,
      totalPages: 1,
    };

    const result = await safeQuery(
      () =>
        getProducts({
          q,
          categorySlug,
          brandSlug,
          featured,
          status,
          page,
          pageSize,
          sort,
        }),
      empty
    );

    return NextResponse.json({
      ...result,
      items: serializeProducts(result.items),
    });
  } catch (error) {
    console.error("[api/products]", error);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}
