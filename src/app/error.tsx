"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="mesh-bg pointer-events-none absolute inset-0 opacity-40" />
      <p className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-primary">
        Something went wrong
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold text-white">
        We hit a rough stretch
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        An unexpected error occurred. You can try again or return to the homepage.
      </p>
      <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-3">
        <Button variant="glow" onClick={reset}>
          Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
