import {
  isCloudinaryConfigured,
  uploadImage,
  type CloudinaryUploadResult,
} from "@/lib/cloudinary";
import {
  isDatabaseStorageConfigured,
  uploadToDatabaseStorage,
  type DbStorageUploadResult,
} from "@/lib/db-storage";
import {
  isSupabaseStorageConfigured,
  uploadToSupabaseStorage,
  type StorageUploadResult,
} from "@/lib/storage";

export type MediaUploadResult =
  CloudinaryUploadResult | StorageUploadResult | DbStorageUploadResult;

export type UploadProvider = "cloudinary" | "supabase" | "database";

export function getUploadProvider(): UploadProvider | null {
  if (isCloudinaryConfigured()) return "cloudinary";
  if (isSupabaseStorageConfigured()) return "supabase";
  if (isDatabaseStorageConfigured()) return "database";
  return null;
}

export async function uploadMedia(
  buffer: Buffer,
  options: {
    filename: string;
    contentType: string;
    folder?: string;
  }
): Promise<MediaUploadResult> {
  const provider = getUploadProvider();
  const folder = options.folder?.replace(/^smartmart-motors\/?/, "") || "products";

  if (provider === "cloudinary") {
    return uploadImage(buffer, { folder: options.folder });
  }

  if (provider === "supabase") {
    return uploadToSupabaseStorage(buffer, options.filename, options.contentType, folder);
  }

  if (provider === "database") {
    return uploadToDatabaseStorage(buffer, options.filename, options.contentType, folder);
  }

  throw new Error(
    "Image upload is not configured. Set DATABASE_URL (already used for products) or add SUPABASE_SERVICE_ROLE_KEY / Cloudinary keys on Vercel."
  );
}
