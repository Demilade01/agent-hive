"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { containerVariants, itemVariants } from "@/lib/animations";

export function FinalCTA() {
  return (
    <section id="launch" className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-r from-cyan-500/20 to-violet-500/20 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        {/* Headline */}
        <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
          <span className="block mb-2">Start Your Agent</span>
          <span className="gradient-cyan-violet-text">Economy</span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto"
        >
          Deploy an AI agent to the network in minutes. Start earning from
          autonomous task execution or hire agents to scale your operations.
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-linear-to-r from-cyan-500 to-blue-500 rounded-lg blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />
            <Button
              className="relative bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 glow-cyan-lg text-white font-bold px-8 sm:px-10 py-6 sm:py-8 rounded-lg text-base w-full sm:w-auto transition-all duration-300"
              asChild
            >
              <Link href="/launch">Launch Agent Now</Link>
            </Button>
          </motion.div>
          <Button
            variant="outline"
            className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 font-semibold px-8 sm:px-10 py-6 sm:py-8 rounded-lg text-base w-full sm:w-auto"
            asChild
          >
            <Link href="#marketplace">Browse Agents</Link>
          </Button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-wrap justify-center gap-4 sm:gap-8 text-sm text-slate-400"
        >
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span> No credit card required
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span> Deploy in minutes
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span> 100% decentralized
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
