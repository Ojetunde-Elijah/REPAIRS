import {Module} from '@nestjs/common';
import { AuthController } from './auth.controller';
import {UserService} from "../user/user.service";
import {PrismaService} from "../../prisma/prisma.service";
import{SupabaseService} from "../supabase/supabase.service";
import {SupabaseModule} from "../supabase/supabase.module";
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
@Module({
    imports:[SupabaseModule, JwtModule.register({
        secret: process.env.JWT_SECRET || 'supersecret',
        signOptions: { expiresIn: '1d' },
    })],
    controllers:[ AuthController],
    providers: [UserService, PrismaService, SupabaseService, JwtStrategy],
    exports: [UserService, PrismaService, SupabaseService, JwtModule]
})
export class AuthModule {}