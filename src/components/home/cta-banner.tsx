import Link from "next/link";
import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";

type CtaBannerProps = {
  messagingEnabled?: boolean;
  whatsappLink?: string;
};

export function CtaBanner({
  messagingEnabled = true,
  whatsappLink = "https://wa.me/94775475141",
}: CtaBannerProps) {
  return (
    <section className="container py-16">
      <FadeIn>
        <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-r from-[#1a0505] via-[#111111] to-[#1a0505] px-8 py-14 text-center shadow-glow">
          <div className="mesh-bg pointer-events-none absolute inset-0 opacity-60" />
          <div className="relative z-10 mx-auto max-w-2xl space-y-4">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Ready for your electric tricycle?
            </h2>
            <p className="text-muted-foreground">
              Browse our models or talk to our team — we&apos;ll help you choose the right
              tricycle for your needs.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Button asChild variant="glow" size="lg">
                <Link href="/products">Shop now</Link>
              </Button>
              {messagingEnabled ? (
                <Button asChild variant="outline" size="lg">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp us
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
