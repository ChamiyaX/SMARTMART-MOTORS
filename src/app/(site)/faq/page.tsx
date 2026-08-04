import { FaqAccordion } from "@/components/faq/faq-accordion";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SectionHeading } from "@/components/shared/section-heading";
import { getFaqs } from "@/lib/data/faqs";
import { faqJsonLd, generateSeoMetadata } from "@/lib/seo";
import { safeQuery } from "@/lib/safe";
import { serializeFaq } from "@/lib/serialize";

export const metadata = generateSeoMetadata({
  title: "FAQ",
  path: "/faq",
  description:
    "Frequently asked questions about orders, delivery, and parts at SmartMart Motors.",
});

export default async function FaqPage() {
  const faqsRaw = await safeQuery(() => getFaqs(), []);
  const faqs = faqsRaw.map(serializeFaq);

  return (
    <div className="container pb-20 pt-28">
      {faqs.length ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              faqJsonLd(faqs.map((f) => ({ question: f.question, answer: f.answer })))
            ),
          }}
        />
      ) : null}

      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
      <SectionHeading
        eyebrow="Help"
        title="Frequently asked questions"
        description="Quick answers about shipping, payments, compatibility, and support."
      />
      <FaqAccordion faqs={faqs} />
    </div>
  );
}
