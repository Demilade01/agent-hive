/**
 * AgentHive API Service
 * Centralized service for all backend API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface ApiError {
  message: string;
  status?: number;
}

// Job Types
export interface Job {
  id: string;
  userId: string;
  jobTitle: string;
  imageUrl: string;
  taskDescription: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  tasks?: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  jobId: string;
  agentId?: string;
  taskType: 'image_analyzer' | 'context_fetcher' | 'insight_writer';
  instruction: string;
  status: 'pending' | 'assigned' | 'completed' | 'failed';
  result?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Agent Types
export interface Agent {
  id: string;
  agentId: string;
  agentType: 'image_analyzer' | 'context_fetcher' | 'insight_writer';
  isActive: boolean;
  contractAddress?: string;
  completedTasks: number;
  failedTasks: number;
  successRate: number;
  qualityScore: number;
  lastActiveAt: string;
  createdAt: string;
  updatedAt: string;
}

// Payment Types
export interface Payment {
  id: string;
  agentId: string;
  taskId: string;
  amount: string;
  status: 'pending' | 'completed' | 'failed';
  kiteTransactionHash?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Helper function to handle API responses
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw {
      message: error.message || `API Error: ${response.statusText}`,
      status: response.status,
    } as ApiError;
  }
  return response.json();
}

/**
 * Job API Methods
 */
export const jobApi = {
  /**
   * Submit a new job
   */
  submitJob: async (data: {
    userId: string;
    jobTitle: string;
    imageUrl: string;
    taskDescription: string;
  }): Promise<Job> => {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Job>(response);
  },

  /**
   * Get all jobs
   */
  getAllJobs: async (): Promise<Job[]> => {
    const response = await fetch(`${API_BASE_URL}/jobs`);
    return handleResponse<Job[]>(response);
  },

  /**
   * Get job details with tasks
   */
  getJobById: async (jobId: string): Promise<Job & { completionPercentage: number }> => {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
    return handleResponse<Job & { completionPercentage: number }>(response);
  },
};

/**
 * Agent API Methods
 */
export const agentApi = {
  /**
   * Get all agents with optional filters
   */
  getAllAgents: async (params?: {
    type?: 'image_analyzer' | 'context_fetcher' | 'insight_writer';
    active?: boolean;
  }): Promise<Agent[]> => {
    const url = new URL(`${API_BASE_URL}/agents`);
    if (params?.type) url.searchParams.append('type', params.type);
    if (params?.active !== undefined) url.searchParams.append('active', String(params.active));
    
    const response = await fetch(url.toString());
    return handleResponse<Agent[]>(response);
  },

  /**
   * Get agent stats and reputation
   */
  getAgentStats: async (agentId: string): Promise<Agent> => {
    const response = await fetch(`${API_BASE_URL}/agents/${agentId}/stats`);
    return handleResponse<Agent>(response);
  },

  /**
   * Register a new agent
   */
  registerAgent: async (data: {
    agentId: string;
    agentType: 'image_analyzer' | 'context_fetcher' | 'insight_writer';
  }): Promise<Agent> => {
    const response = await fetch(`${API_BASE_URL}/agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Agent>(response);
  },
};

/**
 * Payment API Methods
 */
export const paymentApi = {
  /**
   * Get payment history for an agent
   */
  getPaymentHistory: async (agentId: string): Promise<Payment[]> => {
    const response = await fetch(`${API_BASE_URL}/payments/${agentId}`);
    return handleResponse<Payment[]>(response);
  },
};

/**
 * Health Check
 */
export const healthApi = {
  check: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return handleResponse<{ status: string; timestamp: string }>(response);
  },
};
