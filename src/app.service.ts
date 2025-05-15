import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import {Logger} from './logger/logger';
@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis, private readonly logger: Logger) {}


  async testRedis() {
    this.logger.debug('Testing Redis connection...');
    // Set a test key-value pair in Redis
    await this.redis.set('test_key', 'test_value');
    this.logger.debug('Test key set in Redis.');
    const value = await this.redis.get('test_key');
    this.logger.log(`Retrieved test value from Redis: ${value}`);
    return value;
  }
}