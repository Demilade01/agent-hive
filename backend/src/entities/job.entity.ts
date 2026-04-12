import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Base } from '../database/base.entity';
import { Task } from './task.entity';
import { User } from './user.entity';

export enum JobStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('jobs')
export class Job extends Base {
  @Column()
  userId!: string;

  @Column()
  jobTitle!: string;

  @Column()
  imageUrl!: string;

  @Column('text')
  taskDescription!: string;

  @Column({ type: 'enum', enum: JobStatus, default: JobStatus.PENDING })
  status!: JobStatus;

  @OneToMany(() => Task, (task) => task.job, { cascade: true })
  tasks!: Task[];

  @ManyToOne(() => User, (user) => user.jobs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;
}
