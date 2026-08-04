import { NextResponse } from "next/server";

import { getCategories } from "@/lib/data/categories";
import { serializeCategory } from "@/lib/serialize";
import { safeQuery } from "@/lib/safe";

export async function GET() {
  try {
    const categories = await safeQuery(() => getCategories(), []);
    return NextResponse.json(categories.map(serializeCategory));
  } catch (error) {
    console.error("[api/categories]", error);
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }
}
