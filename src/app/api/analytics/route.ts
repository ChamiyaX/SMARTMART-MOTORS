import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { createHash } from "crypto";

import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

const analyticsSchema = z.object({
  event: z.string().trim().min(1).max(100),
  path: z.string().trim().max(500).optional().nullable(),
  referrer: z.string().trim().max(500).optional().nullable(),
  productId: z.string().optional().nullable(),
  metadata: z.record(z.unknown()).optional().nullable(),
});

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const limited = rateLimit(`analytics:${ip}`, { limit: 60, windowMs: 60_000 });
    if (!limited.success) {
      return NextResponse.json({ error: "Rate limited" }, { status: 429 });
    }

    const body = await request.json();
    const parsed = analyticsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const data = parsed.data;

    await prisma.analyticsEvent.create({
      data: {
        event: data.event,
        path: data.path || null,
        referrer: data.referrer || null,
        userAgent: request.headers.get("user-agent") || null,
        ipHash: hashIp(ip),
        productId: data.productId || null,
        metadata: (data.metadata as Prisma.InputJsonValue | undefined) ?? undefined,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/analytics]", error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
