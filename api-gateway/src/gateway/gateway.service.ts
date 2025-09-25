import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class GatewayService implements OnModuleInit {
  constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) {}

  async onModuleInit() {
    // Opcional: Prueba la conexión al iniciar el módulo
    console.log('GatewayService initialized, ready to connect to Auth Service');
  }

  async sendToAuth(pattern: string, data: any) {
    try {
      const response = await this.client.send(pattern, data).toPromise();
      return response;
    } catch (error) {
      console.error(`Error sending to Auth Service: ${error.message}`);
      throw new Error(`Failed to communicate with Auth Service: ${error.message}`);
    }
  }
}