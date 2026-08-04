import Link from "next/link";
import type { Product } from "@/types";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProductGrid } from "@/components/products/product-grid";
import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="container py-20">
      <FadeIn>
        <SectionHeading
          eyebrow="Curated"
          title="Featured Products"
          description="Hand-picked parts that define SmartMart quality and performance."
        />
      </FadeIn>
      <FadeIn delay={0.1}>
        <ProductGrid products={products} />
      </FadeIn>
      <div className="mt-10 text-center">
        <Button asChild variant="outline">
          <Link href="/products">View all products</Link>
        </Button>
      </div>
    </section>
  );
}
