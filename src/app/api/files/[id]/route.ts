import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type Params = Promise<{ id: string }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const asset = await prisma.mediaAsset.findUnique({
      where: { id },
      select: { data: true, mimeType: true },
    });

    if (!asset?.data) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return new NextResponse(Buffer.from(asset.data), {
      headers: {
        "Content-Type": asset.mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[api/files/[id]]", error);
    return NextResponse.json({ error: "Failed to load file" }, { status: 500 });
  }
}
