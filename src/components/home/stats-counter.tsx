"use client";

import * as React from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  value: number;
  suffix?: string;
}

interface StatsCounterProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  stats?: StatItem[];
  className?: string;
}

const defaultStats: StatItem[] = [
  { label: "Parts in catalog", value: 2500, suffix: "+" },
  { label: "Happy customers", value: 1800, suffix: "+" },
  { label: "Brands stocked", value: 60, suffix: "+" },
  { label: "Years of service", value: 8, suffix: "+" },
];

const defaultHeading = {
  eyebrow: "By the numbers",
  title: "Proven on the road",
  description: "Figures that reflect a community of drivers who trust SmartMart Motors.",
};

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1800, bounce: 0 });
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (inView) {
      motionValue.set(reduceMotion ? value : value);
    }
  }, [inView, motionValue, reduceMotion, value]);

  React.useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplay(Math.round(latest));
    });
    return unsubscribe;
  }, [spring]);

  React.useEffect(() => {
    if (inView && reduceMotion) {
      setDisplay(value);
    }
  }, [inView, reduceMotion, value]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export function StatsCounter({
  eyebrow = defaultHeading.eyebrow,
  title = defaultHeading.title,
  description = defaultHeading.description,
  stats = defaultStats,
  className,
}: StatsCounterProps) {
  return (
    <section className={cn("border-y border-white/5 bg-white/[0.02] py-20", className)}>
      <div className="container">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="text-center"
            >
              <p className="font-display text-4xl font-bold text-primary sm:text-5xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
