import {
  isCloudinaryConfigured,
  uploadImage,
  type CloudinaryUploadResult,
} from "@/lib/cloudinary";
import {
  isSupabaseStorageConfigured,
  uploadToSupabaseStorage,
  type StorageUploadResult,
} from "@/lib/storage";

export type MediaUploadResult = CloudinaryUploadResult | StorageUploadResult;

export function getUploadProvider(): "cloudinary" | "supabase" | null {
  if (isCloudinaryConfigured()) return "cloudinary";
  if (isSupabaseStorageConfigured()) return "supabase";
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

  if (provider === "cloudinary") {
    return uploadImage(buffer, { folder: options.folder });
  }

  if (provider === "supabase") {
    return uploadToSupabaseStorage(
      buffer,
      options.filename,
      options.contentType,
      options.folder?.replace(/^smartmart-motors\/?/, "") || "products"
    );
  }

  throw new Error(
    "Image upload is not configured. Add Cloudinary keys on Vercel, or ensure Supabase storage is set up."
  );
}
