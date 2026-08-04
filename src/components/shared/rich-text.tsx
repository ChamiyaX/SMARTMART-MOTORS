import { cn } from "@/lib/utils";

function sanitizeHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/on\w+\s*=\s*("|')[^"']*\1/gi, "")
    .replace(/javascript:/gi, "");
}

interface RichTextProps {
  html: string;
  className?: string;
}

export function RichText({ html, className }: RichTextProps) {
  const clean = sanitizeHtml(html);

  return (
    <div
      className={cn(
        "prose prose-invert prose-headings:font-display prose-a:text-primary prose-strong:text-white max-w-none",
        className
      )}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
