import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3001 },
      },
      {
        name: 'INVENTORY_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3002 },
      },
      {
        name: 'SUPPLIERS_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3003 },
      },
      { name: 'BILLING_SERVICE', 
        transport: Transport.TCP, 
        options: { host: 'localhost', port: 3004 } 
      },
      { name: 'CUSTOMERS_SERVICE', 
        transport: Transport.TCP, 
        options: { host: 'localhost', port: 3005 } 
      },
    ]),
    PassportModule,
  ],
  controllers: [GatewayController],
  providers: [GatewayService, JwtStrategy],
})
export class GatewayModule { }