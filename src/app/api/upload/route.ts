import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "@/lib/auth";
import { uploadMedia } from "@/lib/upload";
import { MAX_UPLOAD_SIZE_MB } from "@/lib/constants";
import { rateLimit } from "@/lib/rate-limit";

const MAX_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limited = rateLimit(`upload:${session.user.id}`, {
      limit: 20,
      windowMs: 60_000,
    });
    if (!limited.success) {
      return NextResponse.json({ error: "Upload rate limit exceeded" }, { status: 429 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image uploads are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `File exceeds ${MAX_UPLOAD_SIZE_MB}MB limit` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const folder = String(formData.get("folder") || "smartmart-motors");
    const result = await uploadMedia(buffer, {
      folder,
      filename: file.name,
      contentType: file.type,
    });

    const uploadedUrl =
      "secureUrl" in result && result.secureUrl ? result.secureUrl : result.url;

    return NextResponse.json({
      url: uploadedUrl,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    });
  } catch (error) {
    console.error("[api/upload]", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 }
    );
  }
}
