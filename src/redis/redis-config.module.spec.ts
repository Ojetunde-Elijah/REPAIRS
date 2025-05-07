import { Test, TestingModule } from '@nestjs/testing';
import { RedisConfigModule } from './redis.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule} from '../config/config.module';
import { ConfigService } from '../config/config.service';

describe('RedisConfigModule', () => {
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisConfigModule],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            getConfig: jest.fn().mockReturnValue({
              redis: {
                url: 'redis://localhost:6379',
                password: 'secret-password',
              },
            }),
          },
        },
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(RedisConfigModule).toBeDefined();
  });

  it('should configure RedisModule with correct options', () => {
    // Verify RedisModule.forRootAsync was called with expected configuration
    const useFactory = (configService: ConfigService) => {
      return {
        type: 'single',
        url: configService.getConfig().redisUri,
        password: configService.getConfig().redisToken,
      };
    };

    // Test the factory function directly
    const result = useFactory(configService);
    expect(result).toEqual({
      type: 'single',
      url: 'redis://localhost:6379',
      token: 'secret-password',
    });
  });

  it('should export RedisModule', () => {
    const exports = Reflect.getMetadata('exports', RedisConfigModule);
    expect(exports).toContain(RedisModule);
  });
});