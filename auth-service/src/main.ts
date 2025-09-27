import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AuthModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 3001,
    },
  });
  await app.listen();
  console.log('Auth Service is running on port 3001');
}
bootstrap();