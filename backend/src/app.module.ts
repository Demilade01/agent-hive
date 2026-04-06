import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { JobController } from './controllers/job.controller';
import { OrchestratorService } from './services/orchestrator.service';
import { AgentService } from './services/agent.service';
import { PaymentService } from './services/payment.service';
import { MCPToolService } from './services/mcp-tool.service';
import { BlockchainService } from './config/blockchain.service';
import { GroqService } from './config/groq.service';
import { Job } from './entities/job.entity';
import { Task } from './entities/task.entity';
import { Agent } from './entities/agent.entity';
import { Payment } from './entities/payment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([Job, Task, Agent, Payment]),
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController, JobController],
  providers: [
    AppService,
    OrchestratorService,
    AgentService,
    PaymentService,
    MCPToolService,
    BlockchainService,
    GroqService,
  ],
})
export class AppModule {}
