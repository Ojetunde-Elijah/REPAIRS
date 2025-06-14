import {Module} from "@nestjs/common";

import { ConfigModule } from "../config/config.module";
import { ConfigService } from "../config/config.service";

import {createClient} from "@supabase/supabase-js";
import { SupabaseService } from "./supabase.service";

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: "SUPABASE_CLIENT",
            useFactory: (config: ConfigService)=> createClient(
                config.getConfig().SUPABASE_URL,
                config.getConfig().SUPABASE_KEY
            ),
            inject: [ConfigService]
        },
        SupabaseService
    ],
    exports: ["SUPABASE_CLIENT",SupabaseService]
})
export class SupabaseModule{}