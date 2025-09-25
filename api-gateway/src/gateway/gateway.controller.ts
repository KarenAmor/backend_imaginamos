import { Controller, Get, Post, Body, Put, Delete, UseGuards, HttpException, HttpStatus, Param } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api') // Ruta base para evitar conflictos
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

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
}