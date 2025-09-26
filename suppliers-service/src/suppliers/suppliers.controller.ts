import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SuppliersService } from './suppliers.service';

@Controller()
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

 @MessagePattern('createSupplier')
async createSupplier(data: { name: string; contactEmail?: string; contactName?: string; contactPhone?: string }) {
  return this.suppliersService.createSupplier(data.name, data.contactEmail, data.contactName, data.contactPhone);
}

  @MessagePattern('getSupplier')
  async getSupplier(data: { id: string }) {
    return this.suppliersService.getSupplier(data.id);
  }

  @MessagePattern('getAllSuppliers')
  async getAllSuppliers() {
    return this.suppliersService.getAllSuppliers();
  }

  @MessagePattern('updateSupplier')
async updateSupplier(data: { id: string; name?: string; contactName?: string; contactEmail?: string; contactPhone?: string }) {
  return this.suppliersService.updateSupplier(data.id, data.name, data.contactName, data.contactEmail, data.contactPhone);
}

  @MessagePattern('deleteSupplier')
  async deleteSupplier(data: { id: string }) {
    return this.suppliersService.deleteSupplier(data.id);
  }
}