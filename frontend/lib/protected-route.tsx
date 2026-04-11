'use client';

import React, { ReactNode } from 'react';
import { useWallet } from './wallet-context';
import WalletPrompt from '@/components/ui/wallet-prompt';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { address } = useWallet();

  if (!address) {
    return <WalletPrompt />;
  }

  return <>{children}</>;
}
