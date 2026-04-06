import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MCPToolService {
  private readonly logger = new Logger(MCPToolService.name);
  private readonly maxRetries = 3;
  private readonly retryDelayMs = 1000;

  constructor(private configService: ConfigService) {}

  async callKitePayTool(
    agentId: string,
    amount: string,
    taskId: string,
  ): Promise<string> {
    this.logger.log(`Calling Kite pay tool: agent=${agentId}, amount=${amount}`);

    let lastError: Error = new Error('Unknown error');

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        // In production, this would call the actual MCP tool
        // For now, we'll simulate a successful payment
        const transactionHash = await this.simulateKitePayment(
          agentId,
          amount,
          taskId,
        );
        this.logger.log(`Payment successful: txHash=${transactionHash}`);
        return transactionHash;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        const errorMsg = error instanceof Error ? error.message : String(error);
        this.logger.warn(
          `Payment attempt ${attempt + 1} failed: ${errorMsg}`,
        );

        if (attempt < this.maxRetries - 1) {
          const delayMs = this.retryDelayMs * Math.pow(2, attempt);
          this.logger.debug(
            `Retrying payment in ${delayMs}ms (attempt ${attempt + 2}/${this.maxRetries})`,
          );
          await this.sleep(delayMs);
        }
      }
    }

    throw new Error(
      `Payment failed after ${this.maxRetries} attempts: ${lastError.message}`,
    );
  }

  private async simulateKitePayment(
    agentId: string,
    amount: string,
    taskId: string,
  ): Promise<string> {
    // Simulate API call delay
    await this.sleep(100);

    // Generate a mock transaction hash
    const mockTxHash = `0x${this.generateRandomHex(64)}`;

    this.logger.debug(
      `Simulated Kite payment: agent=${agentId}, amount=${amount}, txHash=${mockTxHash}`,
    );

    return mockTxHash;
  }

  private generateRandomHex(length: number): string {
    const characters = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * 16));
    }
    return result;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
