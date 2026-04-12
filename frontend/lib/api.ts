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
 * Helper function to handle API responses with better error messages
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `API Error: ${response.statusText}`;

    try {
      const error = await response.json();
      errorMessage = error.message || error.detail || errorMessage;
    } catch {
      // Failed to parse error response
    }

    // Provide specific error messages based on status
    switch (response.status) {
      case 400:
        errorMessage = `Invalid request: ${errorMessage}`;
        break;
      case 401:
        errorMessage = 'Authentication failed. Please connect your wallet.';
        break;
      case 403:
        errorMessage = 'You do not have permission to access this resource.';
        break;
      case 404:
        errorMessage = 'Resource not found.';
        break;
      case 500:
        errorMessage = 'Server error. Please try again later.';
        break;
      case 503:
        errorMessage = 'Service unavailable. Please try again later.';
        break;
    }

    throw {
      message: errorMessage,
      status: response.status,
    } as ApiError;
  }

  try {
    return await response.json();
  } catch {
    throw {
      message: 'Failed to parse response from server',
      status: response.status,
    } as ApiError;
  }
}

/**
 * Helper to wrap API calls with network error handling
 */
async function withNetworkError<T>(
  fn: () => Promise<T>
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw {
        message: 'Connection failed. Please check your internet connection.',
        status: 0,
      } as ApiError;
    }
    throw err;
  }
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
   * Get payment history for a user (by userId)
   */
  getPaymentHistory: async (userId: string): Promise<Payment[]> => {
    const response = await fetch(`${API_BASE_URL}/payments/user/${userId}`);
    return handleResponse<Payment[]>(response);
  },

  /**
   * Get payment history for an agent (legacy - for backwards compatibility)
   */
  getPaymentHistoryByAgent: async (agentId: string): Promise<Payment[]> => {
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
