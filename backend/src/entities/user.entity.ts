import { Entity, Column, OneToMany, Index } from 'typeorm';
import { Base } from '../database/base.entity';
import { Job } from './job.entity';
import { Payment } from './payment.entity';

@Entity('users')
@Index(['walletAddress'], { unique: true })
export class User extends Base {
  @Column({ unique: true })
  walletAddress!: string;

  @Column({ nullable: true })
  displayName?: string;

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => Job, (job) => job.user)
  jobs?: Job[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments?: Payment[];
}
