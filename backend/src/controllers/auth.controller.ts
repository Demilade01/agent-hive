import {
  Controller,
  Post,
  Body,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private userService: UserService) {}

  @Post('register-or-login')
  @ApiOperation({
    summary: 'Register or login user with wallet address',
    description: 'Create a new user if wallet doesn\'t exist, or return existing user',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        walletAddress: {
          type: 'string',
          example: '0x5BDD114DA798B730121eB4f0BC8b0509Bb4Caff0',
        },
      },
      required: ['walletAddress'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User registered or logged in successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        walletAddress: { type: 'string' },
        displayName: { type: 'string' },
      },
    },
  })
  async registerOrLogin(
    @Body('walletAddress') walletAddress: string,
  ): Promise<{ id: string; walletAddress: string; displayName?: string }> {
    this.logger.log(`Register or login: ${walletAddress}`);

    if (!walletAddress || !walletAddress.startsWith('0x')) {
      throw new HttpException(
        'Invalid wallet address',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const user = await this.userService.getOrCreateUser(walletAddress);
      return {
        id: user.id,
        walletAddress: user.walletAddress,
        displayName: user.displayName,
      };
    } catch (error) {
      this.logger.error(`Failed to register/login user: ${error}`);
      throw new HttpException(
        'Failed to register/login user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
