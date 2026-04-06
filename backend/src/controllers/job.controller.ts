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

      return filtered;
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
