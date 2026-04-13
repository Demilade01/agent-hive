import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { OrchestratorService } from '../services/orchestrator.service';
import { AgentService } from '../services/agent.service';
import { PaymentService } from '../services/payment.service';
import { AgentType } from '../entities/agent.entity';

@ApiTags('Jobs & Agents')
@Controller('api')
export class JobController {
  private readonly logger = new Logger(JobController.name);

  constructor(
    private orchestratorService: OrchestratorService,
    private agentService: AgentService,
    private paymentService: PaymentService,
  ) {}

  @Post('jobs')
  @ApiOperation({
    summary: 'Submit a new job',
    description: 'Create a new job that will be broken into 3 subtasks',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: 'user123' },
        jobTitle: { type: 'string', example: 'Analyze website images' },
        imageUrl: {
          type: 'string',
          example: 'https://example.com/image.png',
        },
        taskDescription: {
          type: 'string',
          example: 'Extract information from the provided image and write a summary',
        },
      },
      required: ['userId', 'jobTitle', 'imageUrl', 'taskDescription'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Job created successfully',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'uuid' },
        status: { type: 'string', example: 'pending' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  async createJob(
    @Body()
    jobData: {
      userId: string;
      jobTitle: string;
      imageUrl: string;
      taskDescription: string;
    },
  ) {
    try {
      const result = await this.orchestratorService.submitJob(jobData);
      this.logger.log(`Job created: ${result.jobId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to create job: ${error instanceof Error ? error.message : String(error)}`);
      throw new HttpException(
        'Failed to create job',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('jobs')
  @ApiOperation({
    summary: 'Get all jobs',
    description: 'Retrieve list of all jobs with their tasks',
  })
  @ApiResponse({
    status: 200,
    description: 'List of jobs',
    isArray: true,
  })
  async getAllJobs() {
    try {
      const jobs = await this.orchestratorService.getAllJobs();
      return jobs;
    } catch (error) {
      this.logger.error(`Failed to fetch jobs: ${error instanceof Error ? error.message : String(error)}`);
      throw new HttpException(
        'Failed to fetch jobs',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('jobs/:jobId')
  @ApiOperation({
    summary: 'Get job details',
    description: 'Retrieve full job details including subtasks and status',
  })
  @ApiResponse({
    status: 200,
    description: 'Job details with nested tasks',
  })
  async getJobStatus(@Param('jobId') jobId: string) {
    try {
      const job = await this.orchestratorService.getJobStatus(jobId);
      return job;
    } catch (error) {
      this.logger.error(
        `Failed to fetch job ${jobId}: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new HttpException(
        `Job ${jobId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('agents')
  @ApiOperation({
    summary: 'Get all agents',
    description: 'Retrieve list of registered agents with their statistics',
  })
  @ApiResponse({
    status: 200,
    description: 'List of agents',
    isArray: true,
  })
  async getAgents(
    @Query('type') type?: string,
    @Query('active') active?: boolean,
  ) {
    try {
      const agents = await this.agentService.getActiveAgents();
      let filtered = agents;

      if (type) {
        filtered = agents.filter((a) => a.agentType === type);
      }

      if (active !== undefined) {
        filtered = filtered.filter((a) => a.isActive === active);
      }

      // Enrich agents with their on-chain reputation stats
      const enrichedAgents = await Promise.all(
        filtered.map(async (agent) => {
          try {
            const stats = await this.agentService.getAgentReputation(agent.agentId);
            return {
              ...agent,
              stats,
            };
          } catch (error) {
            // If on-chain lookup fails, return agent with local stats
            return {
              ...agent,
              stats: {
                agentId: agent.agentId,
                completedTasks: agent.completedTasks,
                failedTasks: agent.failedTasks,
                successRate: typeof agent.successRate === 'number' ? agent.successRate : 0,
                qualityScore: typeof agent.qualityScore === 'number' ? agent.qualityScore : 0,
                totalEarned: '0',
                lastActive: agent.lastActiveAt,
              },
            };
          }
        })
      );

      return enrichedAgents;
    } catch (error) {
      this.logger.error(`Failed to fetch agents: ${error instanceof Error ? error.message : String(error)}`);
      throw new HttpException(
        'Failed to fetch agents',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('agents/:agentId/stats')
  @ApiOperation({
    summary: 'Get agent reputation & statistics',
    description: 'Retrieve agent reputation, completed tasks, and earnings',
  })
  @ApiResponse({
    status: 200,
    description: 'Agent reputation statistics',
  })
  async getAgentStats(@Param('agentId') agentId: string) {
    try {
      const stats = await this.agentService.getAgentReputation(agentId);
      return stats;
    } catch (error) {
      this.logger.error(
        `Failed to fetch agent stats ${agentId}: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new HttpException(
        `Agent ${agentId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('payments/:agentId')
  @ApiOperation({
    summary: 'Get agent payment history',
    description: 'Retrieve all payments made to a specific agent',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment history',
    isArray: true,
  })
  async getPaymentHistory(@Param('agentId') agentId: string) {
    try {
      const payments = await this.paymentService.getPaymentHistory(agentId);
      return payments;
    } catch (error) {
      this.logger.error(
        `Failed to fetch payments for ${agentId}: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new HttpException(
        'Failed to fetch payments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('payments/user/:userId')
  @ApiOperation({
    summary: 'Get user payment history',
    description: 'Retrieve all payments received by a specific user',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment history for user',
    isArray: true,
  })
  async getPaymentHistoryByUser(@Param('userId') userId: string) {
    try {
      const payments = await this.paymentService.getPaymentHistoryByUserId(userId);
      return payments;
    } catch (error) {
      this.logger.error(
        `Failed to fetch payments for user ${userId}: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new HttpException(
        'Failed to fetch payments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('agents')
  @ApiOperation({
    summary: 'Register a new agent',
    description: 'Register a new specialist agent in the system',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        agentId: { type: 'string', example: 'image_analyzer_001' },
        agentType: {
          type: 'string',
          enum: ['image_analyzer', 'context_fetcher', 'insight_writer'],
        },
      },
      required: ['agentId', 'agentType'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Agent registered successfully',
  })
  async registerAgent(
    @Body() data: { agentId: string; agentType: AgentType },
  ) {
    try {
      const agent = await this.agentService.registerAgent(
        data.agentId,
        data.agentType,
      );
      this.logger.log(`Agent registered: ${agent.agentId}`);
      return agent;
    } catch (error) {
      this.logger.error(`Failed to register agent: ${error instanceof Error ? error.message : String(error)}`);
      throw new HttpException(
        'Failed to register agent',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('test/execute-job/:jobId')
  @ApiOperation({
    summary: 'Test endpoint - Execute job agent loop',
    description: 'Manually trigger agent execution loop for a job and its tasks',
  })
  @ApiResponse({
    status: 200,
    description: 'Job execution triggered successfully',
  })
  async executeJobTest(@Param('jobId') jobId: string) {
    try {
      // Get the job and its tasks
      const job = await this.orchestratorService.getJobStatus(jobId);
      if (!job) {
        throw new Error(`Job ${jobId} not found`);
      }

      // Register a test agent if it doesn't exist
      const testAgentId = `agent-test-${Date.now()}`;
      const agent = await this.agentService.registerAgent(
        testAgentId,
        'image_analyzer' as any,
      );

      // Get pending tasks sorted by creation order (maintain sequence)
      const tasks = job.tasks
        .filter((t: any) => t.status === 'pending')
        .sort(
          (a: any, b: any) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );

      // Execute agent loop for each task SEQUENTIALLY, passing previous results
      const results: any[] = [];
      let previousResult: string | undefined;

      for (const task of tasks) {
        try {
          const result = await this.agentService.executeAgentLoop(
            task,
            previousResult,
          );
          results.push({
            taskId: task.id,
            status: 'completed',
            result,
          });
          // Pass this task's result to the next task
          previousResult = result.result;
        } catch (error) {
          results.push({
            taskId: task.id,
            status: 'failed',
            error: error instanceof Error ? error.message : String(error),
          });
          // Don't break chain; next task can still work without this one
        }
      }

      return { jobId, agentId: agent.id, executions: results };
    } catch (error) {
      this.logger.error(
        `Test execution failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new HttpException(
        'Test execution failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('health')
  @ApiOperation({
    summary: 'Health check',
    description: 'Check if backend service is running',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
  })
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
