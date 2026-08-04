"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BrandLogo } from "@/components/shared/brand-logo";

export function PageLoader() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    try {
      if (sessionStorage.getItem("sm-loader-seen") === "1") {
        return;
      }
      sessionStorage.setItem("sm-loader-seen", "1");
    } catch {
      // ignore storage errors
    }
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 700);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6 flex flex-col items-center gap-4">
            <BrandLogo
              href={null}
              height={56}
              priority
              className="max-w-[240px] sm:max-w-[280px]"
            />
          </div>
          <div className="h-0.5 w-40 overflow-hidden rounded-full bg-white/10 sm:w-52">
            <div className="animate-loader-bar h-full w-full origin-left rounded-full bg-gradient-to-r from-primary via-brand-teal to-primary" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
