'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { jobApi } from '@/lib/api';
import { AlertCircle, ArrowLeft, CheckCircle, Loader } from 'lucide-react';

interface Task {
  id: string;
  taskType: string;
  status: string;
  result?: string;
  instruction?: string;
}

interface Job {
  id: string;
  userId: string;
  jobTitle: string;
  imageUrl: string;
  taskDescription: string;
  status: string;
  createdAt: string;
  tasks?: Task[];
}

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await jobApi.getJobById(jobId);
        setJob(response as Job);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch job');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
      const interval = setInterval(fetchJob, 5000);
      return () => clearInterval(interval);
    }
  }, [jobId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-slate-400">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div className="flex items-start gap-4 rounded-lg border border-red-500/30 bg-red-500/10 backdrop-blur p-4">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-300">Error</h3>
            <p className="text-sm text-red-200">{error || 'Job not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const completedTasks = job.tasks?.filter((t) => t.status === 'completed').length || 0;
  const totalTasks = job.tasks?.length || 3;
  const progress = (completedTasks / totalTasks) * 100;

  const getTaskStatusColor = (status: string) => {
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

  return (
    <div className="space-y-8 max-w-4xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </button>

      {/* Job Header */}
      <div className="rounded-lg border border-slate-800 bg-gradient-to-br from-slate-900/50 to-slate-800/20 backdrop-blur p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{job.jobTitle}</h1>
            <p className="text-sm text-slate-400 mt-2">Job ID: {job.id}</p>
          </div>
          <div className={`px-4 py-2 rounded-full border text-sm font-medium flex items-center gap-2 ${
            job.status === 'completed'
              ? 'bg-green-500/10 text-green-300 border-green-500/30'
              : job.status === 'processing'
              ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
              : 'bg-slate-500/10 text-slate-300 border-slate-500/30'
          }`}>
            {job.status === 'completed' ? <CheckCircle className="h-4 w-4" /> : <Loader className="h-4 w-4 animate-spin" />}
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </div>
        </div>

        <div className="border-t border-slate-700 pt-4">
          <h3 className="text-sm font-medium text-slate-300 mb-2">Task Description</h3>
          <p className="text-slate-300">{job.taskDescription}</p>
        </div>

        {job.imageUrl && (
          <div className="border-t border-slate-700 pt-4">
            <h3 className="text-sm font-medium text-slate-300 mb-3">Image</h3>
            <img
              src={job.imageUrl}
              alt="Job image"
              className="w-full max-h-96 object-cover rounded-lg border border-slate-700"
            />
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/30 backdrop-blur p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Progress</h2>
          <span className="text-sm text-slate-400">{completedTasks} of {totalTasks} tasks</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-500 to-violet-600 h-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Agent Tasks</h2>
        {job.tasks && job.tasks.length > 0 ? (
          <div className="space-y-3">
            {job.tasks.map((task, idx) => (
              <div
                key={task.id}
                className="rounded-lg border border-slate-800 bg-slate-900/30 backdrop-blur p-4 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="font-semibold text-white">
                      {idx + 1}. {task.taskType.split('_').join(' ')}
                    </h3>
                    {task.instruction && (
                      <p className="text-sm text-slate-400 mt-1">{task.instruction}</p>
                    )}
                  </div>
                  <div className={`px-3 py-1 rounded-full border text-xs font-medium whitespace-nowrap flex items-center gap-1 ${getTaskStatusColor(task.status)}`}>
                    {task.status === 'completed' ? <CheckCircle className="h-3 w-3" /> : <Loader className="h-3 w-3 animate-spin" />}
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </div>
                </div>

                {task.result && (
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <h4 className="text-xs font-medium text-slate-300 mb-2">Result</h4>
                    <p className="text-sm text-slate-300 bg-slate-800/50 rounded p-3 line-clamp-3">
                      {task.result}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-slate-800 bg-slate-900/30 backdrop-blur p-6 text-center text-slate-400">
            <p>No tasks found for this job</p>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/30 backdrop-blur p-4 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-slate-400">Submitted</p>
            <p className="text-white mt-1">{new Date(job.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-slate-400">User ID</p>
            <p className="text-white mt-1">{job.userId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
