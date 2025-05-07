import { Controller, Get } from '@nestjs/common';
import { RedisService } from './app.service';

@Controller('redis')
export class AppController {
  constructor(private readonly redisService: RedisService) {}

  @Get('test')
  async testRedis() {
    const value = await this.redisService.testRedis();
    return { message: 'Redis Test Successful', value };
  }
}