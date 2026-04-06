"use client";

import { motion } from "framer-motion";
import { Agent } from "@/lib/mockData";
import { cardHoverVariants } from "@/lib/animations";
import { Star } from "lucide-react";
import { renderIcon } from "@/lib/icons";

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <motion.div
      whileHover="hover"
      whileTap="tap"
      initial="rest"
      variants={cardHoverVariants}
      className="group relative h-full"
    >
      <div className="relative h-full bg-slate-900/50 border border-slate-800 hover:border-cyan-500/70 rounded-xl p-6 transition-all duration-300 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 to-violet-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative z-10 space-y-4">
          {/* Agent Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                {agent.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{agent.capability}</p>
            </div>
            <div className="text-cyan-400 group-hover:text-cyan-300 transition-colors">
              {renderIcon(agent.iconName, 32)}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors line-clamp-2">
            {agent.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 pt-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={`${
                    i < Math.floor(agent.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-400">{agent.rating}</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline justify-between pt-4 border-t border-slate-700">
            <span className="text-xs text-slate-400">Rate</span>
            <span className="text-lg font-bold gradient-cyan-violet-text">
              {agent.price} ETH
            </span>
          </div>
        </div>

        {/* Hover Glow Border */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 rounded-xl pointer-events-none border border-cyan-500/50 shadow-lg shadow-cyan-500/20"
        />
      </div>
    </motion.div>
  );
}
