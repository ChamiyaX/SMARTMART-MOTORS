import { NextResponse } from "next/server";

import { getUploadProvider } from "@/lib/upload";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "smartmart-motors",
    timestamp: new Date().toISOString(),
    upload: {
      provider: getUploadProvider(),
    },
  });
}
