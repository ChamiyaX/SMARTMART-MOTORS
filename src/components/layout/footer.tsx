import type { ComponentType } from "react";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandLogo } from "@/components/shared/brand-logo";
import { DeveloperCreditBar } from "@/components/layout/developer-credit-bar";
import { SITE_CONFIG } from "@/lib/constants";
import type { SocialSettings } from "@/lib/data/settings";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v8h4v-8h3.2l.8-4H13V9c0-.6.4-1 1-1z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.5 3h-2.2c.2 1.4 1 2.6 2.2 3.3V3zm2.2 3.4c-1.4-.1-2.7-.7-3.7-1.6v8.2c0 3.2-2.6 5.8-5.8 5.8S3.4 16.2 3.4 13s2.6-5.8 5.8-5.8c.3 0 .7 0 1 .1v2.3a3.5 3.5 0 0 0-1-.2 3.5 3.5 0 1 0 3.5 3.5V3.4h2.2c.2 1.2 1 2.2 2 2.8V6.4z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18 5 12 5 12 5s-6 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8C2 9 2 12 2 12s0 3 .4 4.8a2.5 2.5 0 0 0 1.8 1.8C6 19 12 19 12 19s6 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.8.4-4.8.4-4.8s0-3-.4-4.8zM10 15.5V8.5l6 3.5-6 3.5z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.5 8.5h3v11h-3v-11zm1.5-4.5c1 0 1.8.8 1.8 1.8S9 7.6 8 7.6 6.2 6.8 6.2 5.8 7 4 7.5 4zm4 4.5h2.9v1.5h.1c.4-.8 1.5-1.7 3.1-1.7 3.3 0 3.9 2.2 3.9 5v5.2h-3v-4.6c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4v4.7h-3v-11z" />
    </svg>
  );
}

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact", messagingOnly: true },
  { href: "/faq", label: "FAQ" },
];

const socialIconClass =
  "rounded-md border border-white/10 p-2 text-muted-foreground transition hover:border-primary/50 hover:text-primary hover:shadow-glow";

type FooterProps = {
  messagingEnabled?: boolean;
  social?: SocialSettings;
};

function buildSocialLinks(social: SocialSettings | undefined) {
  if (!social) return [];

  const entries: {
    href: string;
    label: string;
    Icon: ComponentType<{ className?: string }>;
  }[] = [];

  if (social.facebook?.trim()) {
    entries.push({ href: social.facebook.trim(), label: "Facebook", Icon: FacebookIcon });
  }
  if (social.instagram?.trim()) {
    entries.push({
      href: social.instagram.trim(),
      label: "Instagram",
      Icon: InstagramIcon,
    });
  }
  if (social.youtube?.trim()) {
    entries.push({ href: social.youtube.trim(), label: "YouTube", Icon: YouTubeIcon });
  }
  if (social.tiktok?.trim()) {
    entries.push({ href: social.tiktok.trim(), label: "TikTok", Icon: TikTokIcon });
  }
  if (social.linkedin?.trim()) {
    entries.push({ href: social.linkedin.trim(), label: "LinkedIn", Icon: LinkedInIcon });
  }

  return entries;
}

export function Footer({ messagingEnabled = true, social }: FooterProps) {
  const links = quickLinks.filter((link) => messagingEnabled || !link.messagingOnly);
  const socialLinks = buildSocialLinks(social);

  return (
    <footer className="mt-24 border-t border-white/10 bg-secondary/80 backdrop-blur-xl">
      <div className="container grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-4">
          <BrandLogo height={48} className="max-w-[220px]" />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            {SITE_CONFIG.tagline} — quality electric tricycles for Sri Lanka.
          </p>
          {socialLinks.length ? (
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={socialIconClass}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-white">
            Quick Links
          </h3>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground transition hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
            Contact
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <a href="tel:0317506660" className="hover:text-white">
                0317506660
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:smartmartmotors@gmail.com" className="hover:text-white">
                smartmartmotors@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>Sri Lanka</span>
            </li>
          </ul>

          <div className="space-y-2 pt-2">
            <p className="text-sm font-medium text-white">Newsletter</p>
            <form className="flex gap-2" action="#" method="post">
              <Input
                type="email"
                name="email"
                placeholder="Your email"
                aria-label="Newsletter email"
              />
              <Button type="submit" variant="default">
                Join
              </Button>
            </form>
          </div>
        </div>
      </div>

      <DeveloperCreditBar />
    </footer>
  );
}
