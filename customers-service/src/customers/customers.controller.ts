import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CustomersService } from './customers.service';

@Controller()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @MessagePattern('createCustomer')
  async createCustomer(data: { name: string; email?: string; phone?: string; address?: string }) {
    return this.customersService.createCustomer(data.name, data.email, data.phone, data.address);
  }

  @MessagePattern('getCustomer')
  async getCustomer(data: { id: string }) {
    return this.customersService.getCustomer(data.id);
  }

  @MessagePattern('getAllCustomers')
  async getAllCustomers() {
    return this.customersService.getAllCustomers();
  }

  @MessagePattern('updateCustomer')
  async updateCustomer(data: { id: string; name?: string; email?: string; phone?: string; address?: string }) {
    return this.customersService.updateCustomer(data.id, data.name, data.email, data.phone, data.address);
  }

  @MessagePattern('deleteCustomer')
  async deleteCustomer(data: { id: string }) {
    return this.customersService.deleteCustomer(data.id);
  }
}