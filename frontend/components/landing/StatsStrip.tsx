"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { mockStats } from "@/lib/mockData";
import { containerVariants, itemVariants } from "@/lib/animations";
import { renderIcon } from "@/lib/icons";

function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
}: {
  from?: number;
  to: number;
  duration?: number;
}) {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    const increment = to / (duration * 60);
    const interval = setInterval(() => {
      setCount((prev) => {
        const next = prev + increment;
        return next >= to ? to : next;
      });
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [isInView, to, duration]);

  return (
    <span ref={ref}>
      {typeof to === "number" && !Number.isInteger(to)
        ? count.toFixed(1)
        : Math.floor(count)}
    </span>
  );
}

export function StatsStrip() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className="py-16 sm:py-20 border-y border-cyan-500/20 bg-slate-950/50 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
          {mockStats.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="text-center sm:text-left"
            >
              <div className="text-3xl sm:text-4xl font-bold mb-2">
                <span className="gradient-cyan-violet-text">
                  {stat.value.includes("M") || stat.value.includes("K")
                    ? stat.value[stat.value.length - 1] !== "M" &&
                      stat.value[stat.value.length - 1] !== "K" &&
                      stat.value[stat.value.length - 1] !== "$"
                      ? Math.floor(
                          parseFloat(stat.value) * 1000000
                        ).toString()
                      : ""
                    : ""}
                  {stat.value}
                </span>
              </div>
              <p className="text-slate-400 text-sm sm:text-base flex items-center justify-center sm:justify-start gap-2">
                <span className="text-cyan-400">
                  {renderIcon(stat.iconName, 20)}
                </span>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
