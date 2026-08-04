import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/fade-in";
import { cn } from "@/lib/utils";

interface CategoriesShowcaseProps {
  categories: Category[];
}

export function CategoriesShowcase({ categories }: CategoriesShowcaseProps) {
  return (
    <section className="container py-20">
      <FadeIn>
        <SectionHeading
          eyebrow="Browse"
          title="Shop by Category"
          description="Find the right parts faster — organized for how you build and maintain."
        />
      </FadeIn>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
          <FadeIn key={category.id} delay={index * 0.06}>
            <Link
              href={`/categories/${category.slug}`}
              className={cn(
                "group relative block aspect-[16/10] overflow-hidden rounded-xl border border-white/10"
              )}
            >
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-xl font-semibold text-white transition-colors group-hover:text-primary">
                  {category.name}
                </h3>
                {category.description ? (
                  <p className="mt-1 line-clamp-2 text-sm text-white/60">
                    {category.description}
                  </p>
                ) : null}
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
