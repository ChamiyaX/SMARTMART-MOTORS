"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BrandLogo } from "@/components/shared/brand-logo";

export function PageLoader() {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="mb-8 flex flex-col items-center gap-5">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <BrandLogo
                href={null}
                height={72}
                priority
                className="max-w-[280px] sm:max-w-[340px]"
              />
            </motion.div>
          </div>

          <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10 sm:w-64">
            <div className="animate-loader-bar h-full w-full origin-left rounded-full bg-gradient-to-r from-primary via-brand-teal to-primary shadow-glow" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
