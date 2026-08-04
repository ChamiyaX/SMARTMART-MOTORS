import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SITE_CONFIG } from "@/lib/constants";
import { generateSeoMetadata } from "@/lib/seo";

export const metadata = generateSeoMetadata({
  title: "Terms of Service",
  path: "/terms",
  description: `Terms of service for ${SITE_CONFIG.name}.`,
});

export default function TermsPage() {
  return (
    <div className="container max-w-3xl pb-20 pt-28">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]} />
      <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
        Terms of Service
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: August 4, 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-white">Agreement</h2>
          <p>
            By accessing {SITE_CONFIG.url} or purchasing from {SITE_CONFIG.name}, you
            agree to these terms. If you do not agree, please do not use our site or
            services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-white">
            Products & pricing
          </h2>
          <p>
            Product availability, specifications, and prices may change without notice.
            Images are illustrative; fitment depends on vehicle make, model, and year.
            Confirm compatibility before ordering.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-white">
            Orders & payment
          </h2>
          <p>
            Orders are confirmed once we verify stock and payment terms. We may refuse or
            cancel orders in cases of pricing errors, suspected fraud, or unavailability.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-white">Delivery</h2>
          <p>
            Delivery estimates are approximate. Risk of loss passes when goods are handed
            to the courier or collected in person, unless otherwise agreed.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-white">Returns</h2>
          <p>
            Unused, correctly ordered parts may be eligible for return within a reasonable
            window subject to inspection. Electrical parts, specially ordered items, and
            fitted/used parts are typically non-returnable. Contact us before returning
            any product.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-white">
            Limitation of liability
          </h2>
          <p>
            To the fullest extent permitted by law, {SITE_CONFIG.name} is not liable for
            indirect or consequential losses arising from use of our site or products.
            Installation should be performed by qualified technicians.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-white">Contact</h2>
          <p>
            {SITE_CONFIG.email} · {SITE_CONFIG.phone} · {SITE_CONFIG.address}.
          </p>
        </section>
      </div>
    </div>
  );
}
