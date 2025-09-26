import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: { host: 'auth-service', port: 3001 },
      },
      {
        name: 'INVENTORY_SERVICE',
        transport: Transport.TCP,
        options: { host: 'inventory-service', port: 3002 },
      },
      {
        name: 'SUPPLIERS_SERVICE',
        transport: Transport.TCP,
        options: { host: 'suppliers-service', port: 3003,  retryAttempts: 5, retryDelay: 3000, },
      },
      {
        name: 'BILLING_SERVICE',
        transport: Transport.TCP,
        options: { host: 'billing-service', port: 3004 },
      },
      {
        name: 'CUSTOMERS_SERVICE',
        transport: Transport.TCP,
        options: { host: 'customers-service', port: 3005 },
      },
    ]),
    PassportModule,
  ],
  controllers: [GatewayController],
  providers: [GatewayService, JwtStrategy],
})
export class GatewayModule {}