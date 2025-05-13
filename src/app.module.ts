import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RedisService } from './app.service';
import { RedisConfigModule } from './redis/redis.module';
import { RateLimiterService } from './services/rate.limiter';
import { RateLimiterGuard } from './guard/rate-limiter.guard';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule} from "src/config/config.module"
import {DatabaseModule} from "src/database/db.module"
import {LoggerModule} from "./logger/logger.module"
import {TypeOrmModule} from "@nestjs/typeorm"
import { DatabaseCredentials } from './mySql/mySql.service';
@Module({
  imports: [ConfigModule,LoggerModule,TypeOrmModule.forRoot(DatabaseCredentials),RedisConfigModule],
  controllers: [AppController],
  providers: [RedisService],
})
export class AppModule {}
