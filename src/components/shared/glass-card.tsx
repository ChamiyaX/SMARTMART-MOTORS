import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverGlow?: boolean;
}

export function GlassCard({
  className,
  hoverGlow = true,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn("rounded-xl p-6 glass", hoverGlow && "neon-glow-hover", className)}
      {...props}
    >
      {children}
    </div>
  );
}
