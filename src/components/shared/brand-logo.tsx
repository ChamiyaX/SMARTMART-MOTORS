import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  href?: string | null;
  className?: string;
  /** visual height of the logo image */
  height?: number;
  priority?: boolean;
  /** show compact mark only */
  markOnly?: boolean;
  onClick?: () => void;
};

export function BrandLogo({
  href = "/",
  className,
  height = 40,
  priority = false,
  markOnly = false,
  onClick,
}: BrandLogoProps) {
  const src = markOnly ? "/images/logo-mark.png" : "/images/logo.png";
  const aspect = markOnly ? 1 : 1024 / 382;
  const width = Math.round(height * aspect);

  const image = (
    <Image
      src={src}
      alt="SmartMart Motors"
      width={width}
      height={height}
      priority={priority}
      className={cn(
        "h-auto max-h-full w-auto max-w-full object-contain object-left drop-shadow-[0_0_18px_rgba(225,6,0,0.22)]",
        className
      )}
      style={{ height, width: "auto" }}
    />
  );

  if (href === null) {
    return <span className="inline-flex items-center">{image}</span>;
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className="inline-flex max-w-full items-center transition-opacity hover:opacity-90"
      aria-label="SmartMart Motors home"
    >
      {image}
    </Link>
  );
}
