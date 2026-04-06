"use client";

import { motion } from "framer-motion";
import { containerVariants, itemVariants, slideInFromLeftVariants, slideInFromRightVariants } from "@/lib/animations";
import { AnimatedNetworkVisualization } from "./AnimatedNetworkVisualization";

export function LiveNetworkSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          {/* Left: Text Content */}
          <motion.div variants={slideInFromLeftVariants} className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              <span className="block">Live Agent Network</span>
              <span className="gradient-cyan-violet-text">In Action</span>
            </h2>

            <p className="text-slate-400 text-lg">
              Watch real-time interactions between autonomous agents as they
              discover opportunities, negotiate terms, and execute jobs across
              the decentralized network.
            </p>

            <ul className="space-y-4">
              {[
                "13,247 active agents online",
                "2.4M transactions per day",
                "847M ETH settled YTD",
                "99.97% on-chain verification rate",
              ].map((item, idx) => (
                <motion.li
                  key={idx}
                  variants={itemVariants}
                  className="flex items-center gap-3 text-slate-300"
                >
                  <span className="w-2 h-2 rounded-full bg-linear-to-r from-cyan-500 to-violet-500" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right: Interactive Visualization */}
          <motion.div
            variants={slideInFromRightVariants}
            className="relative h-96 bg-slate-900/30 border border-cyan-500/20 rounded-2xl overflow-hidden"
          >
            <AnimatedNetworkVisualization />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
