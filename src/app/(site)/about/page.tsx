import Image from "next/image";
import Link from "next/link";

import { FadeIn } from "@/components/shared/fade-in";
import { SectionHeading } from "@/components/shared/section-heading";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Button } from "@/components/ui/button";
import { getPageContent } from "@/lib/data/settings";
import { SITE_CONFIG } from "@/lib/constants";
import { generateSeoMetadata } from "@/lib/seo";
import { safeQuery } from "@/lib/safe";

export const metadata = generateSeoMetadata({
  title: "About Us",
  path: "/about",
  description: `Learn about ${SITE_CONFIG.name} — premium automotive spare parts for Sri Lankan drivers and workshops.`,
});

const values = [
  {
    title: "Quality first",
    text: "We stock Chinese OEM-grade parts selected for fitment accuracy and durability.",
  },
  {
    title: "Honest guidance",
    text: "Tell us your vehicle — we’ll help you match the right component the first time.",
  },
  {
    title: "Island-wide reach",
    text: "From Colombo to every district, we ship parts where you need them.",
  },
];

export default async function AboutPage() {
  const page = await safeQuery(() => getPageContent("about"), null);
  const content =
    page?.content && typeof page.content === "object"
      ? (page.content as { headline?: string; body?: string; mission?: string })
      : null;

  return (
    <div className="container pb-20 pt-28">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About" }]} />

      <FadeIn>
        <SectionHeading
          eyebrow="Our story"
          title={content?.headline || page?.title || "About SmartMart Motors"}
          description={
            content?.body ||
            `${SITE_CONFIG.name} supplies premium automotive spare parts trusted by workshops and drivers across Sri Lanka.`
          }
          align="left"
        />
      </FadeIn>

      <div className="grid items-center gap-10 lg:grid-cols-2">
        <FadeIn delay={0.08}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10">
            <Image
              src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1200&q=80"
              alt="Automotive workshop"
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        </FadeIn>

        <FadeIn delay={0.12}>
          <div className="space-y-5 text-muted-foreground">
            <p className="text-base leading-relaxed text-white/80">
              {content?.mission ||
                "We started with a simple idea: make reliable OEM-quality parts easier to find, price, and fit — without the noise of overhyped retail."}
            </p>
            <p className="text-sm leading-relaxed">
              Based in {SITE_CONFIG.address}, we serve retail customers, garages, and
              fleet operators with curated inventory spanning engine, braking, suspension,
              lighting, and electrical categories.
            </p>
            <Button asChild variant="glow">
              <Link href="/products">Browse products</Link>
            </Button>
          </div>
        </FadeIn>
      </div>

      <div className="mt-20 grid gap-6 md:grid-cols-3">
        {values.map((item, index) => (
          <FadeIn key={item.title} delay={index * 0.06}>
            <div className="h-full rounded-xl p-6 glass">
              <h3 className="font-display text-lg font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
