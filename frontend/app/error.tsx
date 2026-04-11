'use client';

import React from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="max-w-md w-full px-4">
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 backdrop-blur p-8 text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-4 bg-red-500/20 rounded-lg border border-red-500/30">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Something Went Wrong
            </h1>
            <p className="text-sm text-red-200 mb-2">
              {error.message || 'An unexpected error occurred'}
            </p>
            {error.digest && (
              <p className="text-xs text-slate-400 mt-4">
                Error ID: {error.digest}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={reset}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
            >
              <span>Try Again</span>
            </button>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Home</span>
            </Link>
          </div>

          {/* Debug Info */}
          <div className="text-left bg-slate-900/50 rounded p-3 max-h-32 overflow-auto border border-slate-700">
            <p className="text-xs font-mono text-slate-400 break-words">
              {error.stack || 'No additional error information'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
