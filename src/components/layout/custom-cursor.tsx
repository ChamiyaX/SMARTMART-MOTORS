"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function CustomCursor() {
  const cursorRef = React.useRef<HTMLDivElement>(null);
  const ringRef = React.useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canHover) return;

    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-area");

    const onMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    };

    const onDown = () => {
      ringRef.current?.classList.add("scale-75");
    };
    const onUp = () => {
      ringRef.current?.classList.remove("scale-75");
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      document.documentElement.classList.remove("custom-cursor-area");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className={cn(
          "shadow-glow pointer-events-none fixed left-0 top-0 z-[90] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
        )}
      />
      <div
        ref={ringRef}
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-[89] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/50 transition-transform duration-150"
        )}
      />
    </>
  );
}
