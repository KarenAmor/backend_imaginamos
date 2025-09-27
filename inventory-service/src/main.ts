import { NestFactory } from '@nestjs/core';
import { InventoryModule } from './inventory/inventory.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(InventoryModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 3002, // Puerto diferente al Auth Service (3001)
    },
  });
  await app.listen();
  console.log('Inventory Service is running on port 3002');
}
bootstrap();