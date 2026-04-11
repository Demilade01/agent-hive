'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Extend Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on?: (event: string, handler: (...args: any[]) => void) => void;
      removeListener?: (event: string, handler: (...args: any[]) => void) => void;
    };
  }
}

interface WalletContextType {
  address: string | null;
  isConnecting: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  provider: ethers.BrowserProvider | null;
  chainId: number | null;
  isWrongNetwork: boolean;
  switchNetwork: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);

  const KITE_TESTNET_CHAIN_ID = 2368;

  // Get current chain ID
  const getChainId = async (provider: ethers.BrowserProvider) => {
    try {
      const network = await provider.getNetwork();
      setChainId(Number(network.chainId));
    } catch (err) {
      console.error('Failed to get chain ID:', err);
    }
  };

  // Load wallet on mount
  useEffect(() => {
    const loadWallet = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setAddress(accounts[0].address);
            setProvider(provider);
            await getChainId(provider);
          }

          // Listen for chain changes
          window.ethereum.on?.('chainChanged', (chainIdHex: string) => {
            const newChainId = parseInt(chainIdHex, 16);
            setChainId(newChainId);
          });

          // Listen for account changes
          window.ethereum.on?.('accountsChanged', (accounts: string[]) => {
            if (accounts.length > 0) {
              setAddress(accounts[0]);
            } else {
              disconnectWallet();
            }
          });
        } catch (err) {
          console.error('Failed to load wallet:', err);
        }
      }
    };
    loadWallet();

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('chainChanged', () => {});
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask or compatible wallet not found');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setProvider(provider);
        localStorage.setItem('wallet_address', accounts[0]);
        await getChainId(provider);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setProvider(null);
    setChainId(null);
    localStorage.removeItem('wallet_address');
  };

  const switchNetwork = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + KITE_TESTNET_CHAIN_ID.toString(16) }],
      });
    } catch (err: any) {
      // Chain doesn't exist, try adding it
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x' + KITE_TESTNET_CHAIN_ID.toString(16),
                chainName: 'Kite Testnet',
                rpcUrls: ['https://rpc-testnet.gokite.ai/'],
                nativeCurrency: {
                  name: 'KITE',
                  symbol: 'KITE',
                  decimals: 18,
                },
              },
            ],
          });
        } catch (addErr) {
          console.error('Failed to add Kite network:', addErr);
        }
      }
    }
  };

  const isWrongNetwork = chainId !== null && chainId !== KITE_TESTNET_CHAIN_ID;

  return (
    <WalletContext.Provider
      value={{ address, isConnecting, error, connectWallet, disconnectWallet, provider, chainId, isWrongNetwork, switchNetwork }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}
