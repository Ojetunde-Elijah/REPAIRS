import {Module} from '@nestjs/common';
import { AuthController } from './auth.controller';
import {UserService} from "../user/user.service";
import {PrismaService} from "../../prisma/prisma.service";
import{SupabaseService} from "../supabase/supabase.service";
import {SupabaseModule} from "../supabase/supabase.module";
@Module({
    imports:[SupabaseModule],
    controllers:[ AuthController],
    providers: [UserService, PrismaService, SupabaseService],
    exports: [UserService, PrismaService, SupabaseService]
})
export class AuthModule {}