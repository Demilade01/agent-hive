'use client';

import React from 'react';
import { AlertCircle, Wifi } from 'lucide-react';
import { useWallet } from '@/lib/wallet-context';

export default function NetworkAlert() {
  const { isWrongNetwork, switchNetwork } = useWallet();

  if (!isWrongNetwork) return null;

  return (
    <div className="bg-red-500/10 border border-red-500/30 backdrop-blur p-4 rounded-lg flex items-start justify-between gap-4">
      <div className="flex items-start gap-3 flex-1">
        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="text-red-300 font-medium">Wrong Network</p>
          <p className="text-red-200 text-xs mt-1">
            Please switch to Kite Testnet (ChainID: 2368) to use AgentHive
          </p>
        </div>
      </div>
      <button
        onClick={switchNetwork}
        className="flex-shrink-0 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded transition-colors flex items-center gap-2"
      >
        <Wifi className="w-3 h-3" />
        Switch Network
      </button>
    </div>
  );
}
