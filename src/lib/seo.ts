import type { Metadata } from "next";

import { SITE_CONFIG } from "@/lib/constants";
import { absoluteUrl } from "@/lib/utils";

type MetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string | null;
  noIndex?: boolean;
  keywords?: string[];
};

export function generateSeoMetadata({
  title,
  description,
  path = "",
  image,
  noIndex = false,
  keywords = [],
}: MetadataInput = {}): Metadata {
  const pageTitle = title
    ? `${title} | ${SITE_CONFIG.name}`
    : `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`;

  const pageDescription =
    description ||
    "Premium Chinese OEM automotive spare parts for Toyota, Honda, Nissan, Suzuki and more across Sri Lanka.";

  const url = absoluteUrl(path);
  const ogImage = image || absoluteUrl("/og-default.jpg");

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: keywords.length
      ? keywords
      : [
          "auto spare parts Sri Lanka",
          "OEM car parts",
          "SmartMart Motors",
          "Chinese OEM parts",
        ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: "en_LK",
      url,
      siteName: SITE_CONFIG.name,
      title: pageTitle,
      description: pageDescription,
      images: [{ url: ogImage, width: 1200, height: 630, alt: SITE_CONFIG.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    email: SITE_CONFIG.email,
    telephone: SITE_CONFIG.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Colombo",
      addressCountry: "LK",
      streetAddress: SITE_CONFIG.address,
    },
    sameAs: [
      SITE_CONFIG.social.facebook,
      SITE_CONFIG.social.instagram,
      SITE_CONFIG.social.youtube,
    ].filter(Boolean),
  };
}

type ProductJsonLdInput = {
  name: string;
  description: string;
  sku: string;
  slug: string;
  price: number | string;
  image?: string | null;
  brand?: string | null;
  availability?: "InStock" | "OutOfStock" | "PreOrder" | "LimitedAvailability";
};

export function productJsonLd(product: ProductJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: product.image ? [product.image] : undefined,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/products/${product.slug}`),
      priceCurrency: "LKR",
      price: String(product.price),
      availability: `https://schema.org/${product.availability || "InStock"}`,
      seller: {
        "@type": "Organization",
        name: SITE_CONFIG.name,
      },
    },
  };
}

type FaqItem = { question: string; answer: string };

export function faqJsonLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

type BreadcrumbItem = { name: string; path: string };

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
