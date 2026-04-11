'use client';

import React from 'react';
import { Wallet, AlertCircle } from 'lucide-react';
import { useWallet } from '@/lib/wallet-context';

export default function WalletPrompt() {
  const { connectWallet, isConnecting, error } = useWallet();

  return (
    <div className="flex items-center justify-center min-h-[600px] px-4">
      <div className="max-w-md w-full">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 rounded-full border border-cyan-500/30">
              <Wallet className="w-8 h-8 text-cyan-400" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-white mb-2">
            Connect Your Wallet
          </h2>

          {/* Description */}
          <p className="text-center text-slate-300 mb-6 text-sm leading-relaxed">
            To access the AgentHive dashboard and manage your AI agent jobs, please connect your wallet. This identifies you on the platform.
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          {/* Connect Button */}
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 disabled:from-slate-600 disabled:to-slate-500 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
          >
            <Wallet className="w-4 h-4" />
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>

          {/* Help Text */}
          <p className="text-center text-xs text-slate-500 mt-6">
            Supported wallets: MetaMask, WalletConnect, Coinbase Wallet
          </p>
        </div>
      </div>
    </div>
  );
}
