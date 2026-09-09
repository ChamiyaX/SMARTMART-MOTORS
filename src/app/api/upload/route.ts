import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "@/lib/auth";
import { MAX_UPLOAD_SIZE_MB } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { getUploadProvider, uploadMedia } from "@/lib/upload";

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

    const provider = getUploadProvider();
    if (!provider) {
      return NextResponse.json(
        {
          error:
            "Image upload is not configured. Set DATABASE_URL on Vercel, or add SUPABASE_SERVICE_ROLE_KEY / Cloudinary keys.",
        },
        { status: 503 }
      );
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

    if (provider !== "database") {
      await prisma.mediaAsset.create({
        data: {
          url: uploadedUrl,
          publicId: result.publicId,
          filename: file.name,
          mimeType: file.type,
          size: file.size,
          width: "width" in result ? (result.width ?? null) : null,
          height: "height" in result ? (result.height ?? null) : null,
          folder,
        },
      });
    }

    return NextResponse.json({
      url: uploadedUrl,
      publicId: result.publicId,
      width: "width" in result ? result.width : undefined,
      height: "height" in result ? result.height : undefined,
      format: "format" in result ? result.format : undefined,
      bytes: result.bytes,
      provider,
    });
  } catch (error) {
    console.error("[api/upload]", error);

    const message = error instanceof Error ? error.message : "Upload failed";
    const hint = /column.*data|Unknown arg.*data/i.test(message)
      ? " Run supabase/migrations/003_media_asset_data.sql in Supabase SQL editor, then redeploy."
      : "";

    return NextResponse.json({ error: `${message}${hint}` }, { status: 500 });
  }
}
