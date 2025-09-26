import { Test, TestingModule } from '@nestjs/testing';
import { GatewayService } from './gateway.service';
import { ClientProxy } from '@nestjs/microservices';

describe('GatewayService', () => {
  let service: GatewayService;

  // Mock básico de ClientProxy
  const mockClientProxy = {
    connect: jest.fn(),
    close: jest.fn(),
    send: jest.fn().mockReturnValue({ toPromise: () => Promise.resolve('ok') }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GatewayService,
        { provide: 'AUTH_SERVICE', useValue: mockClientProxy },
        { provide: 'INVENTORY_SERVICE', useValue: mockClientProxy },
        { provide: 'SUPPLIERS_SERVICE', useValue: mockClientProxy },
        { provide: 'BILLING_SERVICE', useValue: mockClientProxy },
        { provide: 'CUSTOMERS_SERVICE', useValue: mockClientProxy },
      ],
    }).compile();

    service = module.get<GatewayService>(GatewayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
