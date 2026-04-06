import {
  Entity,
  Column,
  OneToMany,
  Unique,
} from 'typeorm';
import { Base } from '../database/base.entity';
import { Task } from './task.entity';
import { Payment } from './payment.entity';

export enum AgentType {
  IMAGE_ANALYZER = 'image_analyzer',
  CONTEXT_FETCHER = 'context_fetcher',
  INSIGHT_WRITER = 'insight_writer',
}

@Entity('agents')
@Unique(['agentId'])
export class Agent extends Base {
  @Column()
  agentId!: string;

  @Column({ type: 'enum', enum: AgentType, default: AgentType.IMAGE_ANALYZER })
  agentType!: AgentType;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ nullable: true })
  contractAddress?: string;

  @Column({ default: 0 })
  completedTasks!: number;

  @Column({ default: 0 })
  failedTasks!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  successRate!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  qualityScore!: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  lastActiveAt!: Date;

  @OneToMany(() => Task, (task) => task.agent)
  tasks!: Task[];

  @OneToMany(() => Payment, (payment) => payment.agent)
  payments!: Payment[];
}
