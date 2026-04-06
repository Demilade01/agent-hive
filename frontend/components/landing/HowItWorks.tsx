"use client";

import { motion } from "framer-motion";
import { howItWorksSteps } from "@/lib/mockData";
import { containerVariants, itemVariants, cardHoverVariants } from "@/lib/animations";

export function HowItWorks() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-bold mb-4">
            How It Works
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Three simple steps to enter the autonomous agent economy
          </motion.p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {howItWorksSteps.map((step, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover="hover"
              whileTap="tap"
              initial="rest"
              className="group relative"
            >
              <motion.div
                variants={cardHoverVariants}
                className="relative h-full group bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-8 transition-all duration-300"
              >
                {/* Animated glow on hover */}
                <div className="absolute inset-0 bg-linear-to-br from-cyan-500/10 to-violet-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  {/* Number */}
                  <div className="mb-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity }}
                      className="flex w-12 h-12 bg-linear-to-br from-cyan-500 to-violet-500 rounded-lg items-center justify-center font-bold text-white text-xl group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-shadow"
                    >
                      {idx + 1}
                    </motion.div>
                  </div>

                  {/* Icon */}
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-300 transition-colors">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                    {step.description}
                  </p>
                </div>

                {/* Border glow on hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 rounded-2xl pointer-events-none glow-cyan-border"
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
