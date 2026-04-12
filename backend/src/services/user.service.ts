import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Get or create user by wallet address
   * If user doesn't exist, create a new one
   */
  async getOrCreateUser(walletAddress: string): Promise<User> {
    this.logger.log(`Get or create user for wallet: ${walletAddress}`);

    let user = await this.userRepository.findOne({
      where: { walletAddress },
    });

    if (!user) {
      // Create new user
      user = this.userRepository.create({
        walletAddress,
        displayName: `User ${walletAddress.slice(0, 6)}`,
      });
      user = await this.userRepository.save(user);
      this.logger.log(`Created new user: ${user.id} for wallet: ${walletAddress}`);
    }

    return user;
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
    });
  }

  /**
   * Get user by wallet address
   */
  async getUserByWallet(walletAddress: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { walletAddress },
    });
  }

  /**
   * Update user display name
   */
  async updateUserDisplayName(userId: string, displayName: string): Promise<User> {
    await this.userRepository.update(userId, { displayName });
    return this.getUserById(userId) as Promise<User>;
  }
}
