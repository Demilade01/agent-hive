import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Job, JobStatus } from '../entities/job.entity';
import { Task, TaskType, TaskStatus } from '../entities/task.entity';
import { Agent, AgentType } from '../entities/agent.entity';

@Injectable()
export class OrchestratorService {
  private readonly logger = new Logger(OrchestratorService.name);

  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
    private eventEmitter: EventEmitter2,
  ) {}

  async submitJob(jobData: {
    userId: string;
    jobTitle: string;
    imageUrl: string;
    taskDescription: string;
  }): Promise<{ jobId: string; status: string; createdAt: Date }> {
    this.logger.log(`Submitting job: ${jobData.jobTitle}`);

    // Create job record
    const job = this.jobRepository.create({
      ...jobData,
      status: JobStatus.PENDING,
    });
    await this.jobRepository.save(job);

    // Create 3 subtasks (hardcoded workflow)
    const subtasks: Task[] = [];
    const taskTypes = [
      TaskType.IMAGE_ANALYZER,
      TaskType.CONTEXT_FETCHER,
      TaskType.INSIGHT_WRITER,
    ];

    for (let i = 0; i < taskTypes.length; i++) {
      const taskType = taskTypes[i];
      let instruction = '';

      switch (taskType) {
        case TaskType.IMAGE_ANALYZER:
          instruction = `Analyze the provided image and extract key information. Image URL: ${jobData.imageUrl}`;
          break;
        case TaskType.CONTEXT_FETCHER:
          instruction = `Based on the image analysis result, fetch additional context and relevant information`;
          break;
        case TaskType.INSIGHT_WRITER:
          instruction = `Write a comprehensive summary and insights based on the image analysis and context`;
          break;
      }

      const task = this.taskRepository.create({
        jobId: job.id,
        taskType,
        instruction,
        status: TaskStatus.PENDING,
      });
      subtasks.push(task);
    }

    await this.taskRepository.save(subtasks);

    this.logger.log(`Job ${job.id} created with 3 subtasks`);

    // Emit event to trigger automatic execution (non-blocking)
    this.eventEmitter.emit('job.submitted', { jobId: job.id });

    return {
      jobId: job.id,
      status: JobStatus.PENDING,
      createdAt: job.createdAt,
    };
  }

  @OnEvent('job.submitted')
  async handleJobSubmitted(payload: { jobId: string }): Promise<void> {
    this.logger.log(`Job submitted event received for job ${payload.jobId}`);
    // Wait a moment to ensure tasks are persisted
    await new Promise(resolve => setTimeout(resolve, 100));
    await this.assignTasksToAgents();
  }

  @OnEvent('task.completed')
  async handleTaskCompleted(payload: { taskId: string; jobId: string; result?: string }): Promise<void> {
    this.logger.log(`Task completed event received for task ${payload.taskId}`);
    // Wait to ensure task result is fully persisted to database and queries catch up
    await new Promise(resolve => setTimeout(resolve, 500));
    // Try to assign the next task in the sequence
    await this.assignTasksToAgents();
  }

  async assignTasksToAgents(): Promise<void> {
    this.logger.debug('Assigning pending tasks to agents...');

    // Find pending tasks
    const pendingTasks = await this.taskRepository.find({
      where: { status: TaskStatus.PENDING },
      take: 10,
      relations: ['job'],
    });

    // Group by jobId to process one task per job per call
    const jobTaskMap = new Map<string, Task[]>();
    for (const task of pendingTasks) {
      if (!jobTaskMap.has(task.jobId)) {
        jobTaskMap.set(task.jobId, []);
      }
      jobTaskMap.get(task.jobId)!.push(task);
    }

    // For each job, assign only ONE pending task
    for (const [jobId, jobPendingTasks] of jobTaskMap) {
      // Sort pending tasks by creation date to process in order
      jobPendingTasks.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      const job = await this.jobRepository.findOne({
        where: { id: jobId },
        relations: ['tasks'],
      });

      if (!job) continue;

      // Get all tasks for this job, sorted by creation
      const jobTasks = job.tasks.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      // Find first pending task that meets prerequisites
      let assignedThisJob = false;
      for (const task of jobPendingTasks) {
        if (assignedThisJob) break; // Only assign one task per job per call

        const taskIndex = jobTasks.findIndex(t => t.id === task.id);

        // Only assign if this is the first task OR previous task is completed
        if (taskIndex > 0) {
          const previousTask = jobTasks[taskIndex - 1];
          if (previousTask.status !== TaskStatus.COMPLETED) {
            this.logger.debug(
              `Task ${task.id} (${task.taskType}) waiting: previous task ${previousTask.id} is ${previousTask.status}`
            );
            continue;
          }
        }

        // Find available agent with matching type
        const agent = await this.agentRepository.findOne({
          where: {
            agentType: task.taskType as unknown as AgentType,
            isActive: true,
          },
        });

        if (agent) {
          task.agentId = agent.id;
          task.status = TaskStatus.ASSIGNED;
          await this.taskRepository.save(task);

          this.logger.log(`Task ${task.id} (${task.taskType}) assigned to agent ${agent.agentId}`);
          this.eventEmitter.emit('task.assigned', { task, agent });
          assignedThisJob = true; // Mark that we assigned a task for this job this call
        }
      }
    }
  }

  async getJobStatus(jobId: string): Promise<Job & { completionPercentage: number }> {
    const job = await this.jobRepository.findOne({
      where: { id: jobId },
      relations: ['tasks'],
    });

    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    const completedTasks = job.tasks.filter(
      (t) => t.status === TaskStatus.COMPLETED,
    ).length;
    const completionPercentage = (completedTasks / job.tasks.length) * 100;

    return {
      ...job,
      completionPercentage,
    } as any;
  }

  async getAllJobs(): Promise<Job[]> {
    return this.jobRepository.find({
      relations: ['tasks'],
      order: { createdAt: 'DESC' },
    });
  }
}
