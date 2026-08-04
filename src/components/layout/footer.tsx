import Link from "next/link";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { BrandLogo } from "@/components/shared/brand-logo";
import { SITE_CONFIG } from "@/lib/constants";

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

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

const categories = [
  { href: "/categories/engine", label: "Engine Parts" },
  { href: "/categories/brakes", label: "Brakes" },
  { href: "/categories/lighting", label: "Lighting" },
  { href: "/categories/suspension", label: "Suspension" },
  { href: "/categories/accessories", label: "Accessories" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-secondary/80 backdrop-blur-xl">
      <div className="container grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <BrandLogo height={48} className="max-w-[220px]" />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Premium automotive parts and accessories — performance you can trust, crafted
            for Sri Lankan roads.
          </p>
          <div className="flex gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="rounded-md border border-white/10 p-2 text-muted-foreground transition hover:border-primary/50 hover:text-primary hover:shadow-glow"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="rounded-md border border-white/10 p-2 text-muted-foreground transition hover:border-primary/50 hover:text-primary hover:shadow-glow"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-white">
            Quick Links
          </h3>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
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

        <div>
          <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-white">
            Categories
          </h3>
          <ul className="space-y-2">
            {categories.map((link) => (
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
              <a href="tel:0775475141" className="hover:text-white">
                0775475141
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

      <Separator />
      <div className="container py-6 pb-16 text-center text-xs text-muted-foreground sm:text-left">
        <p>© {new Date().getFullYear()} SmartMart Motors. All rights reserved.</p>
      </div>

      {/* Fixed developer credit — always visible at bottom */}
      <div className="bg-[#050505]/92 fixed inset-x-0 bottom-0 z-50 border-t border-white/10 backdrop-blur-xl">
        <div className="container flex h-10 items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground sm:justify-between sm:text-left sm:text-xs">
          <p className="hidden text-white/35 sm:block">
            Premium parts. Precision service.
          </p>
          <p className="flex flex-wrap items-center justify-center gap-1.5">
            <span>Developed by</span>
            <a
              href={SITE_CONFIG.developer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-white/85 transition hover:text-primary"
            >
              {SITE_CONFIG.developer.name}
              <ExternalLink className="h-3 w-3 opacity-70" aria-hidden />
            </a>
            <span className="text-white/25">·</span>
            <a
              href={SITE_CONFIG.developer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-teal transition hover:text-primary"
            >
              {SITE_CONFIG.developer.brand}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
