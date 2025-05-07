import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async testRedis() {
    await this.redis.set('test_key', 'test_value');
    const value = await this.redis.get('test_key');
    console.log('Redis Test Value:', value);
    return value;
  }
}