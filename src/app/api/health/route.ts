import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "smartmart-motors",
    timestamp: new Date().toISOString(),
  });
}
