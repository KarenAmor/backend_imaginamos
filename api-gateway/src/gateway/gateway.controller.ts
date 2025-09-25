import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get('health')
  getHealth() {
    return { status: 'API Gateway is healthy', timestamp: new Date().toISOString() };
  }

  @Post('auth/register')
  async register(@Body() body: { email: string; password: string }) {
    return this.gatewayService.sendToAuth('register', body);
  }

  @Post('auth/login')
  async login(@Body() body: { email: string; password: string }) {
    return this.gatewayService.sendToAuth('login', body);
  }

  @Get('protected')
  @UseGuards(AuthGuard('jwt'))
  async protected() {
    return { message: 'This is a protected route' };
  }
}