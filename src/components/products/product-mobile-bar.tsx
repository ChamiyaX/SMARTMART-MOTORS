"use client";

import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

type ProductMobileBarProps = {
  price: number | string;
  compareAtPrice?: number | string | null;
  whatsappHref: string;
  productName: string;
};

export function ProductMobileBar({
  price,
  compareAtPrice,
  whatsappHref,
  productName,
}: ProductMobileBarProps) {
  const onSale = compareAtPrice != null && Number(compareAtPrice) > Number(price);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#050505]/95 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden">
      <div className="container grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium text-white/70">{productName}</p>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg font-bold text-primary sm:text-xl">
              {formatPrice(price)}
            </span>
            {onSale ? (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(compareAtPrice!)}
              </span>
            ) : null}
          </div>
        </div>
        <Button
          asChild
          variant="glow"
          size="lg"
          className="h-12 min-w-[9.5rem] shrink-0 px-5"
        >
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}
