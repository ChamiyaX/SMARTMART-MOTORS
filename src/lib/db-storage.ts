import { prisma } from "@/lib/prisma";

export type DbStorageUploadResult = {
  url: string;
  publicId: string;
  bytes: number;
  assetId: string;
};

export function isDatabaseStorageConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export async function uploadToDatabaseStorage(
  buffer: Buffer,
  filename: string,
  contentType: string,
  folder = "products"
): Promise<DbStorageUploadResult> {
  const asset = await prisma.mediaAsset.create({
    data: {
      url: "pending",
      filename,
      mimeType: contentType,
      size: buffer.byteLength,
      folder,
      data: Uint8Array.from(buffer),
    },
  });

  const url = `/api/files/${asset.id}`;

  await prisma.mediaAsset.update({
    where: { id: asset.id },
    data: { url, publicId: asset.id },
  });

  return {
    url,
    publicId: asset.id,
    bytes: buffer.byteLength,
    assetId: asset.id,
  };
}
