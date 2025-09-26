import { Test, TestingModule } from '@nestjs/testing';
import { BillingService } from './billing.service';
import { ClientProxy } from '@nestjs/microservices';

// Mock de supabase
const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn(),
};

// Mock de inventoryClient
const mockInventoryClient = {
  send: jest.fn(() => ({
    toPromise: jest.fn().mockResolvedValue(true),
  })),
};

describe('BillingService', () => {
  let service: BillingService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingService,
        {
          provide: 'INVENTORY_SERVICE',
          useValue: mockInventoryClient,
        },
      ],
    }).compile();

    service = module.get<BillingService>(BillingService);

    // Inyectamos mock supabase en global
    (global as any).supabase = mockSupabase;
  });

  describe('getInvoice', () => {
    it('should return not found if missing', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: 'not found',
      });

      const result = await service.getInvoice('99');
      expect(result).toEqual({ success: false, message: 'Invoice with id 99 not found' });
    });
  });
});
