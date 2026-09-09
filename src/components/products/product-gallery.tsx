"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types";

interface ProductGalleryProps {
  images: ProductImage[] | string[];
  alt: string;
  className?: string;
}

function toUrls(images: ProductImage[] | string[]): string[] {
  if (!images.length) return ["/placeholder-product.jpg"];
  if (typeof images[0] === "string") return images as string[];
  return (images as ProductImage[])
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((img) => img.url);
}

export function ProductGallery({ images, alt, className }: ProductGalleryProps) {
  const gallery = toUrls(images);
  const [active, setActive] = React.useState(0);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10">
        <Image
          src={gallery[active]}
          alt={`${alt} — image ${active + 1}`}
          fill
          className="object-cover"
          sizes="(max-width:1024px) 100vw, 50vw"
          priority
        />
      </div>

      {gallery.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {gallery.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border transition",
                index === active
                  ? "border-primary shadow-glow"
                  : "border-white/10 hover:border-white/30"
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
