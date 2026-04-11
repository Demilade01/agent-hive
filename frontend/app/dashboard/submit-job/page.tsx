'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { jobApi } from '@/lib/api';
import { toast } from '@/lib/toast-service';
import { Loader } from 'lucide-react';

export default function SubmitJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    userId: '',
    jobTitle: '',
    imageUrl: '',
    taskDescription: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.userId.trim()) {
      toast.error('User ID is required');
      return;
    }
    if (!formData.jobTitle.trim()) {
      toast.error('Job Title is required');
      return;
    }
    if (!formData.imageUrl.trim()) {
      toast.error('Image URL is required');
      return;
    }
    if (!formData.taskDescription.trim()) {
      toast.error('Task Description is required');
      return;
    }

    // Try to validate URL
    try {
      new URL(formData.imageUrl);
    } catch {
      toast.error('Invalid image URL format');
      return;
    }

    setLoading(true);
    const loadingToastId = toast.loading('Submitting job...');
    try {
      const response = await jobApi.submitJob(formData);
      toast.dismiss(loadingToastId);
      toast.success(`Job submitted successfully! Job ID: ${response.id}`);
      setFormData({ userId: '', jobTitle: '', imageUrl: '', taskDescription: '' });

      // Redirect to job details after 2 seconds
      setTimeout(() => {
        router.push(`/dashboard/jobs/${response.id}`);
      }, 2000);
    } catch (err: any) {
      toast.dismiss(loadingToastId);
      toast.error('Failed to submit job', err.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Submit New Job</h1>
        <p className="mt-2 text-slate-400">
          Create a new job for AI agents to process
        </p>
      </div>

      {/* Alert Messages Removed - Using toast notifications instead */}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 backdrop-blur p-6 shadow-xl space-y-6">
          {/* User ID */}
          <div className="space-y-2">
            <label htmlFor="userId" className="block text-sm font-medium text-white">
              User ID
            </label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleInputChange}
              placeholder="Your unique identifier (e.g., user-123)"
              className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              disabled={loading}
            />
          </div>

          {/* Job Title */}
          <div className="space-y-2">
            <label htmlFor="jobTitle" className="block text-sm font-medium text-white">
              Job Title
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              placeholder="e.g., Analyze Product Image"
              className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              disabled={loading}
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-white">
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              disabled={loading}
            />
            <p className="text-xs text-slate-400">
              Provide a direct URL to an image (jpg, png, gif, etc.)
            </p>
          </div>

          {/* Task Description */}
          <div className="space-y-2">
            <label htmlFor="taskDescription" className="block text-sm font-medium text-white">
              Task Description
            </label>
            <textarea
              id="taskDescription"
              name="taskDescription"
              value={formData.taskDescription}
              onChange={handleInputChange}
              placeholder="Describe what you want the AI agents to do with the image..."
              rows={4}
              className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              disabled={loading}
            />
            <p className="text-xs text-slate-400">
              Be specific about what analysis or processing you need
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 px-6 py-3 font-medium text-white transition-all hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 glow-cyan-lg"
        >
          {loading ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Job'
          )}
        </button>
      </form>

      {/* Info Box */}
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 backdrop-blur p-4">
        <h3 className="font-semibold text-cyan-300">How it works</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          <li>
            1. Submit your job with an image URL and description
          </li>
          <li>
            2. AgentHive orchestrates 3 agents in sequence (analyzer, context fetcher, writer)
          </li>
          <li>
            3. Each agent processes and passes results to the next
          </li>
          <li>
            4. Final results are available in your job dashboard
          </li>
        </ul>
      </div>
    </div>
  );
}
