import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent, AgentType } from '../entities/agent.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
  ) {}

  async seedAgents(): Promise<void> {
    this.logger.log('Seeding default agents...');

    const agents = [
      {
        agentId: 'analyzer-1',
        agentType: AgentType.IMAGE_ANALYZER,
      },
      {
        agentId: 'fetcher-1',
        agentType: AgentType.CONTEXT_FETCHER,
      },
      {
        agentId: 'writer-1',
        agentType: AgentType.INSIGHT_WRITER,
      },
    ];

    for (const agentData of agents) {
      const exists = await this.agentRepository.findOne({
        where: { agentType: agentData.agentType },
      });

      if (!exists) {
        const agent = this.agentRepository.create({
          ...agentData,
          isActive: true,
          completedTasks: 0,
          failedTasks: 0,
          successRate: 100,
          qualityScore: 100,
          lastActiveAt: new Date(),
        });
        await this.agentRepository.save(agent);
        this.logger.log(`Created agent: ${agentData.agentId}`);
      } else {
        this.logger.log(`Agent ${agentData.agentType} already exists`);
      }
    }

    this.logger.log('Agent seeding completed');
  }

  async onModuleInit(): Promise<void> {
    await this.seedAgents();
  }
}
