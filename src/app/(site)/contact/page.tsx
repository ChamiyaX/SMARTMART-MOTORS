import { Mail, MapPin, Phone, Clock } from "lucide-react";

import { ContactForm } from "@/components/contact/contact-form";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  BUSINESS_HOUR_DAYS,
  BUSINESS_HOUR_LABELS,
  DEFAULT_BUSINESS_HOURS,
} from "@/lib/business-hours";
import {
  getBusinessHours,
  getCompanySettings,
  getMessagingSettings,
} from "@/lib/data/settings";
import { SITE_CONFIG } from "@/lib/constants";
import { generateSeoMetadata } from "@/lib/seo";
import { safeQuery } from "@/lib/safe";

export const metadata = generateSeoMetadata({
  title: "Contact",
  path: "/contact",
  description: `Get in touch with ${SITE_CONFIG.name} for parts inquiries, wholesale, and support.`,
});

export default async function ContactPage() {
  const [company, hours, messaging] = await Promise.all([
    safeQuery(() => getCompanySettings(), {
      name: SITE_CONFIG.name,
      tagline: SITE_CONFIG.tagline,
      address: SITE_CONFIG.address,
      phone: SITE_CONFIG.phone,
      email: SITE_CONFIG.email,
      whatsapp: SITE_CONFIG.whatsapp,
    }),
    safeQuery(() => getBusinessHours(), DEFAULT_BUSINESS_HOURS),
    safeQuery(() => getMessagingSettings(), { enabled: true }),
  ]);

  const mapQuery = encodeURIComponent(company.address || SITE_CONFIG.address);
  const hourEntries = BUSINESS_HOUR_DAYS.map((day) => [day, hours?.[day] ?? ""] as const);

  return (
    <div className="container pb-20 pt-28">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <SectionHeading
        eyebrow="Reach us"
        title="Contact"
        description="Questions about fitment, stock, or wholesale? Send a message or visit us."
        align="left"
      />

      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-6">
          <div className="space-y-5 rounded-xl p-6 glass">
            <div className="flex gap-3">
              <Phone className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Phone
                </p>
                <a
                  href={`tel:${company.phone}`}
                  className="text-white transition hover:text-primary"
                >
                  {company.phone}
                </a>
              </div>
            </div>
            <div className="flex gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Email
                </p>
                <a
                  href={`mailto:${company.email}`}
                  className="text-white transition hover:text-primary"
                >
                  {company.email}
                </a>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Address
                </p>
                <p className="text-white">{company.address}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl p-6 glass">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
                Business hours
              </h2>
            </div>
            <ul className="space-y-2 text-sm">
              {hourEntries.map(([day, time]) => (
                <li key={day} className="flex justify-between gap-4">
                  <span className="text-muted-foreground">{BUSINESS_HOUR_LABELS[day]}</span>
                  <span className="text-white">{time}</span>
                </li>
              ))}
            </ul>
            {hours?.note ? (
              <p className="mt-4 text-xs text-muted-foreground">{hours.note}</p>
            ) : null}
          </div>

          <div className="overflow-hidden rounded-xl border border-white/10">
            <iframe
              title="SmartMart Motors location"
              src={`https://www.google.com/maps?q=${mapQuery}&hl=en&z=14&output=embed`}
              className="h-64 w-full contrast-125 grayscale invert-[0.9]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block border-t border-white/10 bg-white/[0.03] px-4 py-2.5 text-center text-xs text-muted-foreground transition hover:text-primary"
            >
              Open in Google Maps
            </a>
          </div>
        </div>

        {messaging.enabled ? (
          <ContactForm />
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-sm text-muted-foreground">
            Online messaging is currently unavailable. Please call us using the details on
            the left.
          </div>
        )}
      </div>
    </div>
  );
}
