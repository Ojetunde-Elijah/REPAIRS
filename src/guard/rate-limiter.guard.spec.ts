import { Test, TestingModule } from '@nestjs/testing';
import { RateLimiterGuard } from './rate-limiter.guard';
import { RateLimiterService } from '../services/rate.limiter';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';

describe('RateLimiterGuard', () => {
  let guard: RateLimiterGuard;
  let mockRateLimiterService: jest.Mocked<RateLimiterService>;
  let mockReflector: jest.Mocked<Reflector>;
  let mockExecutionContext: jest.Mocked<ExecutionContext>;

  beforeEach(async () => {
    mockRateLimiterService = {
      consume: jest.fn(),
    } as any;

    mockReflector = {
      get: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RateLimiterGuard,
        { provide: RateLimiterService, useValue: mockRateLimiterService },
        { provide: Reflector, useValue: mockReflector },
      ],
    }).compile();

    guard = module.get<RateLimiterGuard>(RateLimiterGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createMockContext = (request: any, response: any = {}) => {
    return {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(request),
        getResponse: jest.fn().mockReturnValue(response),
      }),
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;
  };

  describe('canActivate', () => {
    it('should allow request when rate limit not exceeded', async () => {
      const mockRequest = { ip: '127.0.0.1' };
      const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockContext = createMockContext(mockRequest, mockResponse);

      mockReflector.get.mockReturnValue(undefined); // No decorator config
      mockRateLimiterService.consume.mockResolvedValue(true);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(mockRateLimiterService.consume).toHaveBeenCalledWith(
        'rate-limit:127.0.0.1',
        10, // default maxTokens
        1   // default refillRate
      );
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should reject request when rate limit exceeded', async () => {
      const mockRequest = { ip: '127.0.0.1' };
      const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockContext = createMockContext(mockRequest, mockResponse);

      mockReflector.get.mockReturnValue(undefined);
      mockRateLimiterService.consume.mockResolvedValue(false);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(false);
      expect(mockResponse.status).toHaveBeenCalledWith(429);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 429,
        message: 'Too many Requests'
      });
    });

    it('should use user ID when authenticated', async () => {
      const mockRequest = { user: { id: 'user123' }, ip: '127.0.0.1' };
      const mockContext = createMockContext(mockRequest);

      mockReflector.get.mockReturnValue(undefined);
      mockRateLimiterService.consume.mockResolvedValue(true);

      await guard.canActivate(mockContext);

      expect(mockRateLimiterService.consume).toHaveBeenCalledWith(
        'rate-limit:user123',
        10,
        1
      );
    });

    it('should use custom rate limit configuration from decorator', async () => {
      const mockRequest = { ip: '127.0.0.1' };
      const mockContext = createMockContext(mockRequest);

      mockReflector.get.mockReturnValue({ maxTokens: 20, refillRate: 5 });
      mockRateLimiterService.consume.mockResolvedValue(true);

      await guard.canActivate(mockContext);

      expect(mockRateLimiterService.consume).toHaveBeenCalledWith(
        'rate-limit:127.0.0.1',
        20,
        5
      );
    });

    it('should fall back to default values when decorator returns partial config', async () => {
      const mockRequest = { ip: '127.0.0.1' };
      const mockContext = createMockContext(mockRequest);

      mockReflector.get.mockReturnValue({ maxTokens: 15 }); // Only maxTokens provided
      mockRateLimiterService.consume.mockResolvedValue(true);

      await guard.canActivate(mockContext);

      expect(mockRateLimiterService.consume).toHaveBeenCalledWith(
        'rate-limit:127.0.0.1',
        15,
        1   // default refillRate
      );
    });

    it('should handle errors from rate limiter service gracefully', async () => {
      const mockRequest = { ip: '127.0.0.1' };
      const mockContext = createMockContext(mockRequest);

      mockReflector.get.mockReturnValue(undefined);
      mockRateLimiterService.consume.mockRejectedValue(new Error('Service error'));

      // The guard should still resolve (not throw) even if the service errors
      await expect(guard.canActivate(mockContext)).resolves.toBeDefined();
    });
  });
});