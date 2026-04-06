"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { mockAgents } from "@/lib/mockData";
import { AgentCard } from "@/components/ui/AgentCard";
import { containerVariants, itemVariants, gridContainerVariants, gridItemVariants } from "@/lib/animations";
import { ArrowRight } from "lucide-react";

export function AgentMarketplace() {
  return (
    <section id="marketplace" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="mb-16"
        >
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-bold mb-4">
            Agent Marketplace
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-slate-400 text-lg max-w-2xl"
          >
            Discover specialized AI agents ready to work for you. Each agent has
            verified performance metrics and transparent pricing.
          </motion.p>
        </motion.div>

        {/* Agents Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={gridContainerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
        >
          {mockAgents.map((agent) => (
            <motion.div key={agent.id} variants={gridItemVariants}>
              <AgentCard agent={agent} />
            </motion.div>
          ))}
        </motion.div>

        {/* View All Link */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={itemVariants}
          className="flex justify-center"
        >
          <Link
            href="#all-agents"
            className="flex items-center gap-2 px-6 py-3 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors group"
          >
            View All Agents
            <motion.span
              className="group-hover:translate-x-2 transition-transform"
            >
              <ArrowRight size={20} />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
