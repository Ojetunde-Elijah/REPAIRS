import { ConfigService } from './config.service';
import { DEFAULT_CONFIG } from './config.default';
import { ConfigData } from './config.interface';

describe('ConfigService', () => {
  let service: ConfigService;

  // Save original process.env
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset process.env before each test
    process.env = { ...originalEnv };
    service = new ConfigService();
  });

  afterAll(() => {
    // Restore original process.env after all tests
    process.env = originalEnv;
  });

  describe('constructor', () => {
    it('should use default config when no data provided', () => {
      expect(service.getConfig()).toEqual(DEFAULT_CONFIG);
    });

    it('should use provided config data', () => {
      const customConfig: ConfigData = {
        ...DEFAULT_CONFIG,
        port: 3001,
        logLevel: 'debug'
      };
      const customService = new ConfigService(customConfig);
      expect(customService.getConfig()).toEqual(customConfig);
    });
  });

  describe('loadingUsingDotEnv', () => {
    it('should load config from process.env', () => {
      process.env = {
        NODE_ENV: 'test',
        PORT: '3001',
        LOG_LEVEL: 'debug',
        REDIS_URI: 'redis://test',
        REDIS_TOKEN: 'test-token',
        FIREBASE_PRIVATE_KEY: 'test\\nkey',
        FIREBASE_CLIENT_EMAIL: 'test@example.com',
        FIREBASE_PROJECT_ID: 'test-project'
      };

      service.loadingUsingDotEnv();

      expect(service.getConfig()).toEqual({
        env: 'test',
        port: 3001,
        mongo: undefined,
        logLevel: 'debug',
        redisUri: 'redis://test',
        redisToken: 'test-token',
        FirebasePrivateKey: 'test\nkey',
        FirebaseClientEmail: 'test@example.com',
        FirebaseProjectId: 'test-project'
      });
    });

    it('should use defaults when env vars are missing', () => {
      process.env = {};
      service.loadingUsingDotEnv();

      expect(service.getConfig()).toEqual(DEFAULT_CONFIG);
    });

    it('should handle invalid PORT number', () => {
      process.env = { PORT: 'invalid' };
      service.loadingUsingDotEnv();

      expect(service.getConfig().port).toBe(DEFAULT_CONFIG.port);
    });

    it('should properly replace newline escapes in Firebase private key', () => {
      process.env = {
        FIREBASE_PRIVATE_KEY: 'line1\\nline2\\nline3'
      };
      service.loadingUsingDotEnv();

      expect(service.getConfig().FirebasePrivateKey).toBe('line1\nline2\nline3');
    });
  });

  describe('getConfig', () => {
    it('should return current config', () => {
      const currentConfig = service.getConfig();
      expect(currentConfig).toEqual(DEFAULT_CONFIG);
    });

    it('should return modified config after changes', () => {
      const customConfig: ConfigData = {
        ...DEFAULT_CONFIG,
        port: 3001
      };
      const customService = new ConfigService(customConfig);
      expect(customService.getConfig()).toEqual(customConfig);
    });
  });

  describe('parseConfigFromEnv', () => {
    it('should parse valid environment variables', () => {
      const env = {
        NODE_ENV: 'production',
        PORT: '8080',
        LOG_LEVEL: 'warn',
        REDIS_URI: 'redis://prod',
        REDIS_TOKEN: 'prod-token',
        FIREBASE_PRIVATE_KEY: 'prod\\nkey',
        FIREBASE_CLIENT_EMAIL: 'prod@example.com',
        FIREBASE_PROJECT_ID: 'prod-project'
      };

      const result = service['parseConfigFromEnv'](env);

      expect(result).toEqual({
        env: 'production',
        port: 8080,
        mongo: undefined,
        logLevel: 'warn',
        redisUri: 'redis://prod',
        redisToken: 'prod-token',
        FirebasePrivateKey: 'prod\nkey',
        FirebaseClientEmail: 'prod@example.com',
        FirebaseProjectId: 'prod-project'
      });
    });

    it('should handle missing environment variables', () => {
      const result = service['parseConfigFromEnv']({});
      expect(result).toEqual(DEFAULT_CONFIG);
    });
  });
});