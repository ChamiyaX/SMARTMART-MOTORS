import { NextResponse } from "next/server";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ ok: true });
  }

  const { getUploadProvider } = await import("@/lib/upload");

  return NextResponse.json({
    ok: true,
    service: "smartmart-motors",
    timestamp: new Date().toISOString(),
    upload: {
      provider: getUploadProvider(),
    },
  });
}
