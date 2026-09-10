"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/shared/brand-logo";
import { SITE_CONFIG } from "@/lib/constants";

type HeroProps = {
  messagingEnabled?: boolean;
  phone?: string;
  tagline?: string;
};

export function Hero({
  messagingEnabled = true,
  phone = "0775475141",
  tagline = SITE_CONFIG.tagline,
}: HeroProps) {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      <div className="mesh-bg absolute inset-0" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-[#050505]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] to-transparent" />

      <div className="container relative z-10 flex min-h-[100svh] flex-col justify-center pb-20 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55 }}
          className="mb-8"
        >
          <BrandLogo
            href={null}
            height={120}
            priority
            className="w-auto max-w-[min(92vw,560px)] drop-shadow-[0_0_40px_rgba(225,6,0,0.35)] md:max-w-[640px]"
          />
          <span className="sr-only">SmartMart Motors</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="max-w-xl font-display text-2xl font-semibold text-white sm:text-3xl"
        >
          {tagline}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.32 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <Button asChild size="lg" variant="glow">
            <Link href="/products">
              Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          {messagingEnabled ? (
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">
                <Phone className="h-4 w-4" />
                Contact
              </Link>
            </Button>
          ) : (
            <Button asChild size="lg" variant="outline">
              <a href={`tel:${phone}`}>
                <Phone className="h-4 w-4" />
                Call us
              </a>
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
