import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InventoryService } from './inventory.service';

@Controller()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @MessagePattern('getAllProducts')
  async getAllProducts() {
    return this.inventoryService.getAllProducts();
  }
  
  @MessagePattern('createProduct')
  async create(data: { name: string; description: string; price: number; stock: number }) {
    return this.inventoryService.createProduct(data.name, data.description, data.price, data.stock);
  }

  @MessagePattern('getProduct')
  async get(data: { id: string }) {
    return this.inventoryService.getProduct(data.id);
  }

  @MessagePattern('updateProduct')
  async update(data: { id: string; name?: string; description?: string; price?: number; stock?: number }) {
    return this.inventoryService.updateProduct(data.id, data.name, data.description, data.price, data.stock);
  }

  @MessagePattern('deleteProduct')
  async delete(data: { id: string }) {
    return this.inventoryService.deleteProduct(data.id);
  }

   //Nuevo handler para recibir los mensajes de BillingService
  @MessagePattern('updateStock')
async updateStock(data: { action: 'add' | 'subtract'; products: { id: number; quantity: number }[] }) {
  console.log('Stock update received:', data);

  for (const product of data.products) {
    const delta = data.action === 'subtract' ? -product.quantity : product.quantity;
    await this.inventoryService.adjustStock(product.id.toString(), delta);
  }

  return { success: true, action: data.action };
}

}

