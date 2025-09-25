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
        options: {
          host: 'localhost',
          port: 3002,
          timeout: 5000, // 5 segundos de timeout
        },
      }
    ]),
    PassportModule,
  ],
  controllers: [GatewayController],
  providers: [GatewayService, JwtStrategy],
})
export class GatewayModule { }