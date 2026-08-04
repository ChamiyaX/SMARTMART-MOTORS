"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, UploadCloud } from "lucide-react";

type MediaItem = {
  id: string;
  url: string;
  filename: string;
  folder: string | null;
  createdAt: Date | string;
};

export function MediaUploader({ items }: { items: MediaItem[] }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  async function uploadFile(file: File) {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "smartmart-motors/media");
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      toast.success("Uploaded successfully");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) void uploadFile(file);
        }}
        className={`relative flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-14 transition ${
          dragOver ? "border-primary bg-primary/10" : "border-white/15 bg-white/[0.02]"
        }`}
      >
        {uploading ? (
          <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
        ) : (
          <UploadCloud className="mb-3 h-8 w-8 text-primary" />
        )}
        <p className="text-sm text-white/70">
          Drag & drop an image, or{" "}
          <label className="cursor-pointer text-primary hover:underline">
            browse
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void uploadFile(file);
                e.target.value = "";
              }}
            />
          </label>
        </p>
        <p className="mt-1 text-xs text-white/35">PNG, JPG, WEBP up to 10MB</p>
      </div>

      {items.length === 0 ? (
        <p className="py-10 text-center text-sm text-white/40">No media assets yet</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
            >
              <div className="relative aspect-square bg-black/40">
                <Image
                  src={item.url}
                  alt={item.filename}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="p-3">
                <p className="truncate text-xs text-white/70">{item.filename}</p>
                <p className="truncate text-[10px] text-white/35">
                  {item.folder || "media"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
