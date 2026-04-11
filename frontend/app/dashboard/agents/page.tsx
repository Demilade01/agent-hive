'use client';

import React, { useEffect, useState } from 'react';
import { agentApi } from '@/lib/api';
import { toast } from '@/lib/toast-service';
import { Loader, Users, TrendingUp } from 'lucide-react';
import { AgentCardSkeleton } from '@/components/ui/skeletons';

interface Agent {
  id: string;
  agentId: string;
  agentType: string;
  isActive: boolean;
  stats?: {
    completedTasks?: number;
    failedTasks?: number;
    successRate?: number;
    qualityScore?: number;
  };
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const params = filter !== 'all' ? { type: filter as 'image_analyzer' | 'context_fetcher' | 'insight_writer' } : {};
        const response = await agentApi.getAllAgents(params);
        setAgents(response as Agent[]);
      } catch (err: any) {
        toast.error('Failed to fetch agents', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [filter]);

  const agentTypes = ['all', 'image_analyzer', 'context_fetcher', 'insight_writer'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">AI Agents</h1>
        <p className="mt-2 text-slate-400">
          Browse and manage available agents in the marketplace
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {agentTypes.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === type
                ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-cyan-300 border border-cyan-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600'
            }`}
          >
            {type === 'all' ? 'All Agents' : type.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      {/* Error Alert Removed - Using toast notifications instead */}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AgentCardSkeleton />
          <AgentCardSkeleton />
          <AgentCardSkeleton />
          <AgentCardSkeleton />
          <AgentCardSkeleton />
          <AgentCardSkeleton />
        </div>
      )}

      {/* Empty State */}
      {!loading && agents.length === 0 && (
        <div className="rounded-lg border border-slate-800 bg-slate-900/30 backdrop-blur p-12 text-center">
          <Users className="h-12 w-12 text-slate-500 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-slate-300">No agents found</h3>
          <p className="mt-2 text-slate-400 text-sm">
            Try a different filter or check back later
          </p>
        </div>
      )}

      {/* Agents Grid */}
      {!loading && agents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="rounded-lg border border-slate-800 bg-gradient-to-br from-slate-900/50 to-slate-800/20 backdrop-blur p-6 hover:border-cyan-500/30 transition-all hover:shadow-lg hover:shadow-cyan-500/10"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {agent.agentType.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Agent ID: {agent.agentId.slice(0, 8)}</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  agent.isActive
                    ? 'bg-green-500/10 text-green-300'
                    : 'bg-slate-500/10 text-slate-300'
                }`}>
                  {agent.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="space-y-3 border-t border-slate-700 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Tasks Completed</span>
                  <span className="text-lg font-semibold text-cyan-300">
                    {agent.stats?.completedTasks || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Success Rate</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span className="text-lg font-semibold text-green-300">
                      {(agent.stats?.successRate || 0).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Quality Score</span>
                  <span className="text-lg font-semibold text-violet-300">
                    {(agent.stats?.qualityScore || 0).toFixed(2)}/5
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Failed Tasks</span>
                  <span className="text-lg font-semibold text-red-300">
                    {agent.stats?.failedTasks || 0}
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              {agent.isActive && (
                <button className="w-full mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                  View Details
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
