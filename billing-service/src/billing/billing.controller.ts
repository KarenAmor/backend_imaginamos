import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BillingService } from './billing.service';

@Controller()
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @MessagePattern('createInvoice')
  async createInvoice(data: { customerId: number; invoiceItems: { product_id: number; quantity: number; unit_price: number }[]; total: number }) {
    return this.billingService.createInvoice(data.customerId, data.invoiceItems, data.total);
  }

  @MessagePattern('getInvoice')
  async getInvoice(data: { id: string }) {
    return this.billingService.getInvoice(data.id);
  }

  @MessagePattern('getAllInvoices')
  async getAllInvoices() {
    return this.billingService.getAllInvoices();
  }

  @MessagePattern('updateInvoice')
  async updateInvoice(data: { id: string; customerId?: number; total?: number; status?: string; invoiceItems?: { product_id: number; quantity: number; unit_price: number }[] }) {
    return this.billingService.updateInvoice(data.id, data.customerId, data.total, data.status, data.invoiceItems);
  }

  @MessagePattern('deleteInvoice')
  async deleteInvoice(data: { id: string }) {
    return this.billingService.deleteInvoice(data.id);
  }
}