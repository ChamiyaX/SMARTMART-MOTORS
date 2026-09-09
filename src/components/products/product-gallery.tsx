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
  const touchStartX = React.useRef<number | null>(null);

  function goTo(index: number) {
    setActive(Math.max(0, Math.min(index, gallery.length - 1)));
  }

  function onTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function onTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current == null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = touchStartX.current - endX;

    if (Math.abs(delta) > 48) {
      goTo(active + (delta > 0 ? 1 : -1));
    }

    touchStartX.current = null;
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div
        className="relative aspect-[4/3] max-h-[min(62vw,360px)] w-full overflow-hidden rounded-xl glass sm:aspect-square sm:max-h-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Image
          src={gallery[active]}
          alt={`${alt} — image ${active + 1}`}
          fill
          className="object-contain p-1 sm:object-cover sm:p-0"
          sizes="(max-width:768px) 100vw, 50vw"
          priority
        />
        {gallery.length > 1 ? (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/50 px-2 py-1 backdrop-blur-sm lg:hidden">
            {gallery.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goTo(index)}
                className={cn(
                  "h-2 w-2 rounded-full transition",
                  index === active ? "bg-primary" : "bg-white/35"
                )}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        ) : null}
      </div>

      {gallery.length > 1 ? (
        <div className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {gallery.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => goTo(index)}
              className={cn(
                "relative h-[4.5rem] w-[4.5rem] shrink-0 snap-start overflow-hidden rounded-lg border transition active:scale-95 sm:h-16 sm:w-16",
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
