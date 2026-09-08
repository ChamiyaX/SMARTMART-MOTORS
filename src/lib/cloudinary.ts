import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

export type CloudinaryUploadResult = {
  url: string;
  secureUrl: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  resourceType?: string;
};

function assertConfigured() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error("Cloudinary environment variables are not configured");
  }
}

function mapUploadResult(result: UploadApiResponse): CloudinaryUploadResult {
  return {
    url: result.url,
    secureUrl: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
    resourceType: result.resource_type,
  };
}

export async function uploadImage(
  file: string | Buffer,
  options: {
    folder?: string;
    publicId?: string;
    tags?: string[];
    transformation?: Record<string, unknown>[];
  } = {}
): Promise<CloudinaryUploadResult> {
  assertConfigured();

  const folder =
    options.folder || process.env.CLOUDINARY_UPLOAD_FOLDER || "smartmart-motors";

  const uploadOptions = {
    folder,
    public_id: options.publicId,
    tags: options.tags,
    resource_type: "image" as const,
    overwrite: true,
    transformation: options.transformation,
  };

  if (typeof file === "string") {
    const result = await cloudinary.uploader.upload(file, uploadOptions);
    return mapUploadResult(result);
  }

  const result: UploadApiResponse = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, uploadResult) => {
        if (error || !uploadResult) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve(uploadResult);
      }
    );
    stream.end(file);
  });

  return mapUploadResult(result);
}

export async function deleteImage(publicId: string): Promise<boolean> {
  assertConfigured();

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });

  return result.result === "ok" || result.result === "not found";
}

export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string | number;
    format?: string;
    crop?: string;
  } = {}
): string {
  const { width, height, quality = "auto", format = "auto", crop = "fill" } = options;

  return cloudinary.url(publicId, {
    secure: true,
    transformation: [
      {
        width,
        height,
        crop: width || height ? crop : undefined,
        quality,
        fetch_format: format,
      },
    ],
  });
}

export default cloudinary;
