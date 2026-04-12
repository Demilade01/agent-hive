import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Base } from '../database/base.entity';
import { Agent } from './agent.entity';
import { Task } from './task.entity';
import { User } from './user.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('payments')
export class Payment extends Base {
  @Column()
  agentId!: string;

  @Column()
  taskId!: string;

  @Column({ nullable: true })
  userId?: string; // User ID (UUID) of who earned this payment

  @Column({ type: 'varchar', length: 255 })
  amount!: string; // Stored as string to avoid precision loss (USDC in wei)

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status!: PaymentStatus;

  @Column({ nullable: true })
  kiteTransactionHash?: string;

  @ManyToOne(() => Agent, (agent) => agent.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agentId' })
  agent!: Agent;

  @ManyToOne(() => Task, (task) => task.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
  task!: Task;

  @ManyToOne(() => User, (user) => user.payments, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;
}
