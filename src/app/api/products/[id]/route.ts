import { NextResponse } from "next/server";

import { getProductById } from "@/lib/data/products";
import { serializeProduct } from "@/lib/serialize";
import { safeQuery } from "@/lib/safe";

type Params = Promise<{ id: string }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const product = await safeQuery(() => getProductById(id), null);

    if (!product || !product.isActive) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(serializeProduct(product));
  } catch (error) {
    console.error("[api/products/[id]]", error);
    return NextResponse.json({ error: "Failed to load product" }, { status: 500 });
  }
}
