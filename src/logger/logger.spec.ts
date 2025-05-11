import { Logger } from './logger';
import { ConfigService } from '../config/config.service';
import * as winston from 'winston';
import * as moment from 'moment';
import { Loglevel } from './loglevel';

describe('Logger', () => {
  let logger: Logger;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockWinstonLogger: jest.Mocked<winston.Logger>;

  beforeEach(() => {
    // Mock the ConfigService
    mockConfigService = {
      getConfig: jest.fn().mockReturnValue({
        logLevel: Loglevel.Info
      })
    } as unknown as jest.Mocked<ConfigService>;

    // Mock the Winston logger
    mockWinstonLogger = {
      log: jest.fn(),
      add: jest.fn()
    } as unknown as jest.Mocked<winston.Logger>;

    // Mock winston.createLogger
    jest.spyOn(winston, 'createLogger').mockReturnValue(mockWinstonLogger);

    // Create the logger instance
    logger = new Logger(mockConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('initialization', () => {
    it('should create a winston logger with correct configuration', () => {
      expect(winston.createLogger).toHaveBeenCalledWith({
        level: Loglevel.Info,
        format: expect.anything() // We'll test the formatter separately
      });

      expect(mockWinstonLogger.add).toHaveBeenCalledWith({
        format: expect.anything(),
        stderrLevels: [Loglevel.Error, Loglevel.Warn]
      });
    });

    it('should use config service to get log level', () => {
      expect(mockConfigService.getConfig).toHaveBeenCalled();
    });
  });

  describe('log method', () => {
    it('should call winston logger with level and message (overload with level)', () => {
      logger.log(Loglevel.Debug, 'test message');
      expect(mockWinstonLogger.log).toHaveBeenCalledWith(
        Loglevel.Debug,
        'test message'
      );
    });

    it('should call winston logger with default level (overload without level)', () => {
      logger.log('test message');
      expect(mockWinstonLogger.log).toHaveBeenCalledWith(
        Loglevel.Info,
        'test message'
      );
    });

    it('should handle both string and Loglevel inputs correctly', () => {
      // Test with Loglevel and message
      logger.log(Loglevel.Warn, 'warning message');
      expect(mockWinstonLogger.log).toHaveBeenCalledWith(
        Loglevel.Warn,
        'warning message'
      );

      // Test with just message (should default to Info)
      logger.log('info message');
      expect(mockWinstonLogger.log).toHaveBeenCalledWith(
        Loglevel.Info,
        'info message'
      );
    });
  });

  describe('convenience methods', () => {
    it('error() should log with Error level', () => {
      logger.error('error message');
      expect(mockWinstonLogger.log).toHaveBeenCalledWith(
        Loglevel.Error,
        'error message'
      );
    });

    it('warn() should log with Warn level', () => {
      logger.warn('warn message');
      expect(mockWinstonLogger.log).toHaveBeenCalledWith(
        Loglevel.Warn,
        'warn message'
      );
    });

    it('info() should log with Info level', () => {
      logger.info('info message');
      expect(mockWinstonLogger.log).toHaveBeenCalledWith(
        Loglevel.Info,
        'info message'
      );
    });

    it('debug() should log with Debug level', () => {
      logger.debug('debug message');
      expect(mockWinstonLogger.log).toHaveBeenCalledWith(
        Loglevel.Debug,
        'debug message'
      );
    });

    it('verbose() should log with Verbose level', () => {
      logger.verbose('verbose message');
      expect(mockWinstonLogger.log).toHaveBeenCalledWith(
        Loglevel.Verbose,
        'verbose message'
      );
    });

    it('silly() should log with Silly level', () => {
      logger.silly('silly message');
      expect(mockWinstonLogger.log).toHaveBeenCalledWith(
        Loglevel.Silly,
        'silly message'
      );
    });

    it('http() should log with Http level', () => {
      logger.http('http message');
      expect(mockWinstonLogger.log).toHaveBeenCalledWith(
        Loglevel.Http,
        'http message'
      );
    });
  });

  describe('formatter', () => {
    it('should format non-HTTP messages with timestamp and level', () => {
      // Get the formatter function that was passed to winston.createLogger
      const createLoggerCall = (winston.createLogger as jest.Mock).mock.calls[0][0];
      const formatFunction = createLoggerCall.format.transform;

      const testInfo = {
        level: Loglevel.Info,
        message: 'test message'
      };

      const result = formatFunction(testInfo);
      
      expect(result.message).toContain('[Info] test message');
      expect(result.message).toMatch(/\[\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4}\]/);
    });

    it('should not modify HTTP level messages', () => {
      const createLoggerCall = (winston.createLogger as jest.Mock).mock.calls[0][0];
      const formatFunction = createLoggerCall.format.transform;

      const testInfo = {
        level: Loglevel.Http,
        message: 'http message'
      };

      const result = formatFunction(testInfo);
      expect(result.message).toBe('http message');
    });
  });

  describe('passthrough formatter', () => {
    it('should set MESSAGE property equal to message', () => {
      // Get the passthrough formatter function that was added to the console transport
      const addCall = (mockWinstonLogger.add as jest.Mock).mock.calls[0][0];
      const formatFunction = addCall.format.transform;

      const testInfo = {
        message: 'test message'
      };

      const result = formatFunction(testInfo);
      expect(result[MESSAGE]).toBe('test message');
    });
  });
});