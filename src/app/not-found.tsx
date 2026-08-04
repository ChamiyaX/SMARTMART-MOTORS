import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <div className="mesh-bg pointer-events-none absolute inset-0 opacity-50" />
      <p className="font-display text-7xl font-black text-primary sm:text-8xl">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        That route isn&apos;t in the {SITE_CONFIG.name} catalog. Head back home or browse
        our parts.
      </p>
      <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild variant="glow">
          <Link href="/">Go home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/products">Shop products</Link>
        </Button>
      </div>
    </div>
  );
}
