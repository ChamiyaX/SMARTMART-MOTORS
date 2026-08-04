import { NextResponse } from "next/server";

import { getBrands } from "@/lib/data/brands";
import { serializeBrand } from "@/lib/serialize";
import { safeQuery } from "@/lib/safe";

export async function GET() {
  try {
    const brands = await safeQuery(() => getBrands(), []);
    return NextResponse.json(brands.map(serializeBrand));
  } catch (error) {
    console.error("[api/brands]", error);
    return NextResponse.json({ error: "Failed to load brands" }, { status: 500 });
  }
}
