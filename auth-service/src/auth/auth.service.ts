import { Injectable, BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

// Carga las variables de entorno al inicio
dotenv.config();

// Valida que las variables estén definidas
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_KEY in .env file');
}

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(email: string, password: string) {
    // Validación de contraseña
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new RpcException({
        statusCode: 400,
        message: 'Password must be at least 8 characters long and contain letters, numbers, and symbols (@$!%*?&).',
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const { data, error } = await supabase.from('users').insert({
      email: email,
      password_hash: hash,
      role: 'user',
      service_id: 'auth_service',
    }).select();
  if (error) {
      console.error('Supabase error during register:', error.message);
      if (error.code === '23505') { // Duplicado
        throw new BadRequestException('Email already registered');
      }
      throw new BadRequestException(error.message); // Otros errores como 400 para consistencia
    }

    // Solo se ejecuta si no hay error
    const token = this.jwtService.sign({ sub: data[0].id, email });
    console.log('Registration successful, token generated');
    return { access_token: token };
  }

  async login(email: string, password: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
  if (error || !data) {
      console.error('Supabase error during login:', error?.message || 'No user found');
      throw new BadRequestException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, data.password_hash);
    if (!isMatch) {
      console.error('Password mismatch');
      throw new BadRequestException('Invalid credentials');
    }
    const token = this.jwtService.sign({ sub: data.id, email });
    return { access_token: token };
  }
}