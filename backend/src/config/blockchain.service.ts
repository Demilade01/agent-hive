import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

const REPUTATION_REGISTRY_ABI = [
  'function registerAgent(string agentId) external',
  'function recordTaskCompletion(string agentId, bytes32 taskId, uint256 reward, uint8 qualityScore) external',
  'function recordTaskFailure(string agentId) external',
  'function getAgentReputation(string agentId) external view returns (tuple(string agentId, uint256 completedTasks, uint256 failedTasks, uint256 totalEarned, uint256 qualityScore, uint256 createdAt, uint256 lastActiveAt, bool exists))',
  'function getSuccessRate(string agentId) external view returns (uint256)',
];

@Injectable()
export class BlockchainService {
  private provider!: ethers.Provider;
  private contract!: ethers.Contract;
  private signer!: ethers.Signer;

  constructor(private configService: ConfigService) {
    this.initializeBlockchain();
  }

  private initializeBlockchain() {
    const rpcUrl = this.configService.get<string>('KITE_RPC_URL');
    const privateKey = this.configService.get<string>('KITE_PRIVATE_KEY');
    const contractAddress = this.configService.get<string>(
      'REPUTATION_REGISTRY_ADDRESS',
    );

    if (!rpcUrl || !privateKey || !contractAddress) {
      throw new Error('Missing required blockchain environment variables');
    }

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.signer = new ethers.Wallet(privateKey, this.provider);
    this.contract = new ethers.Contract(
      contractAddress,
      REPUTATION_REGISTRY_ABI,
      this.signer,
    );
  }

  getProvider(): ethers.Provider {
    return this.provider;
  }

  getSigner(): ethers.Signer {
    return this.signer;
  }

  getContract(): ethers.Contract {
    return this.contract;
  }
}
