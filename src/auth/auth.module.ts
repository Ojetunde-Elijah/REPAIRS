import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { SupabaseAuthGuard } from './supabase-auth.guard';
import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  controllers: [AuthController],
  providers: [UserService, PrismaService, SupabaseService, SupabaseAuthGuard],
  exports: [UserService, PrismaService, SupabaseService],
})
export class AuthModule {}