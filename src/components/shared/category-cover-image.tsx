import Image from "next/image";

import { cn } from "@/lib/utils";

type CategoryCoverImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
};

export function CategoryCoverImage({
  src,
  alt,
  className,
  sizes = "(max-width:768px) 100vw, 33vw",
}: CategoryCoverImageProps) {
  const isLocalApi = src.startsWith("/api/");

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized={isLocalApi}
      className={cn("object-cover", className)}
      sizes={sizes}
    />
  );
}
