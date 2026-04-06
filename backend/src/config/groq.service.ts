import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';

@Injectable()
export class GroqService {
  private client: Groq;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    this.client = new Groq({ apiKey });
  }

  getClient(): Groq {
    return this.client;
  }

  async chat(messages: any[]): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: 'mixtral-8x7b-32768',
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    return (
      response.choices[0]?.message?.content || 'No response from Groq'
    );
  }
}
