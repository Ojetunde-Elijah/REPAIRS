import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { SupabaseAuthGuard } from './supabase-auth.guard';
import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { SUPABASE_CLIENT } from '../supabase/supabase.module';
@Module({
  imports: [SupabaseModule],
  controllers: [AuthController],
  providers: [UserService, PrismaService, SupabaseAuthGuard],
  exports: [UserService, PrismaService],
})
export class AuthModule {}