const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const SIGNATURES: Array<{ mime: string; bytes: number[] }> = [
  { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mime: "image/gif", bytes: [0x47, 0x49, 0x46] },
  { mime: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46] },
];

function matchesSignature(buffer: Buffer, signature: number[]) {
  if (buffer.length < signature.length) return false;
  return signature.every((byte, index) => buffer[index] === byte);
}

export function validateImageUpload(file: File, buffer: Buffer) {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return {
      ok: false as const,
      error: "Only JPEG, PNG, WebP, GIF, and AVIF images are allowed.",
    };
  }

  if (file.type === "image/avif") {
    // AVIF uses ISOBMFF; accept when declared and non-empty.
    if (buffer.length < 12) {
      return { ok: false as const, error: "Invalid image file." };
    }
    return { ok: true as const, contentType: file.type };
  }

  const signature = SIGNATURES.find((entry) => entry.mime === file.type);
  if (!signature || !matchesSignature(buffer, signature.bytes)) {
    return { ok: false as const, error: "File content does not match its image type." };
  }

  if (file.type === "image/webp") {
    const webpTag = buffer.subarray(8, 12).toString("ascii");
    if (webpTag !== "WEBP") {
      return { ok: false as const, error: "Invalid WebP image." };
    }
  }

  return { ok: true as const, contentType: file.type };
}
