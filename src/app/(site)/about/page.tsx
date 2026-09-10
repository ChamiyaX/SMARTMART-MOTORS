import Image from "next/image";
import Link from "next/link";

import { FadeIn } from "@/components/shared/fade-in";
import { SectionHeading } from "@/components/shared/section-heading";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Button } from "@/components/ui/button";
import { parseAboutContent } from "@/lib/about-page";
import { getPageContent } from "@/lib/data/settings";
import { SITE_CONFIG } from "@/lib/constants";
import { generateSeoMetadata } from "@/lib/seo";
import { safeQuery } from "@/lib/safe";
import { resolveMediaUrl } from "@/lib/utils";

export async function generateMetadata() {
  const page = await safeQuery(() => getPageContent("about"), null);

  return generateSeoMetadata({
    title: page?.seoTitle || "About Us",
    description:
      page?.seoDescription ||
      `Learn about ${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    path: "/about",
  });
}

export default async function AboutPage() {
  const page = await safeQuery(() => getPageContent("about"), null);
  const content = parseAboutContent(page?.content, page?.title);
  const imageSrc = resolveMediaUrl(content.imageUrl);

  if (page && !page.isPublished) {
    return (
      <div className="container pb-20 pt-28">
        <p className="text-muted-foreground">This page is currently unavailable.</p>
      </div>
    );
  }

  return (
    <div className="container pb-20 pt-28">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About" }]} />

      <FadeIn>
        <SectionHeading
          eyebrow="Our story"
          title={content.headline}
          description={content.body}
          align="left"
        />
      </FadeIn>

      <div className="grid items-center gap-10 lg:grid-cols-2">
        <FadeIn delay={0.08}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10">
            <Image
              src={imageSrc}
              alt={content.headline}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
              priority
              unoptimized={imageSrc.startsWith("/api/")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        </FadeIn>

        <FadeIn delay={0.12}>
          <div className="space-y-5 text-muted-foreground">
            <p className="text-base leading-relaxed text-white/80">{content.mission}</p>
            <p className="text-sm leading-relaxed">{content.story}</p>
            <Button asChild variant="glow">
              <Link href="/products">Browse products</Link>
            </Button>
          </div>
        </FadeIn>
      </div>

      <div className="mt-20 grid gap-6 md:grid-cols-3">
        {content.values.map((item, index) => (
          <FadeIn key={`${item.title}-${index}`} delay={index * 0.06}>
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
