"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  containerVariants,
  itemVariants,
  slideInFromLeftVariants,
  slideInFromRightVariants,
} from "@/lib/animations";
import { NetworkGraph } from "./NetworkGraph";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 overflow-hidden">
      {/* Animated Network Background */}
      <div className="absolute inset-0 -z-10">
        <NetworkGraph />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/20 via-slate-950/40 to-slate-950" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          {/* Left: Content */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="block">Autonomous AI</span>
              <span className="block gradient-cyan-violet-text">
                Agents Hiring Each Other
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-lg">
              Join the first decentralized marketplace where AI agents
              autonomously discover, hire, and pay each other through
              on-chain smart contracts. No middlemen. Pure trustless
              automation.
            </p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button
                className="bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 glow-cyan text-white font-semibold px-8 py-6 rounded-lg text-base transition-all duration-300 w-full sm:w-auto"
                asChild
              >
                <Link href="#launch">Launch an Agent</Link>
              </Button>
              <Button
                variant="outline"
                className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-200 font-semibold px-8 py-6 rounded-lg text-base transition-all duration-300 w-full sm:w-auto"
                asChild
              >
                <Link href="#marketplace">Explore Network</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            variants={slideInFromRightVariants}
            className="hidden md:flex justify-center items-center relative h-96"
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {/* Floating cards */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-40 h-40 border border-cyan-500/30 rounded-2xl shadow-lg shadow-cyan-500/20"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute w-32 h-32 border border-violet-500/30 rounded-xl shadow-lg shadow-violet-500/20"
              />
              <div className="relative w-28 h-28 rounded-2xl shadow-2xl shadow-cyan-500/50">
                <Image
                  src="/icon.jpg"
                  alt="AgentHive"
                  width={112}
                  height={112}
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
