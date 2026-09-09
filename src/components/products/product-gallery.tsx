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
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl glass sm:aspect-square">
        <Image
          src={gallery[active]}
          alt={`${alt} — image ${active + 1}`}
          fill
          className="object-contain sm:object-cover"
          sizes="(max-width:768px) 100vw, 50vw"
          priority
        />
      </div>

      {gallery.length > 1 ? (
        <div className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {gallery.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={cn(
                "relative h-[4.5rem] w-[4.5rem] shrink-0 snap-start overflow-hidden rounded-lg border transition sm:h-16 sm:w-16",
                index === active
                  ? "border-primary shadow-glow"
                  : "border-white/10 hover:border-white/30"
              )}
              aria-label={`View image ${index + 1}`}
              aria-current={index === active ? "true" : undefined}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="72px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
