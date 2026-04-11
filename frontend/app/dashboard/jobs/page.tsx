'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { jobApi } from '@/lib/api';
import { AlertCircle, CheckCircle, Clock, Loader } from 'lucide-react';

interface Job {
  id: string;
  userId: string;
  jobTitle: string;
  imageUrl: string;
  taskDescription: string;
  status: string;
  createdAt: string;
}

export default function MyJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await jobApi.getAllJobs();
        setJobs(response as Job[]);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
    const interval = setInterval(fetchJobs, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const filteredJobs = jobs.filter((job) => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-300 border-green-500/30';
      case 'processing':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
      case 'failed':
        return 'bg-red-500/10 text-red-300 border-red-500/30';
      default:
        return 'bg-slate-500/10 text-slate-300 border-slate-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5" />;
      case 'processing':
        return <Clock className="h-5 w-5 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">My Jobs</h1>
        <p className="mt-2 text-slate-400">
          Track and manage all your submitted jobs
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'processing', 'completed', 'failed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === status
                ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-cyan-300 border border-cyan-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-4 rounded-lg border border-red-500/30 bg-red-500/10 backdrop-blur p-4">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-300">Error</h3>
            <p className="text-sm text-red-200">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader className="h-8 w-8 animate-spin text-cyan-400 mx-auto mb-4" />
            <p className="text-slate-400">Loading your jobs...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredJobs.length === 0 && (
        <div className="rounded-lg border border-slate-800 bg-slate-900/30 backdrop-blur p-12 text-center">
          <Clock className="h-12 w-12 text-slate-500 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-slate-300">No jobs found</h3>
          <p className="mt-2 text-slate-400 text-sm">
            {filter === 'all'
              ? 'Submit your first job to get started'
              : `No ${filter} jobs yet`}
          </p>
          {filter === 'all' && (
            <Link
              href="/dashboard/submit-job"
              className="mt-4 inline-block px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
            >
              Submit Job
            </Link>
          )}
        </div>
      )}

      {/* Jobs Grid */}
      {!loading && filteredJobs.length > 0 && (
        <div className="space-y-3">
          {filteredJobs.map((job) => (
            <Link
              key={job.id}
              href={`/dashboard/jobs/${job.id}`}
              className="block rounded-lg border border-slate-800 bg-slate-900/30 backdrop-blur p-6 hover:border-cyan-500/30 transition-all hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{job.jobTitle}</h3>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-2">{job.taskDescription}</p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium whitespace-nowrap ${getStatusColor(job.status)}`}>
                  {getStatusIcon(job.status)}
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Job ID: {job.id.slice(0, 8)}...</span>
                <span>{new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
