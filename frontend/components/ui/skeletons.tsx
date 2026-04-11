'use client';

import React from 'react';

export function JobCardSkeleton() {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/30 backdrop-blur p-6 animate-pulse">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-slate-700 rounded w-2/3" />
          <div className="h-4 bg-slate-700 rounded w-1/2" />
        </div>
        <div className="h-6 bg-slate-700 rounded-full w-24" />
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-slate-700 rounded" />
        <div className="h-4 bg-slate-700 rounded w-4/5" />
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className="h-8 w-8 bg-slate-700 rounded-full" />
        <div className="h-4 bg-slate-700 rounded flex-1" />
      </div>
    </div>
  );
}

export function AgentCardSkeleton() {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/30 backdrop-blur p-6 animate-pulse">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-slate-700 rounded w-2/3" />
          <div className="h-4 bg-slate-700 rounded w-1/2" />
        </div>
        <div className="h-8 w-8 bg-slate-700 rounded" />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-slate-800/50 rounded space-y-2">
          <div className="h-3 bg-slate-700 rounded w-1/2" />
          <div className="h-5 bg-slate-700 rounded" />
        </div>
        <div className="p-3 bg-slate-800/50 rounded space-y-2">
          <div className="h-3 bg-slate-700 rounded w-1/2" />
          <div className="h-5 bg-slate-700 rounded" />
        </div>
      </div>
      <div className="h-3 bg-slate-700 rounded w-full" />
    </div>
  );
}

export function PaymentRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4 whitespace-nowrap border-b border-slate-800 bg-slate-900/20">
        <div className="h-4 bg-slate-700 rounded w-20" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap border-b border-slate-800 bg-slate-900/20">
        <div className="h-4 bg-slate-700 rounded w-24" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap border-b border-slate-800 bg-slate-900/20">
        <div className="h-4 bg-slate-700 rounded w-20" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap border-b border-slate-800 bg-slate-900/20">
        <div className="h-6 bg-slate-700 rounded-full w-20 mx-auto" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap border-b border-slate-800 bg-slate-900/20">
        <div className="h-4 bg-slate-700 rounded w-32" />
      </td>
    </tr>
  );
}

export function JobDetailsSkeleton() {
  return (
    <div className="space-y-8 max-w-4xl animate-pulse">
      {/* Back Button */}
      <div className="h-4 bg-slate-700 rounded w-24" />

      {/* Job Header */}
      <div className="rounded-lg border border-slate-800 bg-gradient-to-br from-slate-900/50 to-slate-800/20 backdrop-blur p-6 space-y-4">
        <div className="space-y-3">
          <div className="h-8 bg-slate-700 rounded w-full" />
          <div className="h-4 bg-slate-700 rounded w-32" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-slate-800/30 rounded space-y-2">
            <div className="h-3 bg-slate-700 rounded w-1/2" />
            <div className="h-4 bg-slate-700 rounded" />
          </div>
          <div className="p-3 bg-slate-800/30 rounded space-y-2">
            <div className="h-3 bg-slate-700 rounded w-1/2" />
            <div className="h-4 bg-slate-700 rounded" />
          </div>
          <div className="p-3 bg-slate-800/30 rounded space-y-2">
            <div className="h-3 bg-slate-700 rounded w-1/2" />
            <div className="h-4 bg-slate-700 rounded" />
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/30 backdrop-blur p-6 space-y-4">
        <div className="h-5 bg-slate-700 rounded w-32" />
        <div className="w-full bg-slate-700 rounded-full h-3" />
        <div className="h-4 bg-slate-700 rounded w-40" />
      </div>

      {/* Tasks Section */}
      <div className="space-y-4">
        <div className="h-6 bg-slate-700 rounded w-20" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border border-slate-800 bg-slate-900/30 backdrop-blur p-6 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="h-5 bg-slate-700 rounded w-1/3" />
              <div className="h-6 bg-slate-700 rounded-full w-20" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-700 rounded w-full" />
              <div className="h-4 bg-slate-700 rounded w-5/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
