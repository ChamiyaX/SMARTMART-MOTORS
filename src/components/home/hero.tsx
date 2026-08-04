"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
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
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 font-display text-5xl font-black tracking-tight text-white sm:text-7xl md:text-8xl lg:text-9xl"
        >
          SmartMart
          <span className="text-gradient-animated block">Motors</span>
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="max-w-xl font-display text-2xl font-semibold text-white sm:text-3xl"
        >
          Precision parts. Peak performance.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.22 }}
          className="mt-4 max-w-lg text-base text-white/70 sm:text-lg"
        >
          Premium automotive components curated for drivers who demand quality,
          reliability, and craftsmanship.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.32 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <Button asChild size="lg" variant="glow">
            <Link href="/products">
              Shop Parts
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/contact">
              <Phone className="h-4 w-4" />
              Contact
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
