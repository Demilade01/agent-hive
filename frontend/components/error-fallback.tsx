'use client';

import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorFallbackProps {
  error?: string | Error;
  retry?: () => void;
  title?: string;
  description?: string;
  fullPage?: boolean;
}

export default function ErrorFallback({
  error,
  retry,
  title = 'Something went wrong',
  description,
  fullPage = false,
}: ErrorFallbackProps) {
  const errorMessage = error instanceof Error ? error.message : String(error || '');
  const finalDescription =
    description ||
    errorMessage ||
    'An unexpected error occurred. Please try again.';

  const content = (
    <div className="flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 backdrop-blur p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-500/20 rounded-lg border border-red-500/30">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
          </div>

          {/* Content */}
          <h3 className="text-lg font-semibold text-red-300 text-center mb-2">
            {title}
          </h3>
          <p className="text-sm text-red-200 text-center mb-6">
            {finalDescription}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {retry && (
              <button
                onClick={retry}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Retry
              </button>
            )}
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        {content}
      </div>
    );
  }

  return content;
}
