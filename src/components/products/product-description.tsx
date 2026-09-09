import { cn } from "@/lib/utils";

type ProductDescriptionProps = {
  description: string;
  className?: string;
};

/** Renders product copy exactly as entered in admin (line breaks preserved). */
export function ProductDescription({ description, className }: ProductDescriptionProps) {
  const text = description.replace(/\r\n/g, "\n");

  return (
    <p
      className={cn(
        "whitespace-pre-wrap break-words leading-relaxed text-white/80",
        className
      )}
    >
      {text}
    </p>
  );
}
