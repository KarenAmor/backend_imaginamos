import { Inject, Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class GatewayService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    @Inject('INVENTORY_SERVICE') private inventoryClient: ClientProxy,
    @Inject('SUPPLIERS_SERVICE') private suppliersClient: ClientProxy,
    @Inject('BILLING_SERVICE') private billingClient: ClientProxy,
    @Inject('CUSTOMERS_SERVICE') private customersClient: ClientProxy,
  ) { }

  async onModuleInit() {
    try {
      await this.connectClients();
      console.log('GatewayService initialized, connected to Auth Service, Inventory Service, Suppliers Service, and Billing Service');
    } catch (error) {
      console.error(`Failed to connect to microservices: ${error.message}`);
      throw new RpcException(`Gateway initialization failed: ${error.message}`);
    }
  }

  async onModuleDestroy() {
    await this.authClient.close();
    await this.inventoryClient.close();
    await this.suppliersClient.close();
    await this.billingClient.close();
    console.log('GatewayService connections closed');
  }

  private async connectClients() {
    const connectPromises = [
      this.authClient.connect(),
      this.inventoryClient.connect(),
      this.suppliersClient.connect(),
      this.billingClient.connect(),
    ];
    await Promise.all(connectPromises);
  }

  private async reconnectClient(client: ClientProxy) {
    try {
      await client.connect();
      console.log('Reconnected to microservice');
    } catch (error) {
      console.error(`Reconnection failed: ${error.message}`);
      // Intentar reconectar después de un retraso (e.g., 5 segundos)
      setTimeout(() => this.reconnectClient(client), 5000);
    }
  }

  async sendToAuth(pattern: string, data: any) {
    try {
      const response = await this.authClient.send(pattern, data).toPromise();
      console.log(`Successfully sent to Auth Service: ${pattern}`);
      return response;
    } catch (error) {
      console.error(`Error sending to Auth Service: ${error.message}`);
      if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
        await this.reconnectClient(this.authClient);
      }
      throw new RpcException({
        statusCode: 503, // Service Unavailable
        message: `Failed to communicate with Auth Service: ${error.message}`,
      });
    }
  }

  async sendToInventory(pattern: string, data: any) {
    try {
      const response = await this.inventoryClient.send(pattern, data).toPromise();
      console.log(`Successfully sent to Inventory Service: ${pattern}`);
      return response;
    } catch (error) {
      console.error(`Error sending to Inventory Service: ${error.message}`);
      if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
        await this.reconnectClient(this.inventoryClient);
      }
      throw new RpcException({
        statusCode: 503, // Service Unavailable
        message: `Failed to communicate with Inventory Service: ${error.message}`,
      });
    }
  }

  async sendToSuppliers(pattern: string, data: any) {
    try {
      const response = await this.suppliersClient.send(pattern, data).toPromise();
      console.log(`Successfully sent to Suppliers Service: ${pattern}`);
      return response;
    } catch (error) {
      console.error(`Error sending to Suppliers Service: ${error.message}`);
      if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
        await this.reconnectClient(this.suppliersClient);
      }
      throw new RpcException({
        statusCode: 503,
        message: `Failed to communicate with Suppliers Service: ${error.message}`,
      });
    }
  }

  async sendToBilling(pattern: string, data: any) {
    try {
      const response = await this.billingClient.send(pattern, data).toPromise();
      console.log(`Successfully sent to Billing Service: ${pattern}`);
      return response;
    } catch (error) {
      console.error(`Error sending to Billing Service: ${error.message}`);
      if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
        await this.reconnectClient(this.billingClient);
      }
      throw new RpcException({
        statusCode: 503, // Service Unavailable
        message: `Failed to communicate with Billing Service: ${error.message}`,
      });
    }
  }
  async sendToCustomers(pattern: string, data: any) {
    try {
      const response = await this.customersClient.send(pattern, data).toPromise();
      console.log(`Successfully sent to Customers Service: ${pattern}`);
      return response;
    } catch (error) {
      console.error(`Error sending to Customers Service: ${error.message}`);
      if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
        await this.reconnectClient(this.customersClient);
      }
      throw new RpcException({
        statusCode: 503,
        message: `Failed to communicate with Customers Service: ${error.message}`,
      });
    }
  }
}