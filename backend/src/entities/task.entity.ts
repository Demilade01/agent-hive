import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Base } from '../database/base.entity';
import { Job } from './job.entity';
import { Agent } from './agent.entity';
import { Payment } from './payment.entity';

export enum TaskType {
  IMAGE_ANALYZER = 'image_analyzer',
  CONTEXT_FETCHER = 'context_fetcher',
  INSIGHT_WRITER = 'insight_writer',
}

export enum TaskStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('tasks')
export class Task extends Base {
  @Column()
  jobId!: string;

  @Column({ nullable: true })
  agentId?: string;

  @Column({ type: 'enum', enum: TaskType })
  taskType!: TaskType;

  @Column('text')
  instruction!: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
  status!: TaskStatus;

  @Column('text', { nullable: true })
  result?: string;

  @Column({ nullable: true })
  completedAt?: Date;

  @ManyToOne(() => Job, (job) => job.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId' })
  job!: Job;

  @ManyToOne(() => Agent, (agent) => agent.tasks, { nullable: true })
  @JoinColumn({ name: 'agentId' })
  agent?: Agent;

  @OneToMany(() => Payment, (payment) => payment.task)
  payments!: Payment[];
}
