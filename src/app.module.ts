import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RedisService } from './app.service';
import { RedisConfigModule } from './redis/redis.module';
import Redis from 'ioredis';

@Module({
  imports: [RedisConfigModule],
  controllers: [AppController],
  providers: [RedisService],
})
export class AppModule {}
