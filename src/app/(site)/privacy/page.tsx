import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SITE_CONFIG } from "@/lib/constants";
import { generateSeoMetadata } from "@/lib/seo";

export const metadata = generateSeoMetadata({
  title: "Privacy Policy",
  path: "/privacy",
  description: `Privacy policy for ${SITE_CONFIG.name}.`,
});

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl pb-20 pt-28">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
      <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: August 4, 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-white">Who we are</h2>
          <p>
            {SITE_CONFIG.name} (&quot;we&quot;, &quot;us&quot;) operates {SITE_CONFIG.url}
            . We sell electric tricycles and related services in Sri Lanka. Contact:{" "}
            {SITE_CONFIG.email}.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-white">
            Information we collect
          </h2>
          <p>
            When you contact us, inquire about a product, or use our site, we may collect
            your name, email, phone number, message content, and basic technical data such
            as IP address, browser type, and pages visited.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-white">
            How we use information
          </h2>
          <p>
            We use your information to respond to inquiries, process orders, improve our
            website, prevent abuse, and comply with legal obligations. We do not sell your
            personal data.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-white">
            Cookies & analytics
          </h2>
          <p>
            We may use cookies and analytics tools (such as Google Analytics, Google Tag
            Manager, or Microsoft Clarity) when configured, to understand site usage. You
            can control cookies via your browser settings.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-white">
            Data retention & security
          </h2>
          <p>
            We retain contact and order-related data only as long as needed for business
            and legal purposes. We apply reasonable technical and organizational measures
            to protect your information.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-white">Your rights</h2>
          <p>
            You may request access, correction, or deletion of personal data we hold about
            you by emailing {SITE_CONFIG.email}.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-white">Contact</h2>
          <p>
            Questions about this policy: {SITE_CONFIG.email} · {SITE_CONFIG.phone} ·{" "}
            {SITE_CONFIG.address}.
          </p>
        </section>
      </div>
    </div>
  );
}
