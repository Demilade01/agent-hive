import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from '../entities/payment.entity';
import { Agent } from '../entities/agent.entity';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
  ) {}

  async initiatePayment(
    agentId: string,
    taskId: string,
    amount: string,
  ): Promise<Payment> {
    this.logger.log(
      `Initiating payment: agent=${agentId}, task=${taskId}, amount=${amount}`,
    );

    const payment = this.paymentRepository.create({
      agentId,
      taskId,
      amount,
      status: PaymentStatus.PENDING,
    });

    return this.paymentRepository.save(payment);
  }

  async recordPaymentSuccess(
    paymentId: string,
    kiteTransactionHash: string,
  ): Promise<Payment> {
    this.logger.log(
      `Recording payment success: ${paymentId}, txHash=${kiteTransactionHash}`,
    );

    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new Error(`Payment ${paymentId} not found`);
    }

    payment.status = PaymentStatus.COMPLETED;
    payment.kiteTransactionHash = kiteTransactionHash;

    const savedPayment = await this.paymentRepository.save(payment);

    // Update agent earnings (stored as string to avoid precision loss)
    const agent = await this.agentRepository.findOne({
      where: { id: payment.agentId },
    });

    if (agent) {
      // In production, update totalEarned if tracked
      agent.lastActiveAt = new Date();
      await this.agentRepository.save(agent);
    }

    return savedPayment;
  }

  async getPaymentHistory(agentId: string): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { agentId },
      relations: ['task'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get payment history for a user (by userId, not agentId)
   */
  async getPaymentHistoryByUserId(userId: string): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { userId },
      relations: ['task', 'agent'],
      order: { createdAt: 'DESC' },
    });
  }

  async getPaymentById(paymentId: string): Promise<Payment | null> {
    return this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: ['agent', 'task'],
    });
  }
}
