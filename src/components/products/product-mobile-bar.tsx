"use client";

import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

type ProductMobileBarProps = {
  price: number | string;
  compareAtPrice?: number | string | null;
  whatsappHref: string;
};

export function ProductMobileBar({
  price,
  compareAtPrice,
  whatsappHref,
}: ProductMobileBarProps) {
  const onSale = compareAtPrice != null && Number(compareAtPrice) > Number(price);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#050505]/95 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden">
      <div className="container flex items-center gap-3 px-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Price
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-bold text-primary">
              {formatPrice(price)}
            </span>
            {onSale ? (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(compareAtPrice!)}
              </span>
            ) : null}
          </div>
        </div>
        <Button asChild variant="glow" size="lg" className="shrink-0 px-4">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </Button>
        <Button asChild variant="outline" size="icon" className="shrink-0">
          <Link href="/contact" aria-label="Contact us">
            <Mail className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
