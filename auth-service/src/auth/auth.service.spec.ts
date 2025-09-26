import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock de supabase
const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn(),
};

// Mock de bcrypt
jest.mock('bcrypt', () => ({
  genSalt: jest.fn(() => 'salt'),
  hash: jest.fn(() => 'hashedPassword'),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('fake-jwt-token') },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);

    // Sobrescribir supabase en el servicio
    (global as any).supabase = mockSupabase;
  });

  describe('register', () => {
    it('should throw BadRequestException if email already exists', async () => {
      mockSupabase.insert.mockReturnValueOnce({
        data: null,
        error: { code: '23505', message: 'duplicate key' },
      });

      await expect(
        service.register('duplicate@example.com', 'Valid@123'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if password does not meet policy', async () => {
      await expect(
        service.register('test@example.com', 'weakpass'),
      ).rejects.toThrow();
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: { id: '123', email: 'test@example.com', password_hash: 'hashedPassword' },
        error: null,
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login('test@example.com', 'Valid@123');

      expect(result).toEqual({ access_token: 'fake-jwt-token' });
    });

    it('should throw if user not found', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: null, error: 'not found' });

      await expect(
        service.login('nouser@example.com', 'Valid@123'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if password is invalid', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: { id: '123', email: 'test@example.com', password_hash: 'hashedPassword' },
        error: null,
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login('test@example.com', 'wrongpass'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
