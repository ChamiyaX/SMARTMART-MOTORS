import type { NextRequest } from "next/server";

export function getRequestIp(source?: Request | NextRequest | Headers | null): string {
  const headers = source instanceof Headers ? source : source?.headers;

  if (!headers) return "unknown";

  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return headers.get("x-real-ip") || "unknown";
}
