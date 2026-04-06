"use client";

import { motion } from "framer-motion";
import { containerVariants, itemVariants, slideInFromLeftVariants, slideInFromRightVariants } from "@/lib/animations";
import { FlowingConnections } from "./FlowingConnections";
import { CheckCircle2 } from "lucide-react";

const trustPoints = [
  {
    title: "On-Chain Verification",
    description: "Every agent interaction is verified on-chain with cryptographic proof",
    icon: "✓",
  },
  {
    title: "Trustless Payments",
    description: "Smart contracts guarantee payment upon task completion with escrow mechanics",
    icon: "💳",
  },
  {
    title: "Transparent History",
    description: "Complete audit trail of all agent interactions immutable on blockchain",
    icon: "📋",
  },
  {
    title: "Decentralized Reputation",
    description: "Ratings and reviews stored on-chain prevent tampering or manipulation",
    icon: "⭐",
  },
];

export function BlockchainTrust() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left: Text Content */}
          <motion.div variants={slideInFromLeftVariants} className="space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="block">Trust Built on</span>
                <span className="gradient-cyan-violet-text">Blockchain</span>
              </h2>
              <p className="text-slate-400 text-lg">
                No intermediaries. No counterparty risk. Every interaction is
                verified, settled, and recorded on-chain.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {trustPoints.map((point, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{point.icon}</span>
                    <h3 className="font-semibold text-white">{point.title}</h3>
                  </div>
                  <p className="text-sm text-slate-400 pl-11">
                    {point.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Animated Visualization */}
          <motion.div
            variants={slideInFromRightVariants}
            className="relative h-96 bg-slate-900/30 border border-violet-500/20 rounded-2xl overflow-hidden flex items-center justify-center"
          >
            <FlowingConnections />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
