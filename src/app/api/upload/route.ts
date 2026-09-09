import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "@/lib/auth";
import { MAX_UPLOAD_SIZE_MB } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { validateImageUpload } from "@/lib/upload-validation";
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
        { error: "Image upload is not available." },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `File exceeds ${MAX_UPLOAD_SIZE_MB}MB limit` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const validation = validateImageUpload(file, buffer);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const folder = String(formData.get("folder") || "smartmart-motors");
    const result = await uploadMedia(buffer, {
      folder,
      filename: file.name,
      contentType: validation.contentType,
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
    });
  } catch (error) {
    console.error("[api/upload]", error);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}
