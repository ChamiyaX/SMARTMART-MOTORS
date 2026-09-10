import type { Brand } from "@/types";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/fade-in";
import { cn } from "@/lib/utils";

interface BrandsMarqueeProps {
  brands: Brand[];
  className?: string;
}

const fallbackBrands: Pick<Brand, "id" | "name" | "slug">[] = [
  { id: "1", name: "Bosch", slug: "bosch" },
  { id: "2", name: "Denso", slug: "denso" },
  { id: "3", name: "NGK", slug: "ngk" },
  { id: "4", name: "Brembo", slug: "brembo" },
  { id: "5", name: "Monroe", slug: "monroe" },
  { id: "6", name: "Philips", slug: "philips" },
];

export function BrandsMarquee({ brands, className }: BrandsMarqueeProps) {
  const items = brands.length ? brands : fallbackBrands;
  const loop = [...items, ...items];

  return (
    <section className={cn("overflow-hidden py-16", className)}>
      <FadeIn>
        <SectionHeading
          eyebrow="Trusted"
          title="Brands We Carry"
          description="Trusted brands for electric tricycles across Sri Lanka."
        />
      </FadeIn>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#050505] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#050505] to-transparent" />
        <div className="animate-marquee flex w-max gap-10">
          {loop.map((brand, i) => (
            <div
              key={`${brand.id}-${i}`}
              className="flex h-16 min-w-[160px] items-center justify-center border-y border-white/5 px-6 text-sm font-semibold uppercase tracking-[0.25em] text-white/50"
            >
              {brand.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
