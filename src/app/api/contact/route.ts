import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getMessagingSettings } from "@/lib/data/settings";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validations/contact";

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request);
    const limited = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 60_000 });
    if (!limited.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const messaging = await getMessagingSettings();
    if (!messaging.enabled) {
      return NextResponse.json(
        { error: "Messaging is currently disabled." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    if (data.honeypot) {
      return NextResponse.json({ success: true, message: "Message sent." });
    }

    await prisma.message.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject,
        message: data.message,
        productId: data.productId || null,
        ipAddress: ip,
        userAgent: request.headers.get("user-agent") || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Message sent — we'll get back to you soon.",
    });
  } catch (error) {
    console.error("[api/contact]", error);
    return NextResponse.json(
      { error: "Unable to send message right now." },
      { status: 500 }
    );
  }
}
