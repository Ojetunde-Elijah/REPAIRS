import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RedisService } from './app.service';
import { RedisConfigModule } from './redis/redis.module';
import { RateLimiterService } from './services/rate.limiter';
import { RateLimiterGuard } from './guard/rate-limiter.guard';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule} from "./config/config.module"
import {DatabaseModule} from "./database/db.module"
import {LoggerModule} from "./logger/logger.module"
import {TypeOrmModule} from "@nestjs/typeorm"
import{AuthModule} from "./auth/auth.module"
import { PrismaModule } from '../prisma/prisma.module';
import { FireBaseModule } from './firebase/firebase.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RepairsModule } from './repair/repair.module';
@Module({
  imports: [ConfigModule,LoggerModule,FireBaseModule,PrismaModule,DatabaseModule.forRoot(),AuthModule,DashboardModule,RepairsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
