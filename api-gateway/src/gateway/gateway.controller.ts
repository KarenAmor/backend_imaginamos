import { Controller, Get, Post, Body, Put, Delete, UseGuards, HttpException, HttpStatus, Param } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api') // Ruta base para evitar conflictos
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) { }

  @Get('health')
  getHealth() {
    return { status: 'API Gateway is healthy', timestamp: new Date().toISOString() };
  }

  @Post('auth/register')
  async register(@Body() body: { email: string; password: string }) {
    try {
      return await this.gatewayService.sendToAuth('register', body);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to register user',
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('auth/login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      return await this.gatewayService.sendToAuth('login', body);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to login',
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('protected')
  @UseGuards(AuthGuard('jwt'))
  async protected() {
    return { message: 'This is a protected route' };
  }

  @Post('inventory/create')
  @UseGuards(AuthGuard('jwt'))
  async createProduct(@Body() body: { name: string; description: string; price: number; stock: number }) {
    try {
      return await this.gatewayService.sendToInventory('createProduct', body);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create product',
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('inventory/:id')
  @UseGuards(AuthGuard('jwt'))
  async getProduct(@Param('id') id: string) {
    try {
      return await this.gatewayService.sendToInventory('getProduct', { id });
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get product',
        error.statusCode || HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('inventory')
  @UseGuards(AuthGuard('jwt'))
  async getAllProducts() {
    try {
      return await this.gatewayService.sendToInventory('getAllProducts', {});
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve products',
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('inventory/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateProduct(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string; price?: number; stock?: number },
  ) {
    try {
      return await this.gatewayService.sendToInventory('updateProduct', { id, ...body });
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update product',
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('inventory/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteProduct(@Param('id') id: string) {
    try {
      return await this.gatewayService.sendToInventory('deleteProduct', { id });
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete product',
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('suppliers/create')
  @UseGuards(AuthGuard('jwt'))
  async createSupplier(
    @Body() body: { name: string; contactName?: string; email: string; phone?: string },
  ) {
    try {
      return await this.gatewayService.sendToSuppliers('createSupplier', body);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create supplier',
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('suppliers/:id')
  @UseGuards(AuthGuard('jwt'))
  async getSupplier(@Param('id') id: string) {
    try {
      return await this.gatewayService.sendToSuppliers('getSupplier', { id });
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get supplier',
        error.statusCode || HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('suppliers')
  @UseGuards(AuthGuard('jwt'))
  async getAllSuppliers() {
    try {
      return await this.gatewayService.sendToSuppliers('getAllSuppliers', {});
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve suppliers',
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('suppliers/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateSupplier(
    @Param('id') id: string,
    @Body() body: { name?: string; contactName?: string; email?: string; phone?: string },
  ) {
    try {
      return await this.gatewayService.sendToSuppliers('updateSupplier', { id, ...body });
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update supplier',
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('suppliers/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteSupplier(@Param('id') id: string) {
    try {
      return await this.gatewayService.sendToSuppliers('deleteSupplier', { id });
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete supplier',
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('billing/invoices')
  @UseGuards(AuthGuard('jwt'))
  async createInvoice(@Body() body: { customerId: number; invoiceItems: { product_id: number; quantity: number; unit_price: number }[]; total: number }) {
    try {
      return await this.gatewayService.sendToBilling('createInvoice', body);
    } catch (error) {
      throw new HttpException(error.message || 'Failed to create invoice', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('billing/invoices/:id')
  @UseGuards(AuthGuard('jwt'))
  async getInvoice(@Param('id') id: string) {
    try {
      return await this.gatewayService.sendToBilling('getInvoice', { id });
    } catch (error) {
      throw new HttpException(error.message || 'Invoice not found', HttpStatus.NOT_FOUND);
    }
  }

  @Get('billing/invoices')
  @UseGuards(AuthGuard('jwt'))
  async getAllInvoices() {
    try {
      return await this.gatewayService.sendToBilling('getAllInvoices', {});
    } catch (error) {
      throw new HttpException(error.message || 'Failed to retrieve invoices', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('billing/invoices/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateInvoice(@Param('id') id: string, @Body() body: { customerId?: number; total?: number; status?: string; invoiceItems?: { product_id: number; quantity: number; unit_price: number }[] }) {
    try {
      return await this.gatewayService.sendToBilling('updateInvoice', { id, ...body });
    } catch (error) {
      throw new HttpException(error.message || 'Failed to update invoice', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('billing/invoices/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteInvoice(@Param('id') id: string) {
    try {
      return await this.gatewayService.sendToBilling('deleteInvoice', { id });
    } catch (error) {
      throw new HttpException(error.message || 'Failed to delete invoice', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('customers/create')
  @UseGuards(AuthGuard('jwt'))
  async createCustomer(@Body() body: { name: string; email?: string; phone?: string; address?: string }) {
    try {
      return await this.gatewayService.sendToCustomers('createCustomer', body);
    } catch (error) {
      throw new HttpException(error.message || 'Failed to create customer', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('customers/:id')
  @UseGuards(AuthGuard('jwt'))
  async getCustomer(@Param('id') id: string) {
    try {
      return await this.gatewayService.sendToCustomers('getCustomer', { id });
    } catch (error) {
      throw new HttpException(error.message || 'Customer not found', HttpStatus.NOT_FOUND);
    }
  }

  @Get('customers')
  @UseGuards(AuthGuard('jwt'))
  async getAllCustomers() {
    try {
      return await this.gatewayService.sendToCustomers('getAllCustomers', {});
    } catch (error) {
      throw new HttpException(error.message || 'Failed to retrieve customers', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('customers/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateCustomer(@Param('id') id: string, @Body() body: { name?: string; email?: string; phone?: string; address?: string }) {
    try {
      return await this.gatewayService.sendToCustomers('updateCustomer', { id, ...body });
    } catch (error) {
      throw new HttpException(error.message || 'Failed to update customer', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('customers/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteCustomer(@Param('id') id: string) {
    try {
      return await this.gatewayService.sendToCustomers('deleteCustomer', { id });
    } catch (error) {
      throw new HttpException(error.message || 'Failed to delete customer', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}