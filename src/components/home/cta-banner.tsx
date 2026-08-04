import Link from "next/link";
import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="container py-16">
      <FadeIn>
        <div className="shadow-glow relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-r from-[#1a0505] via-[#111111] to-[#1a0505] px-8 py-14 text-center">
          <div className="mesh-bg pointer-events-none absolute inset-0 opacity-60" />
          <div className="relative z-10 mx-auto max-w-2xl space-y-4">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Ready to upgrade your ride?
            </h2>
            <p className="text-muted-foreground">
              Browse premium parts or talk to our team — we&apos;ll help you get the right
              fit the first time.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Button asChild variant="glow" size="lg">
                <Link href="/products">Shop now</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a
                  href="https://wa.me/94775475141"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp us
                </a>
              </Button>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
