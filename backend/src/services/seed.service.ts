import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent, AgentType } from '../entities/agent.entity';
import { AgentService } from './agent.service';
import { BlockchainService } from '../config/blockchain.service';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
    private agentService: AgentService,
    private blockchainService: BlockchainService,
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
      let agent = await this.agentRepository.findOne({
        where: { agentType: agentData.agentType },
      });

      if (!agent) {
        // New agent - create and register on-chain
        try {
          agent = await this.agentService.registerAgent(agentData.agentId, agentData.agentType);
          this.logger.log(`✅ Created and registered agent on-chain: ${agentData.agentId}`);
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          this.logger.error(`❌ Failed to register agent ${agentData.agentId}: ${errorMsg}`);
        }
      } else if (!agent.contractAddress) {
        // Agent exists locally but NOT on-chain - register it now
        try {
          this.logger.log(`🔗 Registering existing agent on-chain: ${agent.agentId}`);
          const contract = this.blockchainService.getContract();
          const tx = await contract.registerAgent(agent.agentId);
          await tx.wait();
          agent.contractAddress = contract.target as string;
          await this.agentRepository.save(agent);
          this.logger.log(`✅ Registered existing agent on-chain: ${agent.agentId}`);
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          this.logger.error(`❌ Failed to register existing agent ${agent.agentId} on-chain: ${errorMsg}`);
        }
      } else {
        this.logger.debug(`✅ Agent ${agent.agentId} already on-chain at ${agent.contractAddress}`);
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
