const sanitizePhone = (phone: string) => phone.replace(/[^\d+]/g, "");

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "SmartMart Motors";

export const SITE_TAGLINE =
  process.env.NEXT_PUBLIC_SITE_TAGLINE || "Best Electric Tricycle for Your Needs";

export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

export const SITE_PHONE = process.env.NEXT_PUBLIC_SITE_PHONE || "0775475141";

export const SITE_EMAIL =
  process.env.NEXT_PUBLIC_SITE_EMAIL || "smartmartmotors@gmail.com";

export const SITE_WHATSAPP = process.env.NEXT_PUBLIC_SITE_WHATSAPP || "94775475141";

export const SITE_ADDRESS = process.env.NEXT_PUBLIC_SITE_ADDRESS || "Colombo, Sri Lanka";

export function buildWhatsAppLink(phone: string, message?: string): string {
  const digits = sanitizePhone(phone).replace(/^\+/, "");
  const base = `https://wa.me/${digits}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppLink(message?: string): string {
  return buildWhatsAppLink(SITE_WHATSAPP, message);
}

export const SITE_CONFIG = {
  name: SITE_NAME,
  tagline: SITE_TAGLINE,
  url: SITE_URL,
  phone: SITE_PHONE,
  email: SITE_EMAIL,
  whatsapp: SITE_WHATSAPP,
  whatsappLink: getWhatsAppLink(),
  address: SITE_ADDRESS,
  locale: "en-LK",
  currency: "LKR",
  social: {
    facebook:
      process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com/smartmartmotors",
    instagram:
      process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/smartmartmotors",
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || "",
  },
  developer: {
    name: "HelaCode",
    brand: "HelaCode",
    url: "https://helacode.lk/",
  },
} as const;

export const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR"] as const;

export const DEFAULT_PAGE_SIZE = 12;

export const MAX_UPLOAD_SIZE_MB = 10;
