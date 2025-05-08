import { Test, TestingModule } from '@nestjs/testing';
import { RateLimiterService } from './rate-limiter.service';
import Redis from 'ioredis';

describe('RateLimiterService', () => {
  let service: RateLimiterService;
  let mockRedis: jest.Mocked<Redis>;

  beforeEach(async () => {
    mockRedis = {
      eval: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RateLimiterService,
        {
          provide: 'Redis',
          useValue: mockRedis,
        },
      ],
    }).compile();

    service = module.get<RateLimiterService>(RateLimiterService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('consume', () => {
    it('should return true when request is allowed (new bucket)', async () => {
      mockRedis.eval.mockResolvedValue(1);
      
      const result = await service.consume('test-key', 10, 1);
      expect(result).toBe(true);
      expect(mockRedis.eval).toHaveBeenCalledWith(
        expect.any(String),
        1,
        'test-key',
        10,
        1,
        expect.any(Number),
        1
      );
    });

    it('should return false when request is not allowed', async () => {
      mockRedis.eval.mockResolvedValue(0);
      
      const result = await service.consume('test-key', 10, 1);
      expect(result).toBe(false);
    });

    it('should return true when Redis throws an error', async () => {
      mockRedis.eval.mockRejectedValue(new Error('Redis error'));
      
      const result = await service.consume('test-key', 10, 1);
      expect(result).toBe(true);
    });

    it('should pass correct parameters including custom request cost', async () => {
      mockRedis.eval.mockResolvedValue(1);
      const now = Math.floor(Date.now() / 1000);
      
      jest.spyOn(Date, 'now').mockReturnValue(now * 1000);
      
      await service.consume('test-key', 20, 2, 3);
      
      expect(mockRedis.eval).toHaveBeenCalledWith(
        expect.any(String),
        1,
        'test-key',
        20,
        2,
        now,
        3
      );
    });

    it('should handle different refill rates correctly', async () => {
      mockRedis.eval.mockResolvedValue(1);
      
      await service.consume('test-key', 100, 10);
      expect(mockRedis.eval).toHaveBeenCalledWith(
        expect.any(String),
        1,
        'test-key',
        100,
        10,
        expect.any(Number),
        1
      );
    });
  });

  // You could add more tests for the Lua script logic if needed
  // This would require more detailed mocking of the Redis responses
});