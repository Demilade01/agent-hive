import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Task, TaskStatus } from '../entities/task.entity';
import { Agent, AgentType } from '../entities/agent.entity';
import { Job, JobStatus } from '../entities/job.entity';
import { GroqService } from '../config/groq.service';
import { BlockchainService } from '../config/blockchain.service';
import { MCPToolService } from './mcp-tool.service';

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);

  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    private groqService: GroqService,
    private blockchainService: BlockchainService,
    private mcpToolService: MCPToolService,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('task.assigned')
  async handleTaskAssigned(payload: { task: Task; agent: Agent }): Promise<void> {
    this.logger.log(`Task assigned event received for task ${payload.task.id}`);
    try {
      // Fetch the job to get all tasks
      const job = await this.jobRepository.findOne({
        where: { id: payload.task.jobId },
        relations: ['tasks'],
      });

      if (!job) {
        throw new Error(`Job ${payload.task.jobId} not found`);
      }

      // Sort tasks by creation order
      const sortedTasks = job.tasks.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      const taskIndex = sortedTasks.findIndex(t => t.id === payload.task.id);

      // Get previous task's result if it exists and is completed
      let previousResult: string | undefined;
      if (taskIndex > 0) {
        const previousTask = sortedTasks[taskIndex - 1];
        if (previousTask.status === TaskStatus.COMPLETED && previousTask.result) {
          previousResult = previousTask.result;
        }
      }

      await this.executeAgentLoop(payload.task, previousResult);
    } catch (error) {
      this.logger.error(`Failed to execute task ${payload.task.id}: ${error}`);
      // Update task status to failed
      payload.task.status = TaskStatus.FAILED;
      await this.taskRepository.save(payload.task);
    }
  }

  async executeAgentLoop(
    task: Task,
    previousResult?: string,
  ): Promise<{
    taskId: string;
    result: string;
    paymentHash: string;
    completionTime: number;
  }> {
    const startTime = Date.now();
    this.logger.log(`Executing agent loop for task ${task.id}`);

    const agent = await this.agentRepository.findOne({
      where: { id: task.agentId },
    });

    if (!agent) {
      throw new Error(`Agent ${task.agentId} not found`);
    }

    let result = '';
    let paymentHash = '';
    const maxIterations = 5;

    for (let iteration = 0; iteration < maxIterations; iteration++) {
      try {
        // PERCEIVE: Get task context with previous results
        const prompt = this.buildPrompt(task, agent, previousResult);

        // DECIDE: Call Groq
        this.logger.debug(`Groq API call - iteration ${iteration + 1}`);
        const groqResponse = await this.groqService.chat([
          { role: 'user', content: prompt },
        ]);

        // ACT: Parse response
        const action = this.parseGroqResponse(groqResponse);

        if (action.type === 'complete') {
          result = action.content;

          // PAY: Call MCP tool to send payment autonomously
          paymentHash = await this.mcpToolService.callKitePayTool(
            agent.agentId,
            '1000000', // 1 USDC in wei (6 decimals)
            task.id,
          );

          // REPORT: Update DB
          task.result = result;
          task.status = TaskStatus.COMPLETED;
          task.completedAt = new Date();
          await this.taskRepository.save(task);

          // Update agent stats
          agent.completedTasks++;
          agent.lastActiveAt = new Date();
          await this.agentRepository.save(agent);

          // Record on-chain via contract
          await this.recordOnChain(agent.agentId, task.id);

          this.logger.log(`Task ${task.id} completed by agent ${agent.agentId}`);

          // Emit event to trigger next task assignment
          this.eventEmitter.emit('task.completed', { taskId: task.id, jobId: task.jobId });

          break;
        } else if (action.type === 'error') {
          throw new Error(action.content);
        }
      } catch (error) {
        this.logger.error(`Error in agent loop iteration ${iteration + 1}:`, error);
        if (iteration === maxIterations - 1) {
          task.status = TaskStatus.FAILED;
          await this.taskRepository.save(task);
          agent.failedTasks++;
          await this.agentRepository.save(agent);
          throw error;
        }
      }
    }

    const completionTime = Date.now() - startTime;

    return {
      taskId: task.id,
      result,
      paymentHash,
      completionTime,
    };
  }

  async registerAgent(
    agentId: string,
    agentType: AgentType,
  ): Promise<Agent> {
    this.logger.log(`Registering agent ${agentId}`);

    const agent = this.agentRepository.create({
      agentId,
      agentType,
      isActive: true,
      lastActiveAt: new Date(),
    });

    await this.agentRepository.save(agent);

    // Register on-chain
    try {
      const contract = this.blockchainService.getContract();
      const tx = await contract.registerAgent(agentId);
      await tx.wait();
      agent.contractAddress = contract.target as string;
      await this.agentRepository.save(agent);
      this.logger.log(`Agent ${agentId} registered on-chain`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Failed to register agent on-chain: ${errorMsg}`);
    }

    return agent;
  }

  async getAgentReputation(agentId: string): Promise<{
    agentId: string;
    completedTasks: number;
    failedTasks: number;
    successRate: number;
    qualityScore: number;
    totalEarned: string;
    lastActive: Date;
  }> {
    const agent = await this.agentRepository.findOne({
      where: { agentId },
    });

    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    // Query on-chain reputation
    try {
      const contract = this.blockchainService.getContract();
      const onChainReputation = await contract.getAgentReputation(agentId);

      return {
        agentId,
        completedTasks: agent.completedTasks,
        failedTasks: agent.failedTasks,
        successRate: parseFloat(agent.successRate.toString()),
        qualityScore: parseFloat(agent.qualityScore.toString()),
        totalEarned: onChainReputation.totalEarned.toString(),
        lastActive: agent.lastActiveAt,
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      this.logger.warn(
        `Failed to fetch on-chain reputation for ${agentId}: ${errorMsg}`,
      );
      return {
        agentId,
        completedTasks: agent.completedTasks,
        failedTasks: agent.failedTasks,
        successRate: parseFloat(agent.successRate.toString()),
        qualityScore: parseFloat(agent.qualityScore.toString()),
        totalEarned: '0',
        lastActive: agent.lastActiveAt,
      };
    }
  }

  async getActiveAgents(): Promise<Agent[]> {
    return this.agentRepository.find({
      where: { isActive: true },
      order: { lastActiveAt: 'DESC' },
    });
  }

  private buildPrompt(
    task: Task,
    agent: Agent,
    previousResult?: string,
  ): string {
    let context = `You are a ${agent.agentType} specialist agent in the AgentHive system.

Task Type: ${task.taskType}
Task ID: ${task.id}
Instruction: ${task.instruction}`;

    if (previousResult) {
      context += `\n\nPrevious Task Result (use this as context):\n${previousResult}`;
    }

    context += `\n\nPlease execute this task and provide a clear, concise result.
Respond with JSON in this format:
{
  "action": "complete",
  "content": "your result here"
}

If you cannot complete the task, respond with:
{
  "action": "error",
  "content": "reason here"
}`;

    return context;
  }

  private parseGroqResponse(response: string): {
    type: string;
    content: string;
  } {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          type: parsed.action,
          content: parsed.content,
        };
      }
    } catch (error) {
      this.logger.warn('Failed to parse Groq response as JSON');
    }

    // Fallback: treat entire response as result
    return {
      type: 'complete',
      content: response,
    };
  }

  private async recordOnChain(agentId: string, taskId: string): Promise<void> {
    try {
      const contract = this.blockchainService.getContract();
      const tx = await contract.recordTaskCompletion(
        agentId,
        taskId,
        '1000000', // 1 USDC
        85, // quality score
      );
      await tx.wait();
      this.logger.log(`Task ${taskId} recorded on-chain for agent ${agentId}`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to record on-chain: ${errorMsg}`);
    }
  }
}
