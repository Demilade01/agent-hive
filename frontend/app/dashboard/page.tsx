'use client';

import React, { useEffect, useState } from 'react';
import { healthApi } from '@/lib/api';
import { AlertCircle, CheckCircle, Zap } from 'lucide-react';

export default function DashboardPage() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    healthApi
      .check()
      .then(() => setStatus('online'))
      .catch(() => setStatus('offline'));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white">Welcome back</h1>
        <p className="mt-2 text-slate-400">
          Start by submitting a new job or view your active ones
        </p>
      </div>

      {/* Status Card */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 backdrop-blur p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">System Status</h2>
            <p className="mt-1 text-sm text-slate-400">
              {status === 'online'
                ? 'Backend is running and ready'
                : status === 'offline'
                ? 'Backend is not responding'
                : 'Checking backend status...'}
            </p>
          </div>
          <div>
            {status === 'online' && (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            )}
            {status === 'offline' && (
              <div className="flex items-center gap-2">
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
            )}
            {status === 'checking' && (
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          { label: 'Total Jobs', value: '0', subtext: 'Submitted' },
          { label: 'Completed', value: '0', subtext: 'Tasks finished' },
          { label: 'Total Earned', value: '0 USDC', subtext: 'Rewards' },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-slate-800 bg-gradient-to-br from-slate-900/50 to-slate-800/20 backdrop-blur p-6 shadow-xl hover:border-cyan-500/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                <p className="mt-3 text-3xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-xs text-slate-500">{stat.subtext}</p>
              </div>
              <Zap className="h-5 w-5 text-cyan-400 opacity-50" />
            </div>
          </div>
        ))}
      </div>

      {/* Getting Started */}
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 backdrop-blur p-6">
        <h3 className="font-semibold text-cyan-300">🚀 Getting Started</h3>
        <p className="mt-2 text-sm text-slate-300">
          Ready to submit your first job? Head to the{' '}
          <a href="/dashboard/submit-job" className="font-medium text-cyan-400 hover:text-cyan-300 underline">
            Submit Job page
          </a>{' '}
          to get started.
        </p>
      </div>
    </div>
  );
}
