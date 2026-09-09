import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandLogo } from "@/components/shared/brand-logo";
import { DeveloperCreditBar } from "@/components/layout/developer-credit-bar";

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

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-secondary/80 backdrop-blur-xl">
      <div className="container grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-3">
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

      <DeveloperCreditBar />
    </footer>
  );
}
