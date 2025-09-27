import { NestFactory } from '@nestjs/core';
import { SuppliersModule } from './suppliers/suppliers.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(SuppliersModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 3003, // Puerto diferente al de Inventory (3002)
    },
  });
  await app.listen();
  console.log('Suppliers Service is running on port 3003');
}
bootstrap();