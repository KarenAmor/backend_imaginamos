import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('register')
  async register(data: { email: string; password: string }) {
    console.log('Received register request:', data);
    try {
      return await this.authService.register(data.email, data.password);
    } catch (error) {
      console.error('Error in register handler:', error.message);
      throw error; 
    }
  }

  @MessagePattern('login')
  async login(data: { email: string; password: string }) {
    try {
      return await this.authService.login(data.email, data.password);
    } catch (error) {
      console.error('Error in login handler:', error.message);
      throw error;
    }
  }
}