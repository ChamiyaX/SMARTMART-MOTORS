import { ShieldCheck, Truck, Wrench, Headset } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/fade-in";
import { SITE_CONFIG } from "@/lib/constants";

const signals = [
  {
    icon: ShieldCheck,
    title: "Genuine quality",
    text: "Tricycles built for reliability and everyday use.",
  },
  {
    icon: Truck,
    title: "Island-wide delivery",
    text: "Fast dispatch across Sri Lanka.",
  },
  {
    icon: Wrench,
    title: "Expert guidance",
    text: "Guidance to help you choose the right model.",
  },
  {
    icon: Headset,
    title: "Responsive support",
    text: "Call or WhatsApp when you need answers.",
  },
];

export function WhyUs() {
  return (
    <section className="container py-20">
      <FadeIn>
        <SectionHeading
          eyebrow="Why SmartMart"
          title="Built on Trust"
          description={`${SITE_CONFIG.tagline} — clarity, quality, and care.`}
        />
      </FadeIn>

      <div className="mx-auto grid max-w-4xl gap-10 sm:grid-cols-2">
        {signals.map((item, index) => (
          <FadeIn key={item.title} delay={index * 0.08}>
            <div className="flex gap-4 border-l border-primary/40 pl-5">
              <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h3 className="font-display text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
