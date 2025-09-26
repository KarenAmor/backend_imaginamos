import { NestFactory } from '@nestjs/core';
import { CustomersModule } from './customers/customers.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(CustomersModule, {
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3005,
    },
  });
  await app.listen();
  console.log('Customers Service is running on port 3005');
}
bootstrap();