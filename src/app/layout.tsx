import type { Metadata } from "next";
import { Outfit, Syncopate } from "next/font/google";

import { Tracking, TrackingNoscript } from "@/components/analytics/tracking";
import { AppProviders } from "@/components/providers/app-providers";
import { SITE_CONFIG } from "@/lib/constants";
import { generateSeoMetadata } from "@/lib/seo";

import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const syncopate = Syncopate({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  ...generateSeoMetadata(),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/logo-mark.png", type: "image/png", sizes: "512x512" },
      { url: "/images/favicon.png", type: "image/png", sizes: "64x64" },
    ],
    shortcut: "/images/favicon.png",
    apple: "/images/logo-mark.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${syncopate.variable} min-h-screen font-sans antialiased`}
      >
        <Tracking />
        <TrackingNoscript />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
