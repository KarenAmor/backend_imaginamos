import { NestFactory } from '@nestjs/core';
import { BillingModule } from './billing/billing.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(BillingModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 3004, // Puerto único para Billing Service
    },
  });
  await app.listen();
  console.log('Billing Service is running on port 3004');
}
bootstrap();