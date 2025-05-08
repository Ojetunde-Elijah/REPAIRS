import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseAuthService } from './firebase-auth.service';
import { UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Logger } from 'src/logger/logger';

// Mock the firebase-admin module
jest.mock('firebase-admin', () => ({
  auth: jest.fn(() => ({
    verifyIdToken: jest.fn(),
  })),
}));

// Mock the Logger
const mockLogger = {
  error: jest.fn(),
  info: jest.fn(),
};

describe('FirebaseAuthService', () => {
  let service: FirebaseAuthService;
  let auth: jest.Mocked<admin.auth.Auth>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FirebaseAuthService,
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<FirebaseAuthService>(FirebaseAuthService);
    auth = admin.auth() as jest.Mocked<admin.auth.Auth>;
    jest.clearAllMocks();
  });

  describe('getToken', () => {
    it('should extract token from Bearer string', () => {
      const result = service['getToken']('Bearer abc123');
      expect(result).toBe('abc123');
    });

    it('should throw UnauthorizedException for invalid token format', () => {
      expect(() => service['getToken']('InvalidToken')).toThrow(UnauthorizedException);
      expect(mockLogger.error).toHaveBeenCalledWith('Invalid token format');
    });

    it('should throw UnauthorizedException for empty string', () => {
      expect(() => service['getToken']('')).toThrow(UnauthorizedException);
    });
  });

  describe('authenticate', () => {
    const validToken = 'Bearer valid-token';
    const extractedToken = 'valid-token';
    const mockDecodedToken = {
      email: 'test@example.com',
      uid: '12345',
      role: 'user',
      otherProps: 'should-be-ignored',
    };

    it('should successfully authenticate with valid token', async () => {
      auth.verifyIdToken.mockResolvedValue(mockDecodedToken);

      const result = await service.authenticate(validToken);
      
      expect(result).toEqual({
        email: 'test@example.com',
        uid: '12345',
        role: 'user',
      });
      expect(auth.verifyIdToken).toHaveBeenCalledWith(extractedToken);
      expect(mockLogger.info).toHaveBeenCalledWith(JSON.stringify(mockDecodedToken));
    });

    it('should throw UnauthorizedException when Firebase auth fails', async () => {
      const error = new Error('Firebase error');
      auth.verifyIdToken.mockRejectedValue(error);

      await expect(service.authenticate(validToken))
        .rejects
        .toThrow(UnauthorizedException);
      
      expect(mockLogger.error).toHaveBeenCalledWith(
        `error while authenticating user ${error}`
      );
    });

    it('should throw UnauthorizedException for invalid token format', async () => {
      await expect(service.authenticate('invalid-token-format'))
        .rejects
        .toThrow(UnauthorizedException);
      
      expect(auth.verifyIdToken).not.toHaveBeenCalled();
    });

    it('should handle missing optional fields in decoded token', async () => {
      const minimalToken = {
        email: 'minimal@example.com',
        uid: '67890',
        // role is missing
      };
      auth.verifyIdToken.mockResolvedValue(minimalToken as any);

      const result = await service.authenticate(validToken);
      
      expect(result).toEqual({
        email: 'minimal@example.com',
        uid: '67890',
        role: undefined, // or whatever default you want
      });
    });
  });
});