import { createAdminClient } from "@/lib/supabase/admin";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/env";

export type StorageUploadResult = {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
};

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "smartmart-media";

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "upload";
}

export function isSupabaseStorageConfigured() {
  return Boolean(getSupabaseUrl() && getSupabaseServiceRoleKey());
}

async function ensureBucket() {
  const supabase = createAdminClient();
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    throw new Error(listError.message);
  }

  if (buckets?.some((bucket) => bucket.id === BUCKET || bucket.name === BUCKET)) {
    return supabase;
  }

  const { error: createError } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024,
    allowedMimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/avif",
    ],
  });

  if (createError && !/already exists/i.test(createError.message)) {
    throw new Error(
      `Could not create storage bucket "${BUCKET}". Run supabase/migrations/002_storage_bucket.sql in Supabase SQL editor. (${createError.message})`
    );
  }

  return supabase;
}

export async function uploadToSupabaseStorage(
  buffer: Buffer,
  filename: string,
  contentType: string,
  folder = "products"
): Promise<StorageUploadResult> {
  const supabase = await ensureBucket();
  const safeName = sanitizeFilename(filename);
  const path = `${folder}/${Date.now()}-${safeName}`;

  const { data, error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType,
    upsert: false,
    cacheControl: "31536000",
  });

  if (error) {
    if (/bucket/i.test(error.message)) {
      throw new Error(
        `Storage bucket "${BUCKET}" is missing. Run supabase/migrations/002_storage_bucket.sql in Supabase SQL editor.`
      );
    }
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(data.path);

  return {
    url: publicUrl,
    publicId: data.path,
    bytes: buffer.byteLength,
  };
}

export async function deleteFromSupabaseStorage(publicId: string) {
  if (!isSupabaseStorageConfigured()) return false;

  const supabase = createAdminClient();
  const { error } = await supabase.storage.from(BUCKET).remove([publicId]);
  return !error;
}
