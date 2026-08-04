"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Zap } from "lucide-react";

export function PageLoader() {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 1600);
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
          <div className="mb-8 flex flex-col items-center gap-4">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="shadow-glow flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/50 bg-primary/20 text-primary"
            >
              <Zap className="h-8 w-8 fill-primary" />
            </motion.div>
            <h1 className="animate-logo-reveal font-display text-2xl font-bold tracking-[0.08em] text-white sm:text-3xl">
              SmartMart<span className="text-primary"> Motors</span>
            </h1>
          </div>

          <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10 sm:w-64">
            <div className="animate-loader-bar shadow-glow h-full w-full origin-left rounded-full bg-gradient-to-r from-primary via-[#ff1a1a] to-primary" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
