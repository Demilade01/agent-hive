'use client';

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Users, TrendingUp, Plus, Home, LogOut, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWallet } from '@/lib/wallet-context';
import NetworkAlert from '@/components/ui/network-alert';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { address, connectWallet, disconnectWallet, isConnecting } = useWallet();
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);

  const menuItems = [
    { href: '/dashboard', icon: Home, label: 'Overview' },
    { href: '/dashboard/submit-job', icon: Plus, label: 'Submit Job' },
    { href: '/dashboard/jobs', icon: BarChart3, label: 'My Jobs' },
    { href: '/dashboard/agents', icon: Users, label: 'Agents' },
    { href: '/dashboard/earnings', icon: TrendingUp, label: 'Earnings' },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname?.startsWith(href) || false;
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-50 md:flex-row">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex md:w-64 md:border-r border-slate-800 bg-slate-900/50 backdrop-blur supports-[backdrop-filter]:bg-slate-900/20 shadow-xl md:flex-col">
        {/* Logo */}
        <div className="border-b border-slate-800 px-6 py-6">
          <Link href="/dashboard" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600">
            AgentHive
          </Link>
          <p className="text-xs text-slate-400 mt-1">Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 px-3 py-6 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  active
                    ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-cyan-300 font-medium border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer - Desktop Only */}
        <div className="hidden md:flex md:flex-col absolute bottom-0 w-64 border-t border-slate-800 bg-slate-900/30 px-6 py-4">
          <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors w-full">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          <p className="text-xs text-slate-500 mt-3">v1.0.0</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full md:flex-1">
        {/* Top Navigation */}
        <header className="border-b border-slate-800 bg-slate-900/30 backdrop-blur supports-[backdrop-filter]:bg-slate-900/10 px-8 py-6 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-sm text-slate-400 mt-1">Manage your AI agent jobs</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
              {address ? (
                <div className="relative">
                  <button
                    onClick={() => setWalletMenuOpen(!walletMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-cyan-500/30 hover:border-cyan-400 transition-colors cursor-pointer"
                  >
                    <Wallet className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm text-cyan-300 font-mono">
                      {address.slice(0, 6)}...{address.slice(-4)}
                    </span>
                  </button>

                  {walletMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg bg-slate-900 border border-slate-800 shadow-lg z-50">
                      <div className="p-3 border-b border-slate-800">
                        <p className="text-xs text-slate-400 mb-1">Connected Wallet</p>
                        <p className="text-sm text-white font-mono break-all">{address}</p>
                      </div>
                      <button
                        onClick={() => {
                          disconnectWallet();
                          setWalletMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-300 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Disconnect
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50"
                >
                  <Wallet className="h-4 w-4" />
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
              )}
            </div>
          </div>
            </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="space-y-6">
            <NetworkAlert />
            {children}
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-900/50 backdrop-blur grid grid-cols-5 shadow-xl">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center py-3 px-2 transition-all duration-200',
                  active
                    ? 'text-cyan-300 border-t-2 border-cyan-500'
                    : 'text-slate-400'
                )}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1 truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </main>

      {/* Spacer for mobile to account for bottom nav */}
      <div className="md:hidden h-24"></div>
    </div>
  );
}
