'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, AlertCircle, Zap } from 'lucide-react';
import { useWallet } from '@/lib/wallet-context';

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const iconVariants = {
  hidden: { opacity: 0, scale: 0.5, rotate: -45 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.6 },
  },
  hover: { scale: 1.1, rotate: 5, transition: { duration: 0.3 } },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98 },
};

export default function WalletPrompt() {
  const { connectWallet, isConnecting, error } = useWallet();

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 bg-slate-950 overflow-hidden">
      {/* Animated background gradients */}
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute top-1/4 -right-32 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute bottom-1/4 -left-32 w-96 h-96 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-full blur-3xl pointer-events-none"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full relative z-10"
      >
        {/* Glassmorphism card */}
        <div className="relative group">
          {/* Gradient border glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-violet-600/50 rounded-3xl blur opacity-0 group-hover:opacity-75 transition duration-500" />

          {/* Card content */}
          <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-950 border border-slate-700/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
            {/* Icon with animation */}
            <motion.div
              variants={iconVariants}
              whileHover="hover"
              className="flex justify-center mb-8"
            >
              <div className="relative">
                {/* Animated ring background */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-violet-500/30 rounded-full blur"
                />
                <div className="relative p-4 bg-gradient-to-br from-cyan-500/20 to-violet-600/20 rounded-full border border-cyan-400/50 shadow-lg shadow-cyan-500/20">
                  <Wallet className="w-8 h-8 text-cyan-300" />
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              variants={itemVariants}
              className="text-3xl font-bold text-center text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-400"
            >
              Connect Your Wallet
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-center text-slate-300 mb-8 text-sm leading-relaxed"
            >
              Access the AgentHive dashboard and start managing your AI agent jobs. Your wallet identifies you on the platform.
            </motion.p>

            {/* Error Message with animation */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/50 rounded-lg flex items-start gap-3 backdrop-blur"
              >
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-200">{error}</p>
              </motion.div>
            )}

            {/* Connect Button with enhanced styling */}
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={connectWallet}
              disabled={isConnecting}
              className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 hover:from-cyan-400 hover:via-blue-400 hover:to-violet-500 disabled:from-slate-600 disabled:via-slate-600 disabled:to-slate-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/50 group"
            >
              <motion.div
                animate={isConnecting ? { rotate: 360 } : { rotate: 0 }}
                transition={isConnecting ? { duration: 1, repeat: Infinity, ease: 'linear' } : { duration: 0 }}
              >
                <Wallet className="w-5 h-5" />
              </motion.div>
              <span>{isConnecting ? 'Connecting Wallet...' : 'Connect Wallet'}</span>
              {!isConnecting && (
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="w-4 h-4" />
                </motion.div>
              )}
            </motion.button>

            {/* Features list */}
            <motion.div
              variants={itemVariants}
              className="mt-8 grid grid-cols-3 gap-2 text-center text-xs"
            >
              <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700/50 backdrop-blur">
                <div className="text-cyan-300 font-semibold">Multiple</div>
                <div className="text-slate-400 text-xs">Wallets</div>
              </div>
              <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700/50 backdrop-blur">
                <div className="text-cyan-300 font-semibold">Secure</div>
                <div className="text-slate-400 text-xs">EIP-1193</div>
              </div>
              <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700/50 backdrop-blur">
                <div className="text-cyan-300 font-semibold">Fast</div>
                <div className="text-slate-400 text-xs">Connect</div>
              </div>
            </motion.div>

            {/* Help Text */}
            <motion.p
              variants={itemVariants}
              className="text-center text-xs text-slate-400 mt-6"
            >
              Supported: MetaMask • WalletConnect • Coinbase Wallet
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
