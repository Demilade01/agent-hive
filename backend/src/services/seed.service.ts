import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent, AgentType } from '../entities/agent.entity';
import { AgentService } from './agent.service';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
    private agentService: AgentService,
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
        try {
          // Use AgentService.registerAgent() to register both locally and on-chain
          const agent = await this.agentService.registerAgent(agentData.agentId, agentData.agentType);
          this.logger.log(`Created and registered agent on-chain: ${agentData.agentId}`);
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          this.logger.error(`Failed to register agent ${agentData.agentId}: ${errorMsg}`);
        }
      } else {
        this.logger.log(`Agent ${agentData.agentType} already exists`);
      }
    }

    this.logger.log('Agent seeding completed');
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.seedAgents();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to seed agents: ${errorMsg}`);
    }
  }
}
