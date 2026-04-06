import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('AgentHive API')
    .setDescription(
      'Decentralized AI Agent Marketplace - API documentation for job orchestration, agent management, and payment tracking',
    )
    .setVersion('1.0.0')
    .addTag(
      'Jobs & Agents',
      'Job submission, task management, agent registration, and payment tracking',
    )
    .setContact(
      'AgentHive Team',
      'https://agenthive.dev',
      'support@agenthive.dev',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      deepLinking: true,
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 AgentHive Backend running on http://localhost:${port}`);
  console.log(`📚 Swagger docs available at http://localhost:${port}/docs`);
}
bootstrap();
